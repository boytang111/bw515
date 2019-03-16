//app.js
var util = require('utils/md5.js')
App({
  onLaunch: function () {
    // 登录
    var that=this;
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
            that.globalData.key = res.data.key
            that.globalData.openid = res.data.openid
          }
        })
      }
    })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null,
    url:'https://applet.qm-vip.com',
    key:"",
    openid:"",
  },
  //获取当前时间戳
  time:function(){
    var timestamp = (new Date()).getTime();
    return timestamp
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