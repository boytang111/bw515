// pages/detail/detail.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    detailid:"",
    userinfo: true,
    detail_name: "",
    detail_number: "",
    detail_src: "",
    detail_integral:"",
    content:[],
    integral:"",
    //是否能兑换
    exchange: true,
    black:false,
    container:false,
    more:false,
    no_more:false,
    ye_more:false,
    yes_more:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        detailid: options.id,
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.detailajax();
    
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
  //获取商品详情数据
  detailajax(){
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
          content: res.data.content,
          detail_name: res.data.name,
          detail_number: res.data.number,
          detail_integral: res.data.integral,
          detail_src: res.data.src,
        });
        that.member();
      }
    })
  },
  //积分兑换判断是否积分充足
  detailaadd: function (integral){
    if (this.data.detail_integral > integral){
      this.setData({
        exchange:false
      })
    }
  },
  //获取用户信息.积分
  member: function () {
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key)
    var memberdata;
    wx.request({
      url: app.globalData.url + '/Member/index', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'absign': str,
        'openid': app.globalData.openid,
        'member_id': app.globalData.member_id,
        'time': time,
      },
      success(res) {
        that.detailaadd(res.data.integral);
      }
    })
  },
  //点击立即兑换
  exchange:function(){
    wx.navigateTo({
      url: '../virtual-confirm/virtual-confirm?id=' + this.data.detailid
    })
  },
  //点击弹出其他获取方式
  qita:function(){
    if (this.data.black == false){
      this.setData({
        black:true,
        container:true,
      })
    } 
  },
  //关闭弹窗
  close_black:function(){
    this.setData({
      black: false,
    })
  }
})