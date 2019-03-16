// pages/shop/shop.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopdata:[],
    url: app.globalData.url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.shopajax();
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
  //获取数据
  shopajax(){
    let that=this;
    let data={};
    let str = app.signature(data, app.globalData.key)
    wx.request({
      url: app.globalData.url + '/Product/index', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'absign': str,
      },
      success(res) {
        console.log(res.data);
        that.setData({
          shopdata: res.data
        })
      }
    })
  },
})