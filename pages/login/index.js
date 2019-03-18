//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user:false,
    phone:false,
    //同意协议
    imgstatu:false,
    //隐私条款
    clause:false,
    //定制喜好
    gift:false,
    //是否授权信息
    ufer:false,
    //是否完成定制喜好
    like:false,
    //啤酒
    beer:"",
    //奖品
    item:"",
    url:app.globalData.url,

  },
  //事件处理函数
  onLoad: function () {
    wx.showLoading({
      title: '拼命加载中',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that=this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://applet.qm-vip.com/index/code2session', // 仅为示例，并非真实的接口地址
          method: 'post',
          data: {
            'code': res.code,
          },
          success(res) {
            app.globalData.key = res.data.key
            app.globalData.openid = res.data.openid;
            if (app.globalData.openid!=""){
              that.map();
              that.getSetting();
              wx.hideLoading()
            }
          }
        })
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //调用地理位置
  map:function(){
    let that=this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        let time = app.time();
        let data = {
          'time': time,
        }
        let str = app.signature(data, app.globalData.key)
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        const altitude = res.altitude
        const verticalAccuracy = res.verticalAccuracy
        const horizontalAccuracy = res.horizontalAccuracy
        wx.request({
          url: app.globalData.url + '/Index/address_authorization', // 仅为示例，并非真实的接口地址
          method: 'post',
          data: {
            'openid': app.globalData.openid,
            'latitude': latitude,
            'longitude': longitude,
            'speed': speed,
            'accuracy': accuracy,
            'altitude': altitude,
            'verticalAccuracy': verticalAccuracy,
            'horizontalAccuracy': horizontalAccuracy,
            'time': time,
            'absign': str,
          },
          success(res) {

          }
        })
      }, fail: function () {
        //进入首页，显示未授权地理位置，首页重新调用
        app.globalData.getLocation=false;
      }
    })
  },
  //授权
  getSetting:function(){
    let that=this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              let time = app.time();
              let data = {
                'time': time
              }
              let str = app.signature(data, app.globalData.key);
              wx.request({
                url: app.globalData.url + '/index/authorized_login', // 仅为示例，并非真实的接口地址
                method: 'post',
                data: {
                  'openid': app.globalData.openid,
                  'rawData': res.rawData,
                  'signature': res.signature,
                  'encryptedData': res.encryptedData,
                  'iv': res.iv,
                  'time': time,
                  'absign': str,
                },
                success(res) {
                  if (res.data.code == 200) {
                    that.setData({
                      user: false,
                    });
                    app.globalData.member_id = res.data.member_id;
                    if (res.data.phone == null||"") {
                      that.setData({
                        ufer: true,
                        phone: true,
                      });
                    } else if (res.data.like == null || ""){
                      that.setData({
                        gift: true,
                      });
                    }else {
                      that.member(res.data.member_id);
                      that.indextap();
                    }
                  }
                }
              })
            }
          });
        } else {
          that.setData({
            user: true,
          })
        }
      }
    })
  },
  //获取用户信息
  member: function (member_id) {
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
        'member_id': member_id,
        'time': time,
      },
      success(res) {
        app.globalData.nickname = res.data.nickname;
        app.globalData.headimg = res.data.headimg;
        app.globalData.integral = res.data.integral;
      }
    })
  },
  //是否确认协议
  gotuser:function(){
    wx.showToast({
      title: "请先确认协议",
      icon: 'none',
      duration: 2000
    })
  },
  onGotUserInfo(e) {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        let time = app.time();
        let data = {
          'time': time
        }
        let str = app.signature(data, app.globalData.key);
        wx.request({
          url: app.globalData.url + '/index/authorized_login', // 仅为示例，并非真实的接口地址
          method: 'post',
          data: {
            'openid': app.globalData.openid,
            'rawData': res.rawData,
            'signature': res.signature,
            'encryptedData': res.encryptedData,
            'iv': res.iv,
            'time': time,
            'absign': str,
          },
          success(res) {
            that.setData({
              user: false,
              ufer: true,
              member_id: res.data.member_id
            })
            that.member(res.data.member_id);
            app.globalData.member_id = res.data.member_id;

            if (res.data.phone == null ||"" ) {
              that.setData({
                phone: true,
              });
            }
          }
        })
      }, fail: function () {
        that.indextap();
      }
    }) 
  },
  getPhoneNumber(e){
    var that=this;
    if (e.detail.iv){
      let time = app.time();
      let data = {
        'time': time,
      }
      let str = app.signature(data, app.globalData.key)
      wx.request({
        url: app.globalData.url + '/Index/binding_phone', // 仅为示例，并非真实的接口地址
        method: 'post',
        data: {
          'openid': app.globalData.openid,
          'encryptedData': e.detail.encryptedData,
          'iv': e.detail.iv,
          'time': time,
          'absign': str,
        },
        success(res) {
          //是否授权信息
          if(that.data.ufer==false){
            that.indextap();
          }else{
            //打开定制
            that.setData({
              gift: true,
              phone:false,
            })
          }
         
        }
      })
    }else{ 
      that.indextap();
    }
  },
  //点击同意协议
  imgbap:function(){
    if (this.data.imgstatu==false){
      this.setData({
        imgstatu:true
      })
    }else{
      this.setData({
        imgstatu: false
      })
    }
  },
  //点击查看隐私条款
  clausebap:function(){
    this.setData({
      clause:true,
    })
  },
  close_clause:function(){
    this.setData({
      clause: false,
    })
  },
  showToast: function (title){
    wx.showToast({
      title: title,
      duration: 2000
    })
  },
  //跳转首页
  indextap:function(){
    //进入首页，显示未登录
    wx.switchTab({
      url: '../index/index'
    })
  },
  //点击选择啤酒
  beerbap:function(e){
    if(this.data.beer==e.currentTarget.dataset.title){
      this.setData({
        beer:""
      })
    }else{
      this.setData({
        beer: e.currentTarget.dataset.title,
      })
    }
  },
  //点击选择奖品
  itembap: function (e) {
    if (this.data.item == e.currentTarget.dataset.title) {
      this.setData({
        item: ""
      })
    } else {
      this.setData({
        item: e.currentTarget.dataset.title,
      })
    }
  },
  //点击提交喜好
  like:function(){
    let that=this;
    let time = app.time();
    let data = {
      'time': time,
    }
    let str = app.signature(data, app.globalData.key)
    wx.request({
      url: app.globalData.url + '/Member/like_add', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'openid': app.globalData.openid,
        'member_id': app.globalData.member_id,
        'ans1': that.data.beer,
        'ans2': that.data.item,
        'time': time,
        'absign': str,
      },
      success(res) {
        //是否授权信息
        that.showToast("提交成功");
        setTimeout(that.indextap(), 2000);
      }
    })
  },
})
