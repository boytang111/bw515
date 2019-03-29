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
    listdata: [],
    btnindex:"0",
    listdata2:[],
    listdata3:[],
    zhanindex:null,
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
    this.couponajax(0);
    app.action_member_log("coupon");
    this.indexajax()
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
    wx.showShareMenu({
      withShareTicket: true,
      success(res) {
        app.click_interaction("zfxcx")
      },
    })
  },
  //获取优惠券数量
  couponajax(status){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key);
    wx.request({
      url: app.globalData.url + '/Member/coupon_list', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'openid': app.globalData.openid,
        'absign': str,
        'time': time,
        'member_id': app.globalData.member_id,
        "status": status,
      },
      success(res) {
        console.log(res.data);
        if (status==0){
          that.setData({
            listdata: res.data,
          })
        } else if (status == 7){
          that.setData({
            listdata2: res.data,
          })
        }else{
          let data=[];
          let myintegral;
          for(let i=0; i<res.data.length; i++){
            if (res.data[i].rules == "折扣") {
              myintegral = parseInt(res.data[i].integral) * parseInt(res.data[i].number) / 100
            } else {
              myintegral = parseInt(res.data[i].integral) - parseInt(res.data[i].number)
            }
            data.push({
              'integr': myintegral,
              'data':res.data[i]
            })
          }
          that.setData({
            listdata3: data
          })
        }
        
      }
    })
  },
  //点击切换优惠券
  btn:function(e){
    console.log(e.currentTarget.dataset.index);
    this.setData({
      btnindex: e.currentTarget.dataset.index
    })
    this.couponajax(e.currentTarget.dataset.index)
  },
  //点击展开收缩已使用优惠券
  zhan:function(e){
    let index = e.currentTarget.dataset.index;
    if (index==this.data.zhanindex){
      this.setData({
        zhanindex:null
      })
    }else{
      this.setData({
        zhanindex: index
      })
    }
  },
  indexajax() {
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
          nickname: res.data.nickname,
          headimg: res.data.headimg,
          integral: res.data.integral
        })
      }
    })
  },
})