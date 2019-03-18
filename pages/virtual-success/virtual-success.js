// pages/actual-success/actual-success.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //上个页面传过来的数据
    url: app.globalData.url,
    integral:"",
    member_integral:"",
    number:"",
    htttpurl:"",
    detail_name:"",
    detail_src:"",
    detailid:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.integral){
      this.setData({
        integral: options.integral
      })
    }
    if (options.member_integral) {
      this.setData({
        member_integral: options.member_integral
      })
    }
    if (options.number) {
      this.setData({
        number: options.number
      })
    }
    if (options.htttpurl) {
      this.setData({
        htttpurl: options.htttpurl
      })
    }
    if (options.detailid) {
      this.setData({
        detailid: options.detailid
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
  //产品信息
  couponajax: function () {
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key);
    wx.request({
      url: app.globalData.url + '/Product/find', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'openid': app.globalData.openid,
        'absign': str,
        'time': time,
        'product_sku_id': that.data.detailid,
      },
      success(res) {
        console.log(res.data);
        that.setData({
          detail_name: res.data.name,
          detail_src: res.data.src,
        });
      }
    })
  },
  //点击复制
  setcli:function(){
    wx.setClipboardData({
      data: this.data.number,
      success(res) {
        wx.getClipboardData({
          success(res) {
            //
            console.log(res.data) // data
          }
        })
      }
    })
  },
})