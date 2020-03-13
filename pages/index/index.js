Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 1,
    tagList: [{
      name: "小程序",
      _id: "0"
    }, {
      name: "小程序",
      _id: "1"
    }, {
      name: "小程序",
      _id: "1"
    }, {
      name: "小程序",
      _id: "1"
    }, {
      name: "小程序",
      _id: "1"
    }, {
      name: "小程序",
      _id: "1"
    }],
    tagId: 0,
    articleList: [{
      "enable": false,
      "typeId": "",
      "typeName": "",
      "tagId": "5e6aed6efde1892f709eef9d",
      "tagName": "小程序",
      "specialId": "",
      "specialName": "",
      "readCount": 0,
      "likeCount": 0,
      "_id": "5e6b236199f8f4405a12adc2",
      "title": "微信小程序自定义token失效后重新获取token后重新调用接口。",
      "url": "/images/1584079701890.jpg",
      "content": "项目包含app端，小程序端。限制同一个用户无法在多端同时登陆，新登陆会顶掉后登陆的。因为小程序没有退出功能，如果进入页面获取数据时token失效了，无法获取数据，页面显示一片空白，用户体验会很差，所以检测到token失效后重新登陆并重新调用对应api接口。\n\n#### 实现方式：\n定义全局变量promiseQueue:[]来保存需要重新获取数据的异步请求参数，exeQueue来判断是否需要循环promiseQueue队列执行队列中的异步请求。\n```javascript\nglobalData: {\n    exeQueue: true,\n    promiseQueue: []\n}\n```\n\n#### 全局封装的登录接口，调用业务服务器通过code换取token\n```javascript\n/**\n   * 登录校验，获取openid\n   * successCb 获取用户信息成功回调\n   */\n  login: function (successCb) {\n    let that = this;\n    wx.login({\n      success: function (res) {\n        let requestObj = {\n          url: \"/xxx/login\",\n          method: 'post',\n          dataobj: {\n            code: res.code\n          },\n        }\n        wx.showLoading({\n          title: '努力加载中...',\n        })\n        that.promiseRequest(requestObj).then((res) => {\n          let resData = res.data.data;\n          if (res.data.code == \"000000\") { // 成功获取useInfo保存起来。\n            that.globalData.userInfo = resData;\n            successCb && successCb()\n          } else {\n            wx.hideLoading()\n            wx.showModal({\n              title: '提示',\n              content: res.data.errMsg || '网络错误！',\n              showCancel: false\n            })\n          }\n\n        }).catch((errMsg) => {\n          wx.hideLoading()\n          console.log(errMsg); //错误提示信息\n        });\n        wx.hideLoading()\n      }\n    })\n  },\n\n\n```\n#### 全局封装的promise接口：\n```javascript\n\t/**\n   * 封装的promise\n   * 参数： requestObj 请求成功回调\n   * throwError: true|false  如果传true则不判断code直接执行requestObj。否则code为100000时提示网络异常\n   */\n  promiseRequest: function (requestObj, throwError) {\n    let that = this;\n    return new Promise((resolve, reject) => {\n      //网络请求\n      wx.request({\n        url: that.globalData.apiUrl + requestObj.url,\n        method: requestObj.method,\n        header: {\n          ...that.globalData.userInfo,\n          source: 'wxMini'\n        },\n        data: JSON.stringify(requestObj.dataobj),\n        success: function (res) { //返回取得的数据\n          let promiseQueue = that.globalData.promiseQueue;\n          if (res.data.code == '000000' || throwError) {\n            if (requestObj.resolve){ //如果是promise队列中的请求。\n              requestObj.resolve(res);\n              let promiseQueueItem = promiseQueue.shift();\n              if (that.globalData.exeQueue){ //如果队列可执行则循环队列，保持队列只被循环一次。\n                that.globalData.exeQueue = false; //防止被多次循环。\n                while (promiseQueueItem) {\n                  that.promiseRequest(promiseQueueItem);\n                  promiseQueueItem = promiseQueue.shift();\n                  that.globalData.promiseQueue = promiseQueue;\n                }\n                if (!promiseQueueItem) {\n                  that.globalData.exeQueue = true;\n                  that.globalData.needBeginLogin = true;\n                }\n              }\n            }else{\n              resolve(res);\n            }\n          } else if (res.data.code == '600000' || res.data.code == '700000') { //token失效，重新调用login换取token\n            requestObj.resolve = resolve;\n            promiseQueue.push(requestObj); //请求失败了，把该请求放到promise队列，等待更新token后重新调用。\n            if (!that.globalData.needBeginLogin) { //如果不需要重新登录\n              return;\n            }\n            //防止重复调用login。\n            that.globalData.needBeginLogin = false;\n            that.login(() => { //获取完token以后执行回调\n            //重新登陆以后调用一次队列中的promise；并设置队列为可循环状态。\n              let promiseQueueItem = promiseQueue.shift();\n              if (promiseQueueItem) {\n                that.globalData.exeQueue = true;\n                that.promiseRequest(promiseQueueItem);\n                that.globalData.promiseQueue = promiseQueue;\n              }\n            }, true)\n          } else {\n            wx.hideLoading()\n            wx.showModal({\n              title: '提示',\n              content: res.data.message\n            })\n          }\n        },\n        error: function (e) {\n          wx.hideLoading()\n          reject(e);\n        }\n      })\n    });\n  }\n```\n\n#### 调用接口\n```javascript\n/*\n* 如果调用该接口是状态吗返回60000或70000，则需要重新调用login获取新的token。因为该次请求已失败，会把本次请求参数以及回到放到全局参数promiseQueue中，登录成功后会循环promiseQueue重新发起请求。\n*/\nlet requestObj = {\n      url: `/xxx/index`,\n      method: 'post'\n    };\n    wx.showLoading({\n      title: '努力加载中...',\n    })\n    app.promiseRequest(requestObj).then((res) => {\n      that.setData(res.data.data)\n      wx.hideLoading()\n    }).catch((errMsg) => {\n      wx.hideLoading()\n      console.log(errMsg);//错误提示信息\n    });\n```\n\n\n#### 其他解决方案\n上面代码逻辑有点复杂，不过仔细梳理一遍还是能看懂的。如果嫌麻烦可以使用下面方法\n```javascript\n\nthat.login(() => { //登录成功回调\n\tvar page = getCurrentPages().pop(); //获取当前页面实例\n\tif (page == undefined || page == null) return; \n\tpage.onLoad(); //调用实例的onLoad方法重新加载数据;\n}\n```\n当然这样会重新调用页面所有方法，如果有部分接口已经正确返回数据还会重新获取。如果能忍，这个更简单。",
      "created_at": "2020-03-13T06:08:33.456Z",
      "updated_at": "2020-03-13T06:08:33.456Z",
      "__v": 0
    }, {
      "enable": false,
      "typeId": "",
      "typeName": "",
      "tagId": "",
      "tagName": "",
      "specialId": "",
      "specialName": "",
      "readCount": 0,
      "likeCount": 0,
      "_id": "5e6b153b99f8f4405a12adc1",
      "title": "获取验证码，倒计时防止页面刷新后重新获取",
      "url": "/images/1584076079068.jpg",
      "content": "在登录或注册中少不了通过手机号获取验证码。\n一般获取验证码后会进行倒计时防止用户过快重复获取验证码。\n```javascript\nvar timer,enable = true;\n$('#sendcode').click(function(e){\n\tif(!enable || timer){\n\t\treturn ;\n\t}\n\tenable = !enable;\n\tsetTimeout(function(){ //模拟异步请求\n\t\t//获取验证码后提示，按钮显示倒计时\n\t\tvar _dura = 60;\n\t\ttimer = setInterval(function(){\n\t\t\t_dura--;\n\t\t\t//设置按钮文字\n\t\t\t···\n\t\t\tif(_dura === 0){\n\t\t\t\tenable = true\n\t\t\t\tclearInterval(timer);\n\t\t\t\ttimer = null；\n\t\t\t\t//设置按钮文字\n\t\t\t\t···\n\t\t\t}\n\t\t},1000)\n\t\t//ajax error 中设置enable = true\n\t},1000)\n})\n```\n虽然可以实现，但是浏览器刷新一下就可以重新获取了。可以把倒计时存到cookie中。\n```javascript\n\t//引入jqeury.cookie.js\n\t//定时器中设置倒计时时，更新cookie中的倒计时值。\n\t$.cookie(\"sendCode\", 60, { expires: 1 });\n\t\n\t//在页面记载完成后获取cookie对应值。如果有对应值，则开始倒计时\n\tif($.cookie(\"sendCode\")){\n\t\tvar _dura = $.cookie(\"sendCode\");\n\t\ttimer = setInterval(function(){\n\t\t\t_dura--;\n\t\t\t//设置按钮文字\n\t\t\t···\n\t\t\tif(_dura === 0){\n\t\t\t\tenable = true\n\t\t\t\tclearInterval(timer);\n\t\t\t\ttimer = null；\n\t\t\t\t//设置按钮文字\n\t\t\t\t···\n\t\t\t}\n\t\t},1000)\n\t}\n```\n当然存到cookie中后如果用户手动清除cookie，还是可以重新获取验证码。可以让服务器端配合实现\n```javascript\n//后台提供接口，通过sesstionid判断是否可重新获取\n//ajax 判断按钮是否可用 ，如果不可用进行倒计时。\n$.ajax({\n\t\turl: \"/getCode\",\n       success: function (res) {\n           if (res.code === '000000' && res.data.countdown != 0) {\n               var _dura = res.data.countdown;\n               timer = setInterval(function(){\n\t\t\t\t\t_dura--;\n\t\t\t\t\t//设置按钮文字\n\t\t\t\t\tif(_dura === 0){\n\t\t\t\t\t\tenable = true\n\t\t\t\t\t\tclearInterval(timer);\n\t\t\t\t\t\ttimer = null；\n\t\t\t\t\t\t//设置按钮文字\n\t\t\t\t\t}\n\t\t\t\t},1000)\n           }\n       },\n       error: function (res) {\n       }\n   });",
      "created_at": "2020-03-13T05:08:11.922Z",
      "updated_at": "2020-03-13T05:08:11.922Z",
      "__v": 0
    }, {
      "enable": false,
      "typeId": "",
      "typeName": "",
      "tagId": "5e6aedcbfde1892f709eefa0",
      "tagName": "ECMAScript",
      "specialId": "",
      "specialName": "",
      "readCount": 0,
      "likeCount": 0,
      "_id": "5e6b14a599f8f4405a12adc0",
      "title": "通过队列把同一个接口多次并行调用改为串行调用",
      "url": "/images/1584075912329.jpg",
      "content": "#### 1、需求描述\n小程序中实现答题功能，页面中只显示一道题（都是单选），用户选择答案以后提交用户该题的答案，并切换到一下题。\n#### 2、问题\n后台接口控制同一用户，同一个接口，在未响应之前不可再次调用。所以如果用户答题特别快（乱点）会造成同一接口并行调用。请求会直接被拦截，导致用户答案没有保存成功。\n####  3、解决方案\n定义页面全局变量promiseQueue:[]，用来将来保存需要执行的回调。定义hasResponse来维护当前是否还有未响应的接口。\n```javascript\ndata:{\n\tpromiseQueue: [],\n\thasResponse: true\n}\n```\n具体提交试题方法：\n```javascript\nsubmitQuestionRecord: function (id, itemId,cb) {\n    let that = this;\n    //promise队列，后台接口限制同一接口同一用户在接口未响应时不可再调用。该参数用来维护promise队列。如果有正在提交试题答案记录的promise，则加入到该队列。   对应请求完成后会检查该队列，如果队列有值会取出执行。\n    let promiseQueue = that.data.promiseQueue;\n    let hasResponse = that.data.hasResponse;\n    //如果没有未响应的或者需要执行队列中的promise则调用promise\n    //如果有未执行完的promise则加入队列，如果没有未执行完的提交试题答案请求或是再循环执行队列中的promise则直接发送promise请求。\n    //该处必须使用hasResponse不能通过promiseQueue.length = 0 判断。因promiseQueue.length = 0时最后的请求有可能还没有相应。必须加入到promise队列中。\n    if (hasResponse || arguments.length == 4){ \n      that.setData({\n        hasResponse: false\n      })\n      let requestObj = {\n        url: `/assessment/submitQuestionRecord`,\n        method: 'post',\n        dataobj: {\n          id: id,\n          itemId: itemId\n        }\n      };\n      app.promiseRequest(requestObj).then((res) => {\n        let promiseQueue = that.data.promiseQueue\n        let promiseQueueItem = promiseQueue.shift();\n        that.setData({\n          promiseQueue: promiseQueue\n        })\n        if (promiseQueueItem) { //如果promise队列中还有待发送的promise\n          that.submitQuestionRecord(promiseQueueItem.id, promiseQueueItem.itemId,promiseQueueItem.cb,true)\n        }else{\n          that.setData({\n            hasResponse: true\n          })\n        }\n        cb && cb();\n      }).catch((errMsg) => {\n        console.log(errMsg);//错误提示信息\n      });\n    } else { //吧promise加到队列，等待执行\n      let promiseQueue = that.data.promiseQueue;\n      promiseQueue.push({\n        id: id,\n        itemId: itemId,\n        cb: cb\n      })\n      that.setData({\n        promiseQueue: promiseQueue\n      })\n    }\n}\n```",
      "created_at": "2020-03-13T05:05:41.851Z",
      "updated_at": "2020-03-13T05:05:41.851Z",
      "__v": 0
    }]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  changeTabIndex: function(e) {
    let tabIndex = e.currentTarget.dataset.index;
    let tagId = "";
    if (tabIndex == 1) {

    } else if (tabIndex == 2) {
      tagId = -1;
    } else {
      tagId = this.data.tagList[0]["_id"]
    }
    this.setData({
      tabIndex: tabIndex,
      tagId: tagId
    })
  },
  changeTag: function (e) {
    let tagId = e.currentTarget.dataset.id;
    if (this.tagId == tagId){
      return
    }
    this.setData({
      tagId: tagId
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})