// pages/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index_img:[],
    index_img2: [],
    url:app.globalData.url,
    //用户名字
    nickname:app.globalData.nickname,
    //用户头像
    headimg:app.globalData.headimg,
    //用户积分
    integral:app.globalData.integral,
    userinfo:true,
    black:false,
    luck_draw:false,
    newday: false,
    newdaydata:"",
    newdaycode:"",
    mylogin:"",
    //获取跳转回来的页面
    back:"",
    //额外加经验
    text:"",
    newdaydatalbt:"",
    newdaylbt:false,
    //是否加积分抽奖
    qrinter:'',
    qr:false,
    qrcode:"",
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
    if (app.globalData.getLocation == false){
      this.getAddress()
    }
    wx.showLoading({
      title: '拼命加载中',
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    this.slide_list();
    this.slide();
    app.action_member_log("index")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.mylogin==1){
      this.daily_login();
    };
    this.daily_login();
    this.getdata();
    this.member(app.globalData.member_id);
    this.pull_cap_qrcode();
    wx.hideLoading()
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
    return {
      title: '百威创新', // 转发标题（默认：当前小程序名称）
      path: '/pages/login/index', // 转发路径（当前页面 path ），必须是以 / 开头的完整路径
      success(e) {
        // shareAppMessage: ok,
        // shareTickets 数组，每一项是一个 shareTicket ，对应一个转发对象
        // 需要在页面onLoad()事件中实现接口
        wx.showShareMenu({
          withShareTicket: true,
          success(res) {
            that.click_interaction("zfxcx")
          },
        })
      },
      fail(e) {
        // shareAppMessage:fail cancel
        // shareAppMessage:fail(detail message) 
      },
      complete() { }
    }
  },
  getAddress: function () {
    var that = this;
    app.getPermission(that);    //传入that值可以在app.js页面直接设置内容    
  },
  //拒绝授权后的操作
  shouquan:function(){
    wx.showModal({
      title: '提示',
      content: '授权登录后才能进行更多操作',
      success(res) {
        if (res.confirm) {
          wx.reLaunch({
            url: '../login/index'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //每日登陆检测
  daily_login:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key)
    wx.request({
      url: app.globalData.url + '/index/daily_login', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'absign': str,
        'openid': app.globalData.openid,
        'member_id': app.globalData.member_id,
        'time': time,
      },
      success(res) {
        that.setData({
          newdaycode: res.data.code
        })
        if(res.data.code==201){
          if (res.data.luck_draw_one.code == 200) {
            that.setData({
              luck_draw: true,
              newday: false,
              black:true,
            })
          }
        } else if (res.data.code == 200){
          //判断是否抽过奖
          if (res.data.luck_draw_one.code == 200) {
            that.setData({
              luck_draw: true,
              black: true,
              newdaydata:res.data.msg,
            })
          }else{
            that.setData({
              newday: true,
              black: true,
              newdaydata: res.data.msg,
              text: res.data.txt,
            })
          }
        }
      }
    })
  },
  //首页数据
  slide_list:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key)
    wx.request({
      url: app.globalData.url + '/index/slide_list', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'absign': str,
        'openid': app.globalData.openid,
        'key': app.globalData.key,
        "member_id": app.globalData.member_id,
        'time': time,
      },
      success(res) {
        that.setData({
          index_img: res.data,
        })
      }
    })
  },
  //品牌联名跳转
  btnpin:function(){
    wx.navigateTo({
      url: '../goods/goods?ping_type=1&name=品牌联名'
    })
  },
  //点击取消
  black:function(){
    if (this.data.qrcode==200){
      this.setData({
        newday: false,
        qr:true,
      })
    }else{
      this.setData({
        black: false,
      })
    }
    
  },
  //点击弹出经验框
  newday:function(){
    if (this.data.newdaycode==201){
      this.setData({
        luck_draw: false,
        newday: false,
        black: false,
      })
    }else{
      this.setData({
        luck_draw: false,
        newday: true,
        black: true,
      })
    }
    
  },
  //获取下面的图文
  slide:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key)
    wx.request({
      url: app.globalData.url + '/index/slide', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'absign': str,
        'openid': app.globalData.openid,
        'key': app.globalData.key,
        "member_id": app.globalData.member_id,
        'time': time,
      },
      success(res) {
        let index_img1 = [], index_img2 = [];
        // for(let i=0; i<res.data.length; i++){
        //   index_img2.push(res.data[i])
        // }
        that.setData({
          index_img2: res.data
        })
      }
    })
  },
  //跳转到公众号页面
  view:function(e){
    if (e.currentTarget.dataset.id =="lbt"){
      this.click_interaction("lbt")
    }else{
      this.click_interaction("gghwz")
    }
    wx.navigateTo({
      url: '../view/webview?src=' + e.currentTarget.dataset.src
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
        if (res.data.code==105){
          that.setData({
            userinfo: false,
          })
        } else if (res.data.code == 200){
          app.globalData.nickname = res.data.nickname;
          app.globalData.headimg = res.data.headimg;
          app.globalData.integral = res.data.integral;
          that.setData({
            nickname: res.data.nickname,
            headimg: res.data.headimg,
            integral: res.data.integral
          });
        }
      }
    })
  },
  //点击跳转页面加分
  click_interaction: function (action){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key)
    var memberdata;
    wx.request({
      url: app.globalData.url + '/Rulebonus/click_interaction', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'absign': str,
        'openid': app.globalData.openid,
        'member_id': app.globalData.member_id,
        'time': time,
        'action': action
      },
      success(res) {
        if(res.data.code==100){
          
        } else if (res.data.code == 200){
          if (action !="zfxcx"){
            wx.setStorage({
              key: 'key',
              data: '1'
            })
            wx.setStorage({
              key: 'newdaydata',
              data: res.data.txt,
            }) 
          }
        }
      }
    })
  },
  //点击轮播图或者公众号返回是否有数据
  getdata:function(){
    let that=this;
    wx.getStorage({
      key: 'key',
      success(res) {
        if(res.data==1){
          wx.getStorage({
            key: "newdaydata",
            success(res) {
              that.setData({
                newdaydatalbt: res.data,
                black: true,
                newdaylbt: true,
              })
              wx.setStorage({
                key: 'key',
                data: '2'
              })
              wx.setStorage({
                key: 'newdaydata',
                data: ''
              })
            }
          })
        }
      }
    })
  },
  //是否有资格游戏接口
  pull_cap_qrcode: function (){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key)
    var memberdata;
    wx.request({
      url: app.globalData.url + '/Index/pull_cap_qrcode', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'absign': str,
        'openid': app.globalData.openid,
        'member_id': app.globalData.member_id,
        'time': time,
        'number': app.globalData.scene
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            qr:true,
            black:true,
            qrinter: res.data.integral,
            qrcode: res.data.code,
          })
          app.globalData.position=res.data.position
        }
      }
    })
  },
  //关闭弹窗
  qrfalse:function(){
    this.setData({
      qr:false,
      black: false,
    });
    if (this.data.newdaycode == 201) {
      this.setData({
        luck_draw: false,
        newday: false,
        black: false,
      })
    } else {
      this.setData({
        luck_draw: false,
        newday: true,
      })
    }
  }
  
})