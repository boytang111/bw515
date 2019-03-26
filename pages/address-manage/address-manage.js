// pages/address-manage/address-manage.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    addressdata: [],    
    classid:"",
    //删除或者修改判断
    delete_id:"",
    //是否选择
    choice:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断是选择还是查看
    if (options.choice){
      this.setData({
        choice: options.choice
      })
    }
    if (options.classid) {
      this.setData({
        classid: options.classid
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading({
      title: '拼命加载中',
    })
    this.address();
    app.action_member_log("address-manage", this.data.classid);
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.delete_id!=""){
      this.address()
    }
    
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
    wx.showShareMenu({
      withShareTicket: true,
      success(res) {
        app.click_interaction("zfxcx")
      },
    })
  },
  //获取地址列表
  address:function(){
    let that = this;
    let time = app.time();
    let data = {
      'time': time
    }
    let str = app.signature(data, app.globalData.key);
    wx.request({
      url: app.globalData.url + '/Member/address', // 仅为示例，并非真实的接口地址
      method: 'post',
      data: {
        'openid': app.globalData.openid,
        'absign': str,
        'time': time,
        'member_id': app.globalData.member_id,
      },
      success(res) {
        console.log(res.data);
        if(res.data.code==200){
          that.setData({
            addressdata: res.data.address
          })
        }else{
          that.setData({
            addressdata: []
          })
        }
      }
    })
  },
  //返回选择id
  choiceajax:function(e){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      addressid: e.currentTarget.dataset.id,
    });
    wx.navigateBack({
      delta: 1
    })
  }

})