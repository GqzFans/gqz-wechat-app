var baseHttp = require('../../httpConfig.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    tabActivate: 0,
    // 全局相关
    scrollH: 0,
    // 图片相关
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    imageList1: [],
    imageList2: [],
    // 表情包相关
    emoticonWidth: 0,
    emoticonLoadingCount: 0,
    emoticons: [],
    emoticonList1: [],
    emoticonList2: [],
    // 全局分页
    pageSize: 10,
    // 图片分页
    imagePageNum: 1,
    imageTotalPage: 0,
    // 表情包分页
    emoticonPageNum: 1,
    emoticonTotalPage: 0
  },
  /**
   * 滑动切换tab 
   */
  bindChange: function(e) {
    this.setData({
      currentTab: e.detail.current
    })
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tabActivate: e.target.dataset.current,
        currentTab: e.target.dataset.current
      })
    }
  },

  /** 
   * 预览图片
   */
  previewImage: function(e) {
    var current = e.target.dataset.src.imageUrl;
    var showImageUrls = [];
    showImageUrls.push(current);
    wx.previewImage({
      // 当前显示图片的链接
      current: current,
      // 需要预览的图片链接列表-数据类型为数组
      urls: showImageUrls
    })
  },
  /** 
   * 预览表情包
   */
  previewEmoticon: function(e) {
    var current = e.target.dataset.src.emoticonUrl;
    var showEmoticonUrls = [];
    showEmoticonUrls.push(current);
    wx.previewImage({
      // 当前显示表情包的链接
      current: current,
      // 需要预览的表情包链接列表-数据类型为数组
      urls: showEmoticonUrls
    })
  },




  /** 
   * 图片
   */
  /** 
   * 计算图片大小，渲染加载 
   */
  onImageLoad: function(e) {
    let imageId = e.currentTarget.id;
    // 图片原始宽度
    let oImgW = e.detail.width;
    // 图片原始高度
    let oImgH = e.detail.height;
    // 图片设置的宽度
    let imgWidth = this.data.imgWidth;
    // 比例计算
    let scale = imgWidth / oImgW;
    // 自适应高度
    let imgHeight = oImgH * scale;
    // 图片对象
    let images = this.data.images;
    let imageObj = {};
    // Image
    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id === imageId) {
        imageObj = img;
        break;
      }
    }
    imageObj.height = imgHeight;
    let loadingCount = this.data.loadingCount - 1;
    let imageList1 = this.data.imageList1;
    let imageList2 = this.data.imageList2;
    // 判断当前图片添加到左列还是右列
    if (imageList1.length <= imageList2.length) {
      imageList1.push(imageObj);
    } else {
      imageList2.push(imageObj);
    }
    // 赋值
    let data = {
      loadingCount: loadingCount,
      imageList1: imageList1,
      imageList2: imageList2
    };
    // 当前这组图片已加载完毕，则清空图片临时加载区域的内容
    if (!loadingCount) {
      data.images = [];
    }
    this.setData(data);
  },
  loadImages: function() {
    let _this = this;
    let images = [];
    // 图片页数计算
    if ((_this.data.imagePageNum === 1) || (_this.imageTotalPage >= _this.data.imagePageNum)) {
      console.log('判断图片是否为最后一页：当前加载图片页数：', _this.data.imagePageNum);
    } else {
      console.log('判断图片是否为最后一页：暂时没有更多图片啦');
      wx.showToast({
        title: '暂时没有更多图片啦',
        icon: 'none'
      })
      return false;
    }
    // 判断图片是否仅有一页
    console.log('判断图片是否仅有一页：当前页数 = ', _this.data.imagePageNum + 
      '；总页数 = ', _this.imageTotalPage);
    if ((_this.data.imagePageNum === 1) && (_this.imageTotalPage === 1)) {
      console.log('判断图片是否仅有一页：暂时没有更多图片啦');
      wx.showToast({
        title: '暂时没有更多图片啦',
        icon: 'none'
      })
      return false;
    }
    // AJAX
    wx.request({
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      url: baseHttp.baseUrl + '/api/gqz/open/appGetGqzImageList',
      data: {
        pageNum: _this.data.imagePageNum,
        pageSize: _this.data.pageSize
      },
      success(res) {
        images = res.data.result.list;
        // 最大页数
        _this.imageTotalPage = res.data.result.pages;
        // 页数增加
        if (_this.imageTotalPage >= _this.data.imagePageNum) {
          _this.data.imagePageNum++;
        }
        // 图片webp处理
        for (var i = 0; i < images.length; i++) {
          // images[i].imageUrl = images[i].imageUrl + '?x-oss-process=style/webp';
          images[i].imageUrl = images[i].imageUrl;
        }
        // 赋值处理
        _this.setData({
          loadingCount: images.length,
          images: images
        });
      },
      fail(msg) {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      },
      complete: function(res) {
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
   * 表情包
   */
  /** 
   * 计算表情包大小，渲染加载
   */
  onEmoticonLoad: function(e) {
    let emoticonId = e.currentTarget.id;
    // 表情包原始宽度
    let oEmoticonW = e.detail.width;
    // 表情包原始高度
    let oEmoticonH = e.detail.height;
    // 表情包设置的宽度
    let emoticonWidth = this.data.imgWidth;
    // 比例计算
    let emoticonScale = emoticonWidth / oEmoticonW;
    // 自适应高度
    let emoticonHeight = oEmoticonH * emoticonScale;
    // 表情包对象
    let emoticons = this.data.emoticons;
    let emoticonObj = {};
    // Emoticon
    for (let i = 0; i < emoticons.length; i++) {
      let emoticon = emoticons[i];
      if (emoticon.id === emoticonId) {
        emoticonObj = emoticon;
        break;
      }
    }
    emoticonObj.height = emoticonHeight;
    let emoticonLoadingCount = this.data.loadingCount - 1;
    let emoticonList1 = this.data.emoticonList1;
    let emoticonList2 = this.data.emoticonList2;
    // 判断当前图片添加到左列还是右列
    if (emoticonList1.length <= emoticonList2.length) {
      emoticonList1.push(emoticonObj);
    } else {
      emoticonList2.push(emoticonObj);
    }
    // 赋值
    let data = {
      emoticonLoadingCount: emoticonLoadingCount,
      emoticonList1: emoticonList1,
      emoticonList2: emoticonList2
    };
    // 当前这组图片已加载完毕，则清空图片临时加载区域的内容
    if (!emoticonLoadingCount) {
      data.emoticons = [];
    }
    this.setData(data);
  },
  loadEmoticons: function() {
    let _this = this;
    let emoticons = [];
    // 表情包页数计算
    if ((_this.data.emoticonPageNum === 1) || (_this.emoticonTotalPage >= _this.data.emoticonPageNum)) {
      console.log('判断表情包是否为最后一页：当前加载表情包页数：', _this.data.emoticonPageNum);
    } else {
      console.log('判断表情包是否为最后一页：暂时没有更多表情包啦');
      wx.showToast({
        title: '暂时没有更多表情包啦',
        icon: 'none'
      })
      return false;
    }
    // 判断表情包是否仅有一页
    console.log('判断表情包是否仅有一页：当前页数 = ', _this.data.emoticonPageNum +
      '；总页数 = ', _this.emoticonTotalPage);
    if ((_this.data.emoticonPageNum === 1) && (_this.emoticonTotalPage === 1)) {
      console.log('判断表情包是否仅有一页：暂时没有更多表情包啦');
      wx.showToast({
        title: '暂时没有更多表情包啦',
        icon: 'none'
      })
      return false;
    }
    wx.request({
      method: "POST",
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      url: baseHttp.baseUrl + '/api/gqz/open/appGetGqzEmoticonList',
      data: {
        pageNum: _this.data.emoticonPageNum,
        pageSize: _this.data.pageSize
      },
      success(res) {
        emoticons = res.data.result.list;
        // 最大页数
        _this.emoticonTotalPage = res.data.result.pages;
        // 页数增加
        if (_this.emoticonTotalPage >= _this.data.emoticonPageNum) {
          _this.data.emoticonPageNum++;
        }
        // 赋值处理
        _this.setData({
          emoticonLoadingCount: emoticons.length,
          emoticons: emoticons
        });
      },
      fail(msg) {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        })
      },
      complete: function(res) {
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
  onLoad: function() {
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.5;
        let scrollH = wh;
        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });
        // 加载首组图片
        this.loadImages();
        this.loadEmoticons();
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
  onReachBottom: function() {
    // let _this = this;
    // if (_this.data.currentTab === 0) {
    //   if (_this.imageTotalPage > _this.data.imagePageNum) {
    //     _this.data.imagePageNum++;
    //     console.log('_this.data.imagePageNum = ', _this.data.imagePageNum);
    //     // 加载图片
    //     // _this.loadImages();
    //   } else {
    //     wx.showToast({
    //       title: '暂时没有更多图片啦',
    //       icon: 'none'
    //     })
    //   }
    // } else {
    //   wx.showToast({
    //     title: '暂时没有更多表情包啦',
    //     icon: 'none'
    //   })
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})