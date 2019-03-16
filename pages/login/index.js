//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user:false,
    phone:false,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log(app.globalData.openid)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    let that = this
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
                  that.setData({
                    user: false,
                  });
                  if (res.data.phone == "") {
                    that.setData({
                      phone: true,
                    });
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
            if (res.data.phone == "") {
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
                  wx.switchTab({
                    url: '../index/index'
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
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
