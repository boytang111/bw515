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
    logdata: [],
    date:"",
    btnindex:"2",
    experience:"",
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
    this.date()
    wx.showLoading({
      title: '拼命加载中',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.logdata();
    app.action_member_log("score-detail");
    this.indexajax();
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
  //获取当前月份
  date:function(){
    var myDate = new Date();
    let year = myDate.getFullYear();
    let mod = myDate.getMonth()+1;
    if(mod<10){
      mod = "0"+mod
    }
    let da = year + "-" + mod
    console.log(da)
    this.setData({
      date: da
    })
  },
  //获取经验
  logdata:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key);
    wx.request({
      url: app.globalData.url + '/Member/experience_log', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'openid': app.globalData.openid,
        'absign': str,
        'member_id': app.globalData.member_id,
        'date': that.data.date,
        'time': time,
      },
      success(res) {
        
        let exper=0;
        for(let i=0; i<res.data.length;i++){
          exper = parseInt(exper) + parseInt(res.data[i].experience);
        }
        that.setData({
          logdata: res.data,
          experience: exper,
        });
      }
    })
  },
  //获取积分
  integral:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key);
    wx.request({
      url: app.globalData.url + '/Member/integral_log', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'openid': app.globalData.openid,
        'absign': str,
        'member_id': app.globalData.member_id,
        'date': that.data.date,
        'time': time,
      },
      success(res) {
        let exper = 0;
        for (let i = 0; i < res.data.length; i++) {
          exper = parseInt(exper) + parseInt(res.data[i].integral);
        }
        that.setData({
          logdata: res.data,
          experience: exper,
        });
      }
    })
  },
  //切换经验
  navbtn: function (e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.btnindex != index) {
      this.setData({
        btnindex: index,
      })
      if (index==1){
        this.integral()
      }else{
        this.logdata();
      }
    }
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
    if (this.data.btnindex == 1) {
      this.integral()
    } else {
      this.logdata();
    }
  },
  //获取用户积分
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