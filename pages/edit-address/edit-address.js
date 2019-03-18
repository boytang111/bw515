// pages/edit-address/edit-address.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    black:false,
    region:[],
    //获取用户填写
    userName:"",
    tel_number: "",
    detailInfo: "",
    //性别
    gender:1,
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
  //选择省市
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  //绑定input
  userName:function(e){
    this.setData({
      userName: e.detail.value
    })
  },
  tel_number:function(e){
    this.setData({
      tel_number: e.detail.value
    })
  },
  detailInfo:function(e){
    this.setData({
      detailInfo: e.detail.value
    })
  },
  //切换性别
  gender:function(e){
    console.log(e.currentTarget.dataset.id);
    if (this.data.gender != e.currentTarget.dataset.id){
      this.setData({
        gender: e.currentTarget.dataset.id
      })
    }
  },
  //提交地址
  addades:function(){
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if(this.data.userName.length == 0) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (this.data.tel_number.length == 0) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (this.data.tel_number.length < 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (!myreg.test(this.data.tel_number)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (this.data.detailInfo.length == 0) {
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (this.data.region.length == 0) {
      wx.showToast({
        title: '请选择地区',
        icon: 'none',
        duration: 1500
      })
      return false;
    }else{
      let that = this;
      let time = app.time();
      let data = {
        'time': time
      }
      let str = app.signature(data, app.globalData.key)
      var memberdata;
      wx.request({
        url: app.globalData.url + '/address_save', // 仅为示例，并非真实的接口地址
        method: 'post',
        data: {
          'absign': str,
          'openid': app.globalData.openid,
          'member_id': app.globalData.member_id,
          'time': time,
          'userName': that.data.userName,
          'tel_number': that.data.tel_number,
          'detailInfo': that.data.detailInfo,
          'gender': that.data.gender,
          'provinceName': that.data.region[0],
          'cityName': that.data.region[1],
          'countyName': that.data.region[2],
        },
        success(res) {

        }
      })
    }
    
  }
})