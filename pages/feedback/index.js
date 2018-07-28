var app = getApp()
var validateForm = require('../../validateForm/index.js');
var baseHttp = require('../../httpConfig.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },
  submitForm(e) {
    let _this = this;
    wx.getUserInfo({
      success: function (res) {
        _this.userInfo = res.userInfo;
        let userNickName = _this.userInfo.nickName;
        let feedbackContent = e.detail.value.feedbackContent;
        let checkFeedbackContent = validateForm.feedbackContent(feedbackContent, '请输入您的意见反馈');
        let checkUser = validateForm.checkUser(userNickName, '获取用户信息失败');
        if (checkUser && checkFeedbackContent) {
          wx.request({
            method: "POST",
            header: {
              "Content-Type": "application/json;charset=UTF-8"
            },
            url: baseHttp.baseUrl + '/api/gqz/open/submitFeedback',
            data: {
              feedbackContent: feedbackContent,
              nickName: userNickName
            },
            complete: function (res) {
              if (res == null || res.data == null) {
                wx.showToast({
                  title: '网络请求失败',
                  icon: 'none',
                  duration: 500
                });
              }
            },
            success(res) {
              wx.showToast({
                title: '反馈成功，我们会更加努力!',
                icon: 'none',
                duration: 500
              });
              setTimeout(() => {
                wx.switchTab({
                  url: '../../pages/about/index'
                })
              }, 1500);
            },
            fail(msg) {
              wx.showToast({
                title: '反馈失败，请稍后重试',
                icon: 'none'
              })
            },
            complete: function (res) {
              if (res == null || res.data == null) {
                wx.showToast({
                  title: '网络请求失败',
                  icon: 'none',
                  duration: 500
                });
              }
            }
          });
        }
      },
      fail(msg) {
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})