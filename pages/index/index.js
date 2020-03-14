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
    hasMore: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      picBase: app.globalData.picBase
    })
    this.init()
  },
  init: function () {
    app.login(() => {
      this.getArticleList();
      this.getTagList();
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
        if (!articleList){
          _this.setData({
            articleList: res.data.list
          })
        }else{
          _this.setData({
            articleList: [...articleList,...res.data.list]
          })
        }
        if (res.data.pageIndex * res.data.pageSize >= res.data.total){
          _this.setData({
            hasMore: false
          })
        }
        
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
    if (tabIndex == 1) {

    } else if (tabIndex == 2) {
      tagId = -1;
    } else {
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