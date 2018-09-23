// pages/say/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  data: {
    scrollTop: {
      scroll_top: 0
    }
  },
  onLoad: function () {
    this.getUserInfo();
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

  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    console.log('mod say get userinfo');
    let _this = this;
    wx.getUserInfo({
      success: function (res) {
        console.log(res.encryptedData)
      },
      fail(msg) {
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        })
      }
    })
  },
  onGotUserInfo: function (e) {
    console.log(e.detail.encryptedData)
  },
  goTopFun: function (e) {
    var _top = this.data.scrollTop.scroll_top;
    if (_top == 1) {
      _top = 0;
    } else {
      _top = 1;
    }
    this.setData({
      'scrollTop.scroll_top': _top
    });
    console.log(this.data.scrollTop)
  }
})