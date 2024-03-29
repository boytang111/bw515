// pages/detail/detail.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    detailid:"",
    userinfo: true,
    detail_name: "",
    detail_number: "",
    detail_src: "",
    detail_integral:"",
    detail_type:"",
    content:[],
    integral:"",
    //是否能兑换
    exchange: true,
    black:false,
    container:false,
    more:false,
    no_more:false,
    ye_more:false,
    yes_more:false,
    requirement_level:"",
    my_level:"",
    type:"",
    prize_name:"",
    prize_img:"",
    name:"",
    gouy:false,
    id: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        detailid: options.id,
      });
    }
    wx.showLoading({
      title: '拼命加载中',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.detailajax();
    app.action_member_log("detail",this.data.detailid);
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.detailajax();
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
  //获取商品详情数据
  detailajax(){
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
          content: res.data.content,
          detail_name: res.data.name,
          detail_number: res.data.number,
          detail_integral: res.data.integral,
          detail_src: res.data.src,
          detail_type: res.data.type,
          requirement_level: res.data.requirement_level,
        });
        that.member();
      }
    })
  },
  //积分兑换判断是否积分充足
  detailaadd: function (integral){
    if (this.data.detail_integral > integral){
      this.setData({
        exchange:false
      })
    }
  },
  //获取用户信息.积分
  member: function () {
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
        'member_id': app.globalData.member_id,
        'time': time,
      },
      success(res) {
        that.detailaadd(res.data.integral);
        //用户会员等级
        that.setData({
          my_level: res.data.requirement_level
        })
      }
    })
  },
  //点击立即兑换
  exchange:function(){
    if (this.data.requirement_level <= this.data.my_level){
      wx.navigateTo({
        url: '../virtual-confirm/virtual-confirm?id=' + this.data.detailid
      })
    }else{
      this.setData({
        black:true,
        gouy:true,
      })
    }
    
  },
  //点击弹出其他获取方式
  qita:function(){
    if (this.data.black == false){
      this.setData({
        black:true,
        container:true,
      })
    } 
  },
  //关闭弹窗
  close_black:function(){
    this.setData({
      black: false,
      container: false,
      more: false,
      no_more: false,
      ye_more: false,
      yes_more: false,
    })
  },
  //点击确定
  luck:function(){
    this.setData({
      container:false,
      ye_more:false,
      more:true,
      no_more: false,
    })
  }, 
  //点击赢取
  luck_draw_three:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key)
    var memberdata;
    wx.request({
      url: app.globalData.url + '/Game/luck_draw_three', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'absign': str,
        'openid': app.globalData.openid,
        'member_id': app.globalData.member_id,
        'time': time,
      },
      success(res) {
        if(res.data.code==191){
          wx.showToast({
            title: '积分不足',
            icon: 'none',
            duration: 2000
          })
        }else{
          if (res.data.id == 0) {
            that.setData({
              more: false,
              no_more: true,
              id:0,
            })
          } else {
            if (res.data.type != "coupon") {
              that.setData({
                more: false,
                no_more: true,
                type: res.data.type,
                name: res.data.name,
              })
            } else {
              that.setData({
                more: false,
                no_more: true,
                type: res.data.type,
                prize_img: res.data.prize_img,
                prize_name: res.data.prize_name,
              })
            }
        }
        
          
        }
      }
    })
  },
  //点击立即领取
  upbtn:function(){
    this.setData({
      no_more:false,
      ye_more:true,
    })
  },
  //点击关闭升级
  gouy:function(){
    this.setData({
      gouy: false,
      black: false,
    })
  },
})