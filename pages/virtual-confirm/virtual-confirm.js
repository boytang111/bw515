 // pages/actual-confirm/actual-confirm.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    detail_name: "",
    detail_src: "",
    detail_integral: "",
    detailid:"",
    //判断实物还是虚拟
    type:"",
    //优惠券数量
    coupon_count:"",
    //classid,优惠券判断提交
    class_id:"",
    //优惠券id
    mydata:"",
    myname:"",
    myintegral:"",
    //是否有地址
    save:false,
    //添加地址返回
    address_save:"",
    user_name: "",
    tel_number: "",
    province_name: "",
    city_name: "",
    county_name: "",
    detail_info: "",
    //地址id
    addressid:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){
      this.setData({
        detailid: options.id,
      })
    }
    wx.showLoading({
      title: '拼命加载中',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.couponajax();
    this.coupon_count();
    app.action_member_log("virtual-confirm", this.data.detailid);
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if (this.data.address_save!=""){
    //   this.address();
    // }
    // if (this.data.addressid != "") {
    //   this.address(this.data.addressid);
    // }
    this.address(this.data.addressid);
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
  couponajax:function(){
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
          detail_integral: res.data.integral,
          detail_src: res.data.src,
          type: res.data.type,
          class_id: res.data.class_id,
          myintegral: res.data.integral,
        });
        if (res.data.type==1){
          that.address();
        }
      }
    })
  },
  //查询优惠券可用
  coupon_count:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key);
    wx.request({
      url: app.globalData.url + '/Member/coupon_count', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'openid': app.globalData.openid,
        'absign': str,
        'member_id': app.globalData.member_id,
        'time': time,
      },
      success(res) {
        that.setData({
          coupon_count: res.data
        })
      }
    })
  },
  //立即兑换
  btn:function(e){
    console.log(e.detail.formId);
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key);
    wx.request({
      url: app.globalData.url + '/Member/exchange', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'openid': app.globalData.openid,
        'absign': str,
        'member_id': app.globalData.member_id,
        'product_sku_id': that.data.detailid,
        'type': that.data.type,
        'coupon_id': that.data.mydata,
        'time': time,
        'user_name': that.data.user_name,
        'tel_number': that.data.tel_number,
        'province_name': that.data.province_name,
        'city_name': that.data.city_name,
        'county_name': that.data.county_name,
        'detail_info': that.data.detail_info,
      },
      success(res) {
        if (res.data.code==200){
          wx.redirectTo({
            url: '../virtual-success/virtual-success?integral=' + res.data.integral + '&member_integral=' + res.data.member_integral + '&number=' + res.data.number + '&htttpurl=' + res.data.url + "&detailid=" + that.data.detailid,
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  //查询默认地址
  address: function (id){
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
        if(res.data.code==200){
          that.setData({
            user_name: res.data.address.user_name,
            tel_number: res.data.address.tel_number,
            province_name: res.data.address.province_name,
            city_name: res.data.address.city_name,
            county_name: res.data.address.county_name,
            detail_info: res.data.address.detail_info,
          })
        } else if (res.data.code == 100){
          that.setData({
            save:true,
          })
        }
      }
    })
  },
  //跳转选择地址页面
  jumparres:function(){
    if (this.data.save==true){
      wx.navigateTo({
        url: '../edit-address/edit-address'
      })
    }else{
      wx.navigateTo({
        url: '../address-manage/address-manage?choice=1'
      })
      
    }
  }
})