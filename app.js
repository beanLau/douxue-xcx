//app.js
import httpBase from '/utils/httpBase';
import utils from '/utils/util';
import polyfill from '/utils/polyfill'

App({
  globalData: {
    needBeginLogin: true,
    exeQueue: true,
    promiseQueue: [],
    unlockObj: {}, //分享解锁数据
    authorizeData: null, //微信授权信息
    userInfo: null,
    picBase: 'https://xcxapi.douxue.top'
  },
  //公共请求接口，请求头添加参数。
  http: function(reqData) {
    let that = this;
    let token, phone, openid;
    if (that.globalData.userInfo) {
      token = that.globalData.userInfo.token || '';
      openid = that.globalData.userInfo.openId || '';
    }
    reqData = Object.assign({
      dialog: false,
      navigationLoading: true,
      showError: true
    }, reqData)
    reqData.header = Object.assign({
      "Authorization": "Bearer " + (token || "")
    }, reqData.header || {})
    return httpBase.request.call(that, reqData, that)
  },
  onLaunch(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {

      }
    })
  },
  formatDbDate: function (data, fmt) {
    data = new Date(data)
    fmt = fmt || "yyyy-MM-dd"
    var o = {
      "M+": data.getMonth() + 1, // 月份
      "d+": data.getDate(), // 日
      "h+": data.getHours(), // 小时
      "m+": data.getMinutes(), // 分
      "s+": data.getSeconds(), // 秒
      "q+": Math.floor((data.getMonth() + 3) / 3), // 季度
      "S": data.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  onShow(options) {
    // this.login(() => { }, true)
  },
  /**
   * 登录校验，获取openid
   * successCb 获取用户信息成功回调
   * cantCheck :如果该值为true，不执行验证用户是否绑定手机号方法。(可以认为是更新用户信息的)
   */
  login: function(successCb, cantCheck) {
    let that = this;
    wx.login({
      success: function(res) {
        that.http({
          url: 'xcxapi/login',
          data: {
            code: res.code
          },
          navigationLoading: false
        }).then((res) => {
          let resData = res.data;
          that.globalData.userInfo = resData;
          if (!cantCheck) {
            successCb && successCb(resData.token);
            //that.checkUserLogin(successCb);
          } else {
            successCb && successCb(resData.token);
          }

        }).catch((errMsg) => {
          wx.showModal({
            title: '提示',
            content: res.msg || '网络错误！',
            showCancel: false
          })
        });
      }
    })
  },
  /**
   * 验证用户是否登录了（是否已绑定手机号）
   * 参数successCb：已登录（绑定手机号）的回调
   * cbUrl:登录成功后跳转的页面
   */
  checkUserLogin: function(successCb, examId) {
    let that = this;
    if (that.globalData.userInfo && that.globalData.userInfo.token) { //如果已获取用户token
      if (that.globalData.userInfo.isBindMobile == 1) { //如果用户已绑定手机号
        that.globalData.cbUrl = ''
        successCb();
      } else { //跳转到登录页面，登录成功后需要继续执行回调
        that.globalData.cbUrl = utils.getCurrentPageUrlWithArgs() //设置全局url，回来后再执行回调。
        that.globalData.loginedCb = successCb;
        wx.navigateTo({
          url: '../authorize/authorize',
        })
      }
    } else { //去获取用户openid
      that.login(successCb, false, examId);
    }
  },
  /**
   * 支付接口
   * timeStamp：时间戳
   * nonceStr：随机字符串
   * _package：统一下单接口返回的 prepay_id 参数值
   * signType：签名算法
   * paySign：签名
   * successCb：支付成功回调
   * errorCb：支付失败回调
   */
  interfacePay: function(timeStamp, nonceStr, _package, signType, paySign, successCb, errorCb) {
    let that = this;
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': _package,
      'signType': signType,
      'paySign': paySign,
      'success': function(res) {
        // wx.requestSubscribeMessage({
        //   tmplIds: [''],
        //   success(res) { }
        // })
        typeof successCb == "function" && successCb(res)
      },
      'fail': function(res) {
        typeof errorCb == "function" && errorCb(res)
      }
    })
  },
  /**
   * 获取广告位数据
   * params id  广告位id
   * return Object
   */
  getAdvertisement(id) {
    return this.http({
      url: 'index/getadvertisement',
      data: {
        id: id
      }
    })
  },
  getBaseUrlOptions() {
    return `&examId=${this.globalData.examId}&subjectId=${this.globalData.subjectId}`
  },
  // 获取单个试题详情 
  getOneQuestionDetail(id, examId, subjectId) {
    return this.http({
      url: 'examPoint/getOneQuestionDetail',
      header: {
        examId: examId,
        subjectId: subjectId
      },
      data: {
        id: id
      }
    })
  },
  /**
   * 通用模块跳转方式
   * 参数  {
   *          type: Number,
   *           typaAction: Number
   *      }   
   * 
   */
  getModuleMethod(obj = {
    type: 0,
    typeaction: 0,
    title: '',
    tagid: '',
    scene: null
  }) {
    let type = obj.type,
      typeAction = obj.typeaction,
      scene = obj.scene;
    switch (type) {
      case 0: //普通功能区
        switch (typeAction) {
          case 0: //不进行任何操作
            break;
          case 1: //打开网址
            break;
          case 2: //打开客服会话
            switch (scene) {
              case 0: //底部导航栏免费领 
                break;
              case 1: //章节课ios 领取
                break;
              case 2: //2章节课分享领取 
                break;
              case 3: // 模拟考试 ios 领取
                break;
              case 4: //高平题库 ios领取
                break;
              case 5: //通关密卷 ios 领取
                break;
              case 6: //考前押题ios 领取
                break;
              case 7: //区分公众号
                wx.navigateTo({
                  url: '/pages/contactTencent/contactTencent'
                })
                break;
              case 8: //引导下载app 
                break;
            }
            break;
        }
        break;
      case 1: //系统功能区
        switch (typeAction) {
          case 0: //首页
            break;
          case 1: //学习首页
            break;
          case 2: //专属老师
            break;
          case 3: //优惠券列表
            break;
          case 4: //优惠券详情
            break;
          case 5: //订单列表
            break;
          case 6: //订单详情
            break;
          case 7: //资料领取
            wx.navigateTo({
              url: '/pages/freeCollectionTransfer/freeCollectionTransfer'
            })
            break;
        }
        break;
      case 2: //题库功能区
        switch (typeAction) {
          case 0: //每日一练
            wx.navigateTo({
              url: '/pages/navEveryDayList/navEveryDayList'
            })
            break;
          case 1: //考点练习
            wx.navigateTo({
              url: '/pages/navExamExerciseList/navExamExerciseList'
            })
            break;
          case 2: //历年真题
            wx.navigateTo({
              url: '/pages/examList/examList?paperType=0'
            })
            break;
          case 3: //模拟试题
            wx.navigateTo({
              url: '/pages/examList/examList?paperType=1'
            })
            break;
          case 4: //高频题库
            wx.navigateTo({
              url: '/pages/navHighQuestList/navHighQuestList'
            })
            break;
          case 5: //错题练习
            wx.navigateTo({
              url: '/pages/wrongList/wrongList'
            })
            break;
          case 6: //自定义模块试卷
            wx.navigateTo({
              url: `/pages/examList/examList?tagId=${obj.tagid}&title=${obj.title}`
            })
            break;
          case 7: //试卷详情页
            break;
          case 8: //每日一练刷题页
            break;
        }
        break;
      case 3: //章节课功能区
        switch (typeAction) {
          case 0: //章节课列表
            break;
          case 1: //章节课播放
            break;
        }
        break;
      case 4: //精品课程功能区
        switch (typeAction) {
          case 0: //精品课首页
            wx.switchTab({
              url: '/pages/setmealList/setmealList?scrollTop'
            })
            break;
          case 1: //精品课详情页
            break;
          case 2: //考试套餐详情页
            break;
          case 3: //课程播放页
            break;
          case 4: //课程列表页
            wx.switchTab({
              url: '/pages/setmealList/setmealList'
            })
            break;
          case 5: //直播列表页
            wx.navigateTo({
              url: '/pages/liveList/liveList',
            })
            break;
          case 7: //拼团列表
            wx.navigateTo({
              url: '/pages/spellGroupList/spellGroupList',
            })
            break;

        }
        break;
    }
  }

})