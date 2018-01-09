//index.js
//获取应用实例
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    motto: 'Hello 欢迎使用程序员小工具',
    userInfo: {},
    logged:false
  },
  onLoad: function () {
    var userInfo = util.checkLogin();
    this.setData(userInfo);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var userInfo = util.checkLogin();
    this.setData(userInfo);
  },
  // 用户登录示例
  bindViewTap: function () {
    if (this.data.logged) return

    util.showBusy('正在登录')
    var that = this

    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          util.showSuccess('登录成功')
          that.setData({
            userInfo: result,
            logged: true
          })
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              util.showSuccess('登录成功')
              that.setData({
                userInfo: result.data.data,
                logged: true
              })
            },

            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
      },

      fail(error) {
        util.showModel('登录失败', error)
        console.log('登录失败', error)
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '程序员工具',
      desc: '程序员工具',
      path: '/pages/idCardNo/idCardNo'
    }
  }
})
