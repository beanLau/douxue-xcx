let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(options)
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
    this.getQuestionDetail()
  },
  getQuestionDetail(){
    let _this = this;
    app.http({
      url: 'xcxapi/getQuestionDetail',
      data: {
        id: _this.data.id
      }
    })
      .then(res => {
        _this.setData({
          detail: res.data
        })
      })
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