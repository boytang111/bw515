// pages/edit-address/edit-address.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    region:[],
    //获取用户填写
    tel_number: "",
    detailInfo: "",
    //性别
    gender:1,
    //修改删除id
    id:"",
    user_name: "",
    detail_info: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){
      this.setData({
        id: options.id
      })
      this.address(this.data.id)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    app.action_member_log("edit-address");
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
      user_name: e.detail.value
    })
  },
  tel_number:function(e){
    this.setData({
      tel_number: e.detail.value
    })
  },
  detailInfo:function(e){
    this.setData({
      detail_info: e.detail.value
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
  address: function (id) {
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key);
    wx.request({
      url: app.globalData.url + '/Member/address_find', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'openid': app.globalData.openid,
        'absign': str,
        'member_id': app.globalData.member_id,
        'id': id,
        'time': time,
      },
      success(res) {
        if (res.data.code == 200) {
          let region=[];
          region.push(res.data.address.province_name)
          region.push(res.data.address.city_name)
          region.push(res.data.address.county_name)
          that.setData({
            user_name: res.data.address.user_name,
            tel_number: res.data.address.tel_number,
            region: region,
            detail_info: res.data.address.detail_info,
            gender: res.data.address.gender,
          })
        }
      }
    })
  },
  //提交地址
  addades:function(){
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.user_name.length == 0) {
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
    } else if (this.data.detail_info.length == 0) {
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
        url: app.globalData.url + '/Member/address_save', // 仅为示例，并非真实的接口地址
        method: 'post',
        data: {
          'absign': str,
          'openid': app.globalData.openid,
          'member_id': app.globalData.member_id,
          'time': time,
          'user_name': that.data.user_name,
          'tel_number': that.data.tel_number,
          'detail_info': that.data.detail_info,
          'gender': that.data.gender,
          'province_name': that.data.region[0],
          'city_name': that.data.region[1], 
          'county_name': that.data.region[2],
          'id':that.data.id,
        },
        success(res) {
          if (res.data.code==200){
            if(that.data.manage!=""){
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              prevPage.setData({
                delete_id: 1,
              });
              wx.navigateBack({
                delta: 1
              })
            }else{
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              prevPage.setData({
                address_save: 1,
              });
              wx.navigateBack({
                delta: 1
              })
            }
            
          }
        }
      })
    }
    
  },
  //打开删除地址
  delete_id:function(){
    this.setData({
      black:true
    })
  },
  //guanbi
  close:function(){
    this.setData({
      black: false
    })
  },
  //删除
  yes_delete:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key)
    var memberdata;
    wx.request({
      url: app.globalData.url + '/Member/address_delete', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'absign': str,
        'openid': app.globalData.openid,
        'member_id': app.globalData.member_id,
        'time': time,
        'id':that.data.id,
      },
      success(res) {
        if (res.data.code == 200) {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setData({
            delete_id: 1,
          });
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },2000)
          
        }
      }
    })
  }
})