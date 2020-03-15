/**
 * @descr 请求封装-promise
 * @method httpBase
 * @param {object} reqData 请求参数,包含url,method,data字段
 * @param {boolean} dialog 是否显示加载中，默认false
 * @param {boolean} navigationLoading 是否显示导航条加载动画，默认true
 * @return promise
 */
export default new class httpBase {
  request(reqData,app) {
    //let baseUrl = 'http://127.0.0.1:3000/';
    let baseUrl = 'https://xcxapi.douxue.top/';
    let url = '';
    if (reqData.url.indexOf('http') > -1){
      url = reqData.url
    }else{
      url = baseUrl + reqData.url
    }

    reqData.dialog && wx.showLoading(Object.assign({
      title: '加载中',
      mask: true
    }, reqData.dialog));
    reqData.navigationLoading && wx.showNavigationBarLoading();

    // 返回一个promise
    return new Promise((resolve, reject) => {
      let reqBeginTime = new Date().getTime();
      wx.request({
        header: reqData.header,
        url: url,
        method: reqData.method || 'POST',
        data: reqData.data || '',
        success(res) {
          //console.log(`${url}：请求响应耗时：${new Date().getTime() - reqBeginTime}毫秒`)
          let promiseQueue = app.globalData.promiseQueue;
          if (res.data.code == 401){ //如果登录失效，重新获取token，获取成功后重置header中token，保存上次resolve并重新发起请求
            reqData.resolve = resolve;
            promiseQueue.push(reqData); //请求失败了，把该请求放到promise队列，等待更新token后重新调用。
            if (!app.globalData.needBeginLogin) { //如果不需要重新登录
              return;
            }
            app.globalData.needBeginLogin = false;
            app.login((token) => { //获取完token以后执行回调
              //重新登陆以后调用一次队列中的promise；并设置队列为可循环状态。
              let promiseQueueItem = promiseQueue.shift();
              if (promiseQueueItem) {
                app.globalData.exeQueue = true;
                reqData.header.Authorization = "Bearer " + token
                app.http(reqData)
                app.globalData.promiseQueue = promiseQueue;
              }
            }, true)
          }else if (res.data.code === 0) {
            if (reqData.resolve) {//如果是promise队列中的请求。
              reqData.resolve(res.data);
              let promiseQueueItem = promiseQueue.shift();
              if (app.globalData.exeQueue) { //如果队列可执行则循环队列，保持队列只被循环一次。
                app.globalData.exeQueue = false; //防止被多次循环。
                while (promiseQueueItem) {
                  reqData.header.Authorization = "Bearer " + app.globalData.userInfo.token
                  app.http(promiseQueueItem)
                  promiseQueueItem = promiseQueue.shift();
                  app.globalData.promiseQueue = promiseQueue;
                }
                if (!promiseQueueItem) {
                  app.globalData.exeQueue = true;
                  app.globalData.needBeginLogin = true;
                }
              }
            reqData.dialog && wx.hideLoading();
            reqData.navigationLoading && wx.hideNavigationBarLoading();
              return
            }
            reqData.dialog && wx.hideLoading();
            reqData.navigationLoading && wx.hideNavigationBarLoading();
            resolve(res.data);
            if (reqData.resolve){ //如果是token失效，重新发起的请求，执行对应回调。
              reqData.resolve(res.data)
            }
          } else {
            reqData.dialog && wx.hideLoading();
            reqData.navigationLoading && wx.hideNavigationBarLoading();
            if (!reqData.showError){
              return
            }
            wx.showToast({
                title: res.data.msg.split(';')[0] || '网络错误',
                icon: 'none'
            })
          }
        },
        fail(error) {
          reqData.dialog && wx.hideLoading();
          reqData.navigationLoading && wx.hideNavigationBarLoading();
          if (!reqData.showError) {
            return
          }
          wx.showToast({
            title: error,
            icon: 'none'
          })
        }
      })
    })

  }
}