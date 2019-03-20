// pages/draw/draw.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectIndex: null,
    url: app.globalData.url,
    black:false,
    container:false,
    //次数
    two_find:"",
    id:"",
    prize_img:"",
    prize_name:"",
    type:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '拼命加载中',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.two_find();
    wx.hideLoading();
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
  
  },

  onSelect(event){
    var index = event.currentTarget.dataset.index;
    this.setData({
      selectIndex: index
    });
    this.draw();
  },
  //点击翻牌
  draw:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key)
    wx.request({
      url: app.globalData.url + '/Game/luck_draw_two', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'absign': str,
        'openid': app.globalData.openid,
        'member_id': app.globalData.member_id,
        'time': time,
      },
      success(res) {
        if (res.data.code==191){
          that.setData({
            bax: true,
            container:true,
            selectIndex: null,
          })
        } else if(res.data.code == 200){
          that.two_find();
          let img = that.data.url + res.data.prize_img
          that.setData({
            bax: true,
            selectIndex: null,
            black: true,
            id:res.data.id,
            prize_img: img,
            prize_name: res.data.prize_name,
            type: res.data.type
          })
        }
        
      }
    })
  },
  //取消
  back:function(){
    this.setData({
      bax: false,
      black:false,
      container:false,
    })
  },
  //查询翻牌次数
  two_find:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key)
    wx.request({
      url: app.globalData.url + '/Game/luck_draw_two_find', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'absign': str,
        'openid': app.globalData.openid,
        'member_id': app.globalData.member_id,
        'time': time,
      },
      success(res) {
        that.setData({
          two_find:res.data
        })
      }
    })
  }
})