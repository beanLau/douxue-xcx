let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleDetail: {},
    pageIndex: 1,
    pageSize: 10,
    commentList: null,
    hasMore: true,
    commentValue: "",
    showMini: false,
    timer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      picBase: app.globalData.picBase,
      articleId: options.id,
      avatarUrl: app.globalData.userInfo.avatarUrl
    })
    this.getArticleDetail();
    this.getCommentList();
  },
  getCommentList: function(){
    let _this = this;
    let reqData = {
      pageIndex: _this.data.pageIndex,
      pageSize: _this.data.pageSize,
      articleId: _this.data.articleId
    }
    app.http({
      url: 'findCommentsByArticleId',
      data: reqData
    })
      .then(res => {
        let commentList = _this.data.commentList
        let resList = res.data.list;
        resList.map(item => {
          item.createTime = app.formatDbDate(item.created_at)
        })
        if (!commentList) {
          _this.setData({
            commentList: res.data.list
          })
        } else {
          _this.setData({
            commentList: [...commentList, ...res.data.list]
          })
        }
        if (res.data.pageIndex * res.data.pageSize >= res.data.total) {
          _this.setData({
            hasMore: false
          })
        }

      })
  },
  getArticleDetail: function(){
    wx.showLoading({
      title: '数据加载中',
    })
    let _this = this;
    app.http({
      url: 'findArticleById',
      data: {
        id: _this.data.articleId
      }
    })
      .then(res => {
        res.data.articleDetail.createTime = app.formatDbDate(res.data.articleDetail.created_at)
        _this.setData({
          articleDetail: res.data.articleDetail
        })
        wx.hideLoading()
      })
  },
  changeComment:function(e){
    this.setData({
      commentValue: e.detail.value
    })
  },
  tocomment: function (){
    wx.showLoading({
      title: '提交中',
    })
    let _this = this;
    app.http({
      url: 'xcxapi/addComment',
      data: {
        articleId: _this.data.articleId,
        content: _this.data.commentValue
      }
    })
      .then(res => {
        let resData = res.data
        resData.createTime = app.formatDbDate(resData.created_at)
        let commentList = _this.data.commentList
        if (!commentList){
          commentList = [_this.data.commentValue]
        }else{
          commentList.unshift(res.data)
        }
        _this.setData({
          commentValue: "",
          commentList: commentList
        })
        wx.hideLoading()
      })
  },
  toZan:function() {
    let _this = this;
    app.http({
      url: 'addLikeCount',
      data: {
        articleId: _this.data.articleId
      }
    })
      .then(res => {
        let articleDetail = _this.data.articleDetail
        articleDetail.likeCount = articleDetail.likeCount + 1
        _this.setData({
          articleDetail: articleDetail
        })
      })
  },
  onPageScroll: function(){
    let that = this;
    let timer = that.data.timer;
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      clearTimeout(timer)
      that.setData({
        timer: null,
        showMini: false
      })
    }, 1500)
    that.setData({
      timer: timer,
      showMini: true
    })
  },
  showShang: function(){
    wx.previewImage({
      current: 'https://xcxapi.douxue.top/images/zanshang.jpg', // 当前显示图片的http链接
      urls: ['https://xcxapi.douxue.top/images/zanshang.jpg'] // 需要预览的图片http链接列表
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
    if (!this.data.hasMore) {
      return
    }
    this.setData({
      pageIndex: ++this.data.pageIndex
    })
    this.getCommentList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})