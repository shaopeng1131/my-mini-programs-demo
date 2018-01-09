// pages/messageBoard/messageBoard.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logged:false,
    userInfo: {},
    showMsgBox:false,
    isAgree:false,
    content:"",
    item: {
      user:{
        avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIkcYGz4vwCjvYPknrHicjByaf9BELTmFA7I9NX6199729gOjc3xtwjflT7dBYamFO3bMlB2ibicJ95w/0",
        city: "Weifang",
        country: "China",
        gender: "12天之前",
        language: "zh_CN",
        nickName: "飞天小莫",
        openId: "o6fAl0WLPwL42dittwW6QYYp8nxE",
        province: "Shandong"
      },
      like_count:"1234",
      content:"我是内容啦啦啦啦啦啦啦啦我是内容啦啦啦啦啦啦啦啦我是内容啦啦啦啦啦啦啦啦vv我是内容啦啦啦啦啦啦啦啦",
      creatTime:"12天之前",
      isSecret:"1"
      
    },
    hotcomemnt_hidden: true,
    dataList:[]
  },
  // 用户登录示例
  login: function () {
    var userInfo = util.checkLogin();
    if(userInfo.logged){
      this.setData(userInfo);
    }else{
      this.loginSync();
    }
    
  },
  loginSync:function(){
    util.showBusy('正在登录')
    var that = this
    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          util.showSuccess('登录成功')
          wx.setStorageSync("utilUserInfo", result);
          wx.setStorageSync("utilLogged", true);
          that.setData({
            userInfo:result,
            logged:true
          });
          that.getMsgList();
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              util.showSuccess('登录成功')
              wx.setStorageSync("utilUserInfo", result.data.data);
              wx.setStorageSync("utilLogged", true);
              that.setData({
                userInfo: result.data.data,
                logged:true
              });
              that.getMsgList();
            },

            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
              wx.setStorageSync("utilLogged", false);
            }
          })
        }
      },

      fail(error) {
        that.showModel('登录失败', error)
        console.log('登录失败', error)
        wx.setStorageSync("utilLogged", false);
      }
    })
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  bindMsgBox: function(){
    var boxStatus = !this.data.showMsgBox;
    this.setData({
      showMsgBox: boxStatus
    })
  },
  contentInputEvent:function(e){
    this.setData({
      content: e.detail.value
    })
  },
  submitData: function(e){
    var value = e.detail.value;
    if (value["content"] == "") return;
    this.setData({
      content: e.detail.value.content
    })
    util.showBusy('正在提交...')
    var that = this
    qcloud.request({
      url: `${config.service.host}/weapp/MessageBoard`,
      login: true,
      data:{
        uid: that.data.userInfo.openId,
        isAgree:that.data.isAgree,
        content: that.data.content,
        userInfo: that.data.userInfo
      },
      success(result) {
        util.showSuccess('提交成功')
        var dataList = that.data.dataList;
        var retData = {
          userInfo:that.data.userInfo,
          content: that.data.content,
          likeCount:"0",
          creatTime: result.data.data.creatTime
        };
        dataList.push(retData);
        that.setData({
          dataList: dataList,
          content:""
        })
      },
      fail(error) {
        util.showModel('提交失败', error);
        console.log('request fail', error);
      }
    })
    
  },

  getMsgList:function(){
    util.showBusy('正在加载...')
    var that = this
    qcloud.request({
      url: `${config.service.host}/weapp/MessageBoard/getMsgList`,
      login: true,
      data: {
        uid: that.data.userInfo.openId,
        more: "1"
      },
      success(result) {
        util.showSuccess('加载完成');
        var data = result.data.data;
        data.forEach(function(value,index,arr){
          var info = value.userInfo;
          info = JSON.parse(info);
          arr[index]["userInfo"] = info;
        });
        that.setData({
          dataList: result.data.data,
          content: ""
        })
      },
      fail(error) {
        util.showModel('加载失败', error);
        console.log('request fail', error);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loginSync();
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
    this.getMsgList();
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
    return {
      title: '留言板',
      desc: '留言板',
      path: '/pages/messageBoard/messageBoard'
    }
  }
})