let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: null,
    typeArr: ['', '[单选题]', '[多选题]', '[简述题]', '[判断题]'],
    questionTypeStr: '',
    currentIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getQuesstionList()
  },
  getQuesstionList(){
    let _this = this;
    app.http({
      url: 'xcxapi/getTodayQuesstions'
    })
      .then(res => {
        _this.setData({
          questionList: res.data.questionList
        })
        _this.setQuestionType()
      })
  },
  tabChange(e) {
    let currentIndex = e.detail.current;
    //设置当前第几题
    this.setData({
      currentIndex: currentIndex
    })
    //根据题号，拿到对应试题信息设置头部试题类型
    this.setQuestionType();
  },

  /**
   * 设置头部试题类型
   */
  setQuestionType() {
    let questionIndex = this.data.currentIndex;
    let typeArr = this.data.typeArr;
    let questionList = this.data.questionList;
    let type = questionList[questionIndex].questionType
    this.setData({
      questionTypeStr: typeArr[type]
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