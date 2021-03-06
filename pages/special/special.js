let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    pageSize: 10,
    specialList: null,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSpecialList();
  },
  getSpecialList: function (){
    wx.showLoading({
      title: '加载中',
    })
    let _this = this;
    let reqData = {
      pageIndex: _this.data.pageIndex,
      pageSize: _this.data.pageSize
    }
    app.http({
      url: 'findSpecials',
      data: reqData
    })
      .then(res => {
        let specialList = _this.data.specialList
        if (!specialList) {
          _this.setData({
            specialList: res.data.list
          })
        } else {
          _this.setData({
            specialList: [...specialList, ...res.data.list]
          })
        }
        if (res.data.pageIndex * res.data.pageSize >= res.data.total) {
          _this.setData({
            hasMore: false
          })
        }
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
  },
  toArticleList: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.title
    wx.navigateTo({
      url: `/pages/articlelist/articlelist?id=${id}&name=${name}`,
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
    this.setData({
      pageIndex: 1,
      hasMore: true,
      specialList: null
    })
    this.getSpecialList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.hasMore) {
      return
    }
    this.setData({
      pageIndex: ++this.data.pageIndex
    })
    this.getSpecialList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})