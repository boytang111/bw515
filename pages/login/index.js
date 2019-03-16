//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user:false,
    phone:false,
  },
  //事件处理函数
  onLoad: function () {
    console.log(app.globalData.openid)
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
            that.setData({
              user: false,
            })

            if (res.data.phone == "") {
              that.setData({
                phone: true,
              });
            }
          }
        })
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
                    if (res.data.phone == "") {
                      that.setData({
                        phone: true,
                      });
                    } else {
                      app.globalData.member_id = res.data.member_id
                      wx.switchTab({
                        url: '../index/index'
                      })
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
  onGotUserInfo(e) {
    var that = this;
    wx.getUserInfo({
      success: function (res) { 
        let time = app.time();
        let data={
          'time': time
        }   
        let str = app.signature(data, app.globalData.key);
        wx.request({
          url: app.globalData.url+'/index/authorized_login', // 仅为示例，并非真实的接口地址
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
            })
            wx.switchTab({
              url: '../index/index'
            })
            if (res.data.phone == ""||null) {
              that.setData({
                phone: true,
              });
            }
          }
        })      
      }, fail: function () {
        //进入首页，显示未登录
        wx.switchTab({
          url: '../index/index'
        })
      }
    }) 
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
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
          wx.switchTab({
            url: '../index/index'
          })
         
        }
      })
    }else{ 
      //进入首页，显示未登录
      wx.switchTab({
        url: '../index/index'
      })
    }
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  showToast: function (title){
    wx.showToast({
      title: title,
      duration: 2000
    })
  },
})
