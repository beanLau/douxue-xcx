/**
 * 作者：刘伟涛
 * 日期：2019-06-10
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {

    starValue: {
      type: Number,
      value: 0
    },
    disable: {
      type: Boolean,
      value: true
    },
    showText: {
      type: Boolean,
      value: false
    },
    small: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/no-star.png',
    selectedSrc: '../../images/full-star.png',
    halfSrc: '../../images/half-star.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击左边,半颗星
    selectLeft: function (e) {
      if (this.data.disable) {
        return;
      }
      var key = e.currentTarget.dataset.key
      if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
        //只有一颗星的时候,再次点击,变为0颗
        key = 0;
      }
      //count = key
      this.setData({
        starValue: key
      })
      this.triggerEvent('starevent', { starValue: key }, {})
    },
    //点击右边,整颗星
    selectRight: function (e) {
      if (this.data.disable) {
        return;
      }
      var key = e.currentTarget.dataset.key
      //count = key
      this.setData({
        starValue: key
      })
      this.triggerEvent('starevent', { starValue: key }, {})
    },
    resetValue() {
      if (this.data.disable) {
        return;
      }
      this.setData({
        starValue: 0.00
      })
      this.triggerEvent('starevent', { starValue: 0.00 }, {})
    },
    startRating: function (e) {
      wx.showModal({
        title: '分数',
        content: "" + count,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }
  }
})
