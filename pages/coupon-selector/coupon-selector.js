// pages/coupon-selector/coupon-selector.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    coupondata:[],
    class_id:"",
    count:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.class_id){
      this.setData({
        class_id: options.class_id
      })
    }
    if (options.count) {
      this.setData({
        count: options.count
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.couponajax();
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
  //获取优惠券列表
  couponajax:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key);
    wx.request({
      url: app.globalData.url + '/Member/coupon', // 仅为示例，并非真实的接口地址
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
          coupondata: res.data
        })
      }
    })
  },
  //点击选择优惠券
  btn:function(e){
    let myintegral;
    if (e.currentTarget.dataset.rules=="折扣"){
      myintegral = parseInt(this.data.count)*parseInt(e.currentTarget.dataset.number)/100
    }else{
      myintegral = parseInt(this.data.count) - parseInt(e.currentTarget.dataset.number)
    }
    if (e.currentTarget.dataset.id==""){
      myintegral = this.data.count
    }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      mydata: e.currentTarget.dataset.id,
      myname: e.currentTarget.dataset.name,
      myintegral: myintegral,
    });
    wx.navigateBack({
      delta: 1
    })
  }
})