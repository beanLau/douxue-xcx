let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 1,
    tagList: [],
    tagId: "",
    title: "",
    pageIndex: 1,
    pageSize: 10,
    articleList: null,
    hasMore: true,
    showGetUserInfo: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      picBase: app.globalData.picBase
    })
    if (app.globalData.userInfo && app.globalData.userInfo.token){
      this.init()
    }else{
      app.login(()=>{
        this.init();
      })
    }
  },
  init: function () {
    this.getArticleList();
    this.getTagList();
    this.checkShowAuthor()
  },
  checkShowAuthor: function(){
    if (app.globalData.userInfo && app.globalData.userInfo.nickName) {
      return
    }
    this.setData({
      showGetUserInfo: true
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
          app.globalData.userInfo = Object.assign(app.globalData.userInfo,res.data)
        })
    }
    _this.setData({
      showGetUserInfo: false
    })
  },
  toArticleDetail: function(e){
    wx.navigateTo({
      url: '/pages/articleDetail/articleDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  changeTitle: function(e){
    this.setData({
      title: e.detail.value
    })
  },
  getTagList: function () {
    let _this = this;
    app.http({
      url: 'findAllTags'
    })
      .then(res => {
        
        _this.setData({
          tagList: res.data.list
        })
      })
  },
  getArticleList: function () {
    wx.showLoading({
      title: '加载中',
    })
    let _this = this;
    let reqData = {
      pageIndex: _this.data.pageIndex,
      pageSize: _this.data.pageSize
    }
    if(_this.data.title){
      reqData.title = _this.data.title
    }
    if(_this.data.tagId){
      reqData.tagId = _this.data.tagId
    }
    app.http({
      url: 'xcxapi/getArticleList',
      data: reqData
    })
      .then(res => {
        let articleList = _this.data.articleList
        let resList = res.data.list
        resList.map(item => {
          item.createTime = app.formatDbDate(item.created_at)
        })
        if (!articleList){
          _this.setData({
            articleList: resList
          })
        }else{
          _this.setData({
            articleList: [...articleList,...resList]
          })
        }
        if (res.data.pageIndex * res.data.pageSize >= res.data.total){
          _this.setData({
            hasMore: false
          })
        }
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
  },
  toSearch: function () {
    this.setData({
      tagId: "",
      hasMore: true
    })
    this.refresh()
  },
  refresh: function(){
    this.setData({
      pageIndex: 1,
      articleList: null,
      hasMore: true
    })
    this.getArticleList()
  },
  changeTabIndex: function(e) {
    let tabIndex = e.currentTarget.dataset.index;
    let tagId = "";
    if (tabIndex === this.data.tabIndex){
      return
    }
    if (tabIndex == 2) {
      tagId = -1;
    } else if (tabIndex == 3){
      tagId = this.data.tagList[0]["_id"]
    }
    this.setData({
      tabIndex: tabIndex,
      tagId: tagId,
      title: "",
      hasMore: true
    })
    this.refresh()
  },
  changeTag: function (e) {
    let tagId = e.currentTarget.dataset.id;
    if (this.tagId == tagId){
      return
    }
    this.setData({
      tagId: tagId,
      title: "",
      hasMore: true
    })
    this.refresh()
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
    this.refresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if(!this.data.hasMore){
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
  onShareAppMessage: function() {

  }
})