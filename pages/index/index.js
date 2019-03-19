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
    userinfo:true,
    black:true,
    luck_draw:false,
    newday:false,
    newdaydata:"",
    newdaycode:"",
    mylogin:"",
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
    console.log(this.data.nickname)
    if (this.data.nickname==""){
      this.setData({
        userinfo:false,
      });
    }
    if (app.globalData.getLocation == false){
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
    this.daily_login();
    this.slide_list();
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.mylogin==1){
      this.daily_login();
    }
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
  //拒绝授权后的操作
  shouquan:function(){
    wx.showModal({
      title: '提示',
      content: '授权登录后才能进行更多操作',
      success(res) {
        if (res.confirm) {
          wx.reLaunch({
            url: '../login/index'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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
        that.setData({
          newdaycode: res.data.code
        })
        if(res.data.code==201){
          if (res.data.luck_draw_one.code == 200) {
            that.setData({
              luck_draw: true,
              newday: false,
            })
          }else{
            that.setData({
              black: false,
            })
          }
        } else if (res.data.code == 200){
          //判断是否抽过奖
          if (res.data.luck_draw_one.code == 200) {
            that.setData({
              luck_draw: true,
              newdaydata:res.data.msg,
            })
          }else{
            that.setData({
              newday: true,
              newdaydata: res.data.msg,
            })
          }
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
  },
  //品牌联名跳转
  btnpin:function(){
    wx.navigateTo({
      url: '../goods/goods?ping_type=1'
    })
  },
  //点击取消
  black:function(){
    this.setData({
      black:false,
    })
  },
  //点击弹出经验框
  newday:function(){
    if (this.data.newdaycode==201){
      this.setData({
        luck_draw: false,
        newday: false,
        black:false,
      })
    }else{
      this.setData({
        luck_draw: false,
        newday: true,
      })
    }
    
  }
})