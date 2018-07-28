var baseHttp = require('../../httpConfig.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 全局相关
    scrollH: 0,
    loadingCount: 0,
    pageNum: 1,
    // 此处分页存在bug，chrome内核可用，真机适配无效
    pageSize: 100,
    videos: []
  },
  loadVideos: function() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let _this = this;
    // AJAX
    wx.request({
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      url: baseHttp.baseUrl + '/api/gqz/open/appGetGqzVideoList',
      data: {
        pageNum: _this.data.pageNum,
        pageSize: _this.data.pageSize
      },
      success(res) {
        if (_this.data.pageNum > res.data.result.lastPage) {
          wx.hideLoading();
          wx.showToast({
            title: "没有更多视频啦",
            icon: 'none'
          })
        } else {
          let temp = _this.data.videos;
          res.data.result.list.forEach(item => temp.push(item));
          // 赋值处理
          _this.setData({
            loadingCount: _this.data.videos.length,
            videos: temp,
            pageNum: _this.data.pageNum + 1
          });
        }
      },
      fail(msg) {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      },
      complete: function (res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 300);
        if (res == null || res.data == null) {
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        this.setData({
          scrollH: wh
        });
        // 加载首组视频
        this.loadVideos();
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})