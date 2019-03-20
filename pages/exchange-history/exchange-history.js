// pages/score-detail/score-detail.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    //用户名字
    nickname: app.globalData.nickname,
    //用户头像
    headimg: app.globalData.headimg,
    //用户积分
    integral: app.globalData.integral,
    listdata:[],
    //点击展开
    myindex:"-1",
    //点击切换
    btnindex:2,
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
    if (app.globalData.getLocation == false) {
      this.getAddress()
    }
    wx.showLoading({
      title: '拼命加载中',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.order_list(2);
    app.action_member_log("exchange-history");
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
  //获取虚拟物品
  order_list: function (type) {
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key);
    wx.request({
      url: app.globalData.url + '/Member/order_list', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'openid': app.globalData.openid,
        'absign': str,
        'member_id': app.globalData.member_id,
        'type': type,
        'time': time,
      },
      success(res) {
        that.setData({
          listdata:res.data.data
        })
      }
    })
  },
  //物品展开
  index:function(e){
    var index = e.currentTarget.dataset.index;
    if (this.data.myindex==index){
      this.setData({
        myindex: "-1"
      })
    }else{
      this.setData({
        myindex: index
      })
    }
    
  },
  //点击切换实际
  navbtn:function(e){
    var index = e.currentTarget.dataset.index;
    if (this.data.btnindex!=index){
      this.setData({
        btnindex:index,
      })
      this.order_list(index)
    }
  },
  //点击复制
  setcli: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.id,
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