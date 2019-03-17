// pages/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index_img:"",
    url:app.globalData.url,
    //用户名字
    nickname:app.globalData.nickname,
    //用户头像
    headimg:app.globalData.headimg,
    //用户积分
    integral:app.globalData.integral,
    userinfo:false,
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
    if (app.globalData.nickname!=""){
      this.setData({
        userinfo:true,
      });
    }
    if (app.globalData.getLocation == false){
      this.getAddress()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.daily_login();
    this.slide_list();
    
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
  getAddress: function () {
    var that = this;
    app.getPermission(that);    //传入that值可以在app.js页面直接设置内容    
  },
  //每日登陆检测
  daily_login:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key)
    wx.request({
      url: app.globalData.url + '/index/daily_login', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'absign': str,
        'openid': app.globalData.openid,
        'member_id': app.globalData.member_id,
        'time': time,
      },
      success(res) {
        if(res.data.code==210){
          console.log("123")
        }
        
      }
    })
  },
  //首页数据
  slide_list:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key)
    wx.request({
      url: app.globalData.url + '/index/slide_list', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'absign': str,
        'openid': app.globalData.openid,
        'key': app.globalData.key,
        'time': time,
      },
      success(res) {
        that.setData({
          index_img: res.data[0].img
        })
      }
    })
  }
})