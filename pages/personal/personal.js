// pages/personal/personal.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    indexdata:[],
    nickname:"",
    userinfo:true,
    progress:"",
    experience_lever:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nickname: app.globalData.nickname,
    });
    if (this.data.nickname == "") {
      this.setData({
        userinfo: false,
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
    this.indexajax();
    app.action_member_log("personal")
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.indexajax();
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
  //拒绝授权后的操作
  shouquan: function () {
    wx.showModal({
      title: '提示',
      content: '请重新进入小程序授权',
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
  //查询经验值百分比
  progress:function(){
    if (this.data.experience_lever==1){
      let data = parseInt(this.data.indexdata.experience) / 1500 * 100
      this.setData({
        progress: data
      })
    } else if (this.data.experience_lever == 2){
      let data = parseInt(this.data.indexdata.experience) / 3500 * 100
      this.setData({
        progress: data
      })
    } else if (this.data.experience_lever == 3) {
      this.setData({
        progress: 100
      })
    }
    
  },
  //查询数据
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
          indexdata: res.data,
          experience_lever: res.data.requirement_level
        })
        that.progress();
      }
    })
  },
  //跳转会员卡详情
  card:function(){
    wx.navigateTo({
      url: '../card-index/card-index'
    })
  },
})