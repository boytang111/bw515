// pages/info/info.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    infodata:[],
    gender:false,
    birthday:false,
    date:"",
    infogender:"1",
    ingender:"",
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
    this.infoajax();
    app.action_member_log("info");
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
    let that = this;
    return {
      title: '百威创新', // 转发标题（默认：当前小程序名称）
      path: '/pages/login/index', // 转发路径（当前页面 path ），必须是以 / 开头的完整路径
      success(e) {
        // shareAppMessage: ok,
        // shareTickets 数组，每一项是一个 shareTicket ，对应一个转发对象
        // 需要在页面onLoad()事件中实现接口
        wx.showShareMenu({
          withShareTicket: true,
          success(res) {
            that.click_interaction("zfxcx")
          },
        })
      },
      fail(e) {
        // shareAppMessage:fail cancel
        // shareAppMessage:fail(detail message) 
      },
      complete() { }
    }
  },
  //查询数据
  infoajax(){
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
          infodata: res.data,
          date: res.data.birthday,
          ingender: res.data.gender,
          infogender: res.data.gender,
        })
      }
    })
  },
  //
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  //展开
  birthday_up:function(){
    if (this.data.birthday==true){
      this.setData({
        birthday:false,
        gender: false,
      })
    }else{
      this.setData({
        birthday: true,
        gender: false,
      })
    }
  },
  gender_up: function () {
    if (this.data.gender == true) {
      this.setData({
        gender: false,
        birthday: false,
      })
    } else {
      this.setData({
        gender: true,
        birthday: false,
      })
    }
  },
  //男女切换
  genders:function(e){
    if (e.currentTarget.dataset.id==2){
      this.setData({
        infogender:2
      })
    }else {
      this.setData({
        infogender: 1
      })
    }
  },
  //提交参数
  infoadd:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key);
    wx.request({
      url: app.globalData.url + '/Member/m_update', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'openid': app.globalData.openid,
        'absign': str,
        'time': time,
        'member_id': app.globalData.member_id,
        'nickname': that.data.infodata.nickname,
        'birthday': that.data.date,
        'gender': that.data.infogender,
      },
      success(res) {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          gender: false,
          birthday: false,
        })
        that.infoajax()
      }
    })
  },
})