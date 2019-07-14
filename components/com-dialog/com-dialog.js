/*
 * @example: <com-dialog has-title="{{true}}" title-text="您好" is-show="{{true}}" is-btn="{{true}}" bindcanceltap="onCancelTap" bindconfimtap="onConfimTap" is-one-btn="false"></com-dialog>
 */
Component({
  properties: {
    isShare: {//是否是章节课分享
      type: Boolean,
      value: false
    },
    hasTitle: {//是否显示标题 默认显示
      type: Boolean,
      value: true
    },
    titleText: {//标题文字
      type: String,
      value: '标题'
    },
    isShow: {//是否显示弹窗 默认不显示
      type: Boolean,
      value: false
    },
    isBtn: {//是否有btn按钮,默认没有
      type: Boolean,
      value: false
    },
    isOneBtn: {//是否一个按钮
      type: Boolean,
      value: false
    },
    cancelText: {//取消按钮文字
      type: String,
      value: '取消'
    },
    confirmText: {//确定按钮文字
      type: String,
      value: '确定'
    },
    isCloseBtn: {//是否有关闭按钮,默认有
      type: Boolean,
      value: true
    },
    isImgTitle: {//是否有图片头部
      type: Boolean,
      value: false
    },
    isConfirmBtn: { //是否一个按钮时是确定按钮
      type: Boolean,
      value: false
    }
  },
  observers: {
    'isShow': function (e) {
      this.triggerEvent('observerisshow', e);
    }
  },
  data: {

  },
  methods: {
    // 关闭
    close() {
      this.setData({
        isShow: false
      });
      this.triggerEvent('closecbllback', this.data)
    },
    // 取消按钮事件
    onCancelTap() {
      this.triggerEvent('canceltap');
    },
    // 确定按钮事件
    onConfirmTap() {
      this.triggerEvent('confimtap');
    }
  }
})
