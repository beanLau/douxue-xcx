let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{

    },
    soulContent: "宝刀锋从磨砺出，梅花香自苦寒来",
    navModule: [[{
      iconUrl: "/images/nav01.png",
      title: "每日一练",
      type: 1
    },{
      iconUrl: "/images/nav02.png",
      title: "专题练习",
      type: 2
    },{
      iconUrl: "/images/nav04.png",
      title: "AI面试",
      type: 3
    },{
      iconUrl: "/images/nav03.png",
      title: "错题练习",
      type: 4
    }]],
    recommendList:[{
      _id: 1,
      title:"页面导入样式时，使用link和@import有什么区别？",
      difficulty: 1,
      doCount: 32
    },{
      _id: 2,
      title:"圣杯布局和双飞翼布局的理解和区别，并用代码实现",
      difficulty: 1,
      doCount: 32
    },{
      _id: 3,
      title:"用递归算法实现，数组长度为5且元素的随机数在2-32间不重复的值",
      difficulty: 1,
      doCount: 32
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    if (app.globalData.userInfo && app.globalData.userInfo.token) {
      this.init()
    } else {
      app.login(() => {
        this.setData({
          userInfo: app.globalData.userInfo
        })
        this.init();
      })
    }
  },
  init(){
    this.getTagList();
  },
  getTagList(){
    let _this = this;
    app.http({
      url: 'xcxapi/getTodayQuesstions'
    })
      .then(res => {
        console.log(res)
      })
  },
  getWxUserInfo: function (res) {
    let _this = this;
    let rawData
    if (res.detail) { //用户点击按钮触发。
      rawData = res.detail.rawData || ''
    }
    if (!rawData) { //拒绝授权
      wx.showModal({
        title: '提示',
        content: '拒绝获取用户信息权限，您将无法获取完整用户体验!',
        confirmText: '知道了',
        showCancel: false
      })
    } else {
      app.http({
        url: 'xcxapi/updateUserWxInfo',
        data: rawData
      })
        .then(res => {
          app.globalData.userInfo = Object.assign(app.globalData.userInfo, res.data);
          _this.setData({
            userInfo: app.globalData.userInfo
          })
        })
    }
  },
  navigateModule(e){
    let type = e.currentTarget.dataset.type;
    switch(type){
      case 1:
        //跳转到每日一练去做题
        
        break;
      case 2:
        wx.showToast({
          title: '功能开发中,敬请期待!',
          icon: 'none'
        })
        //功能开发中
        break;
      case 3:
        wx.showToast({
          title: '功能开发中,敬请期待!',
          icon: 'none'
        })
        //功能开发中
        break;
      case 4:
        wx.showToast({
          title: '功能开发中,敬请期待!',
          icon: 'none'
        })
        //功能开发中
        break;
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})