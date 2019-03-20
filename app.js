//app.js
var util = require('utils/md5.js')
App({
  onLaunch: function () {
    // 登录
    var that=this;
  },
  globalData: {
    url:'https://applet.qm-vip.com',
    key:"",
    openid:"",
    //用户id
    member_id:"",
    //用户名字
    nickname:"",
    //用户头像
    headimg:"",
    //用户积分
    integral:"",
    //地理位置授权
    getLocation:true,
  },
  getPermission: function (obj) {
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        obj.setData({
          addr: res.address      //调用成功直接设置地址
        })
      },
      fail: function () {
        
        
        wx.getSetting({
          success: function (res) {
            var statu = res.authSetting;
            if (!statu['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则无法为您提供更好的服务',
                success: function (tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: function (data) {
                        
                        if (data.authSetting["scope.userLocation"] === true) {
                          let time = that.time();
                          let data = {
                            'time': time,
                          }
                          let str = that.signature(data, that.globalData.key)
                          const latitude = res.latitude
                          const longitude = res.longitude
                          const speed = res.speed
                          const accuracy = res.accuracy
                          const altitude = res.altitude
                          const verticalAccuracy = res.verticalAccuracy
                          const horizontalAccuracy = res.horizontalAccuracy
                          wx.request({
                            url: that.globalData.url + '/Index/address_authorization', // 仅为示例，并非真实的接口地址
                            method: 'post',
                            data: {
                              'openid': that.globalData.openid,
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
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'success',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '调用授权窗口失败',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    })
  },
  //获取当前时间戳
  time:function(){
    var timestamp = (new Date()).getTime();
    return timestamp
  },
  //提交动作的
  action_member_log: function (action, correlation_id){
    let that=this;
    let time = that.time();
    let data = {
      'time': time,
    }
    let str = that.signature(data, that.globalData.key)
    wx.request({
      url: that.globalData.url + '/Index/action_member_log', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'openid': that.globalData.openid,
        'key': that.globalData.key,
        'member_id': that.globalData.member_id,
        'action': action,
        'correlation_id': correlation_id,
        'time': time,
        'absign': str,
      },
      success(res) {

      }
    })
  },
  //
  signature: function (data, key) {
    var n = null, d = {}, str = '', s = ''
    n = Object.keys(data).sort()
    for (var i in n) {
      d[n[i]] = data[n[i]]
    }
    for (var k in d) {
      if (d[k] === '') continue
      if (str != '') str += '&'
      str += k + '=' + encodeURI(d[k])
    }
    str += '&key=' + key
    s = util.hexMD5(str).toUpperCase() // 这儿是进行MD5加密并转大写
    return s
  },
})