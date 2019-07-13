// pages/home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showStatus_1:1,
    showStatus_2:0,
    showStatus_3:0,
    showStatus_4:0,
    showStatus_5:0,
    id:"-1",
    name:"",
    class_id:"",
    number:"",
    position: app.globalData.position,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    console.log(app.globalData.scene)
    // wx.showLoading({
    //   title: '加载中',
    // })
    // wx.downloadFile({
    //   url:'https://applet.qm-vip.com/budweiser/game_pull_cap/images/background.png',
    //   success:function(e){
    //     wx.hideLoading()
    //     _this.setData({
    //       backUrl: e.tempFilePath
    //     })
    //   }
    // })
  },
  startActive: function () {
    let _this = this;
    _this.setData({
      showStatus_1: 0,
      showStatus_2: 1,
      showStatus_4: 1
    })
    // setTimeout(function(){
    //   _this.setData({
    //     showStatus_3: 0,
    //     showStatus_4:1
    //   })
    _this.pull_cap_prize();
    setTimeout(function () {
      _this.setData({
        showStatus_2: 1,
        showStatus_5: 1
      })
    }, 1500)
    // },500)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  //抽奖
  pull_cap_prize:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key)
    var memberdata;
    wx.request({
      url: app.globalData.url + '/Game/pull_cap_prize', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'absign': str,
        'openid': app.globalData.openid,
        'member_id': app.globalData.member_id,
        'time': time,
        'number': app.globalData.scene
      },
      success(res) {
        that.setData({
          id: res.data.id,
        })
        if (res.data.id!=0){
          that.setData({
            name: res.data.name,
            class_id: res.data.class_id,
          })
        }
        console.log(res)
      }
    })
  },
  //点击关闭
  showStatus:function(){
    wx.navigateBack({
      delta: 1
    })
  }
})