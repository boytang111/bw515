// pages/luck/luck.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    luckdata:[],
    black:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '拼命加载中',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading()
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
  //抽奖
  luck:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key)
    wx.request({
      url: app.globalData.url + '/Game/luck_draw_one', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'absign': str,
        'openid': app.globalData.openid,
        'member_id': app.globalData.member_id,
        'time': time,
      },
      success(res) {
        that.setData({
          luckdata:res.data,
          black:true,
        })
      }
    })
  },
  back:function(){
    wx.navigateBack({
      delta: 1
    })
  }
})