// pages/shop/shop.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsid: "",
    goodsname: "",
    url: app.globalData.url,
    src:"",
    //用户名字
    nickname: app.globalData.nickname,
    //用户头像
    headimg: app.globalData.headimg,
    //用户积分
    integral: app.globalData.integral,
    userinfo: true,
    //页面数据
    goodsdata:[],
    ping_type:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nickname: app.globalData.nickname,
      headimg: app.globalData.headimg,
      integral: app.globalData.integral
    });
    if (this.data.nickname == "") {
      this.setData({
        userinfo: false,
      });
    }
    if (options.id){
      this.setData({
        goodsid: options.id,
      });
    }
    if (options.name) {
      this.setData({
        goodsname: options.name,
      });
    }
    if (options.src) {
      this.setData({
        src: options.src,
      });
    }
    if (options.ping_type) {
      this.setData({
        ping_type: options.ping_type,
      });
    }
    wx.showLoading({
      title: '拼命加载中',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.goodsajax();
    this.indexajax();
    app.action_member_log("goods", this.data.goodsid);
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.indexajax();
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
    let that = this;
    wx.showShareMenu({
      withShareTicket: true,
      success(res) {
        app.click_interaction("zfxcx")
      },
    })
  },
  //获取列表接口
  goodsajax:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key);
    wx.request({
      url: app.globalData.url + '/Product/lists', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'openid': app.globalData.openid,
        'absign': str,
        'time': time,
        'class_id':that.data.goodsid,
        'type': that.data.ping_type,
      },
      success(res) {
        console.log(res.data);
        that.setData({
          goodsdata:res.data.data
        })
      }
    })
  },
  //跳转详情页
  goodsjump:function(e){
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
  //获取用户积分
  indexajax() {
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key);
    wx.request({
      url: app.globalData.url + '/Member/index', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'openid': app.globalData.openid,
        'absign': str,
        'time': time,
        'member_id': app.globalData.member_id,
      },
      success(res) {
        console.log(res.data);
        that.setData({
          nickname: res.data.nickname,
          headimg: res.data.headimg,
          integral: res.data.integral
        })
      }
    })
  },
})