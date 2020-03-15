let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    pageSize: 10,
    articleList: null,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      picBase: app.globalData.picBase,
      specialId: options.id
    })
    wx.setNavigationBarTitle({
      title: options.name || "文章列表",
    })
    this.getArticleList();
  },
  getArticleList: function () {
    wx.showLoading({
      title: '加载中',
    })
    let _this = this;
    let reqData = {
      pageIndex: _this.data.pageIndex,
      pageSize: _this.data.pageSize,
      specialId: _this.data.specialId
    }
    app.http({
      url: 'xcxapi/getArticleListBySpecial',
      data: reqData
    })
      .then(res => {
        let articleList = _this.data.articleList
        let resList = res.data.list;
        // resList.map(item=>{
        //   item.createTime = app.formatDbDate(item.created_at)
        // })
        if (!articleList) {
          _this.setData({
            articleList: res.data.list
          })
        } else {
          _this.setData({
            articleList: [...articleList, ...res.data.list]
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
  toArticleDetail: function (e) {
    wx.navigateTo({
      url: '/pages/articleDetail/articleDetail?id=' + e.currentTarget.dataset.id,
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
      articleList: null
    })
    this.getArticleList()
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
    this.getArticleList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})