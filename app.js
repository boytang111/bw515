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
    member_id:"",
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