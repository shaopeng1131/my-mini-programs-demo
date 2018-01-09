var qcloud = require('../vendor/wafer2-client-sdk/index')
var config = require('../config')
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}
var checkLogin = function(){
  var userInfo = wx.getStorageSync("utilUserInfo");
  var logged = wx.getStorageSync("utilLogged");
  if(logged){
    return {
      userInfo: userInfo,
      logged: logged
    };
  }else{
    return {
      userInfo: "",
      logged: false
    };
  }
  
 
}

var login=function(){
  this.showBusy('正在登录')
  var that = this
  // 调用登录接口
  qcloud.login({
    success(result) {
      if (result) {
        that.showSuccess('登录成功')
        wx.setStorageSync("utilUserInfo", result);
        wx.setStorageSync("utilLogged", true);
        return result;
      } else {
        // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
        qcloud.request({
          url: config.service.requestUrl,
          login: true,
          success(result) {
            that.showSuccess('登录成功')
            wx.setStorageSync("utilUserInfo", result.data.data);
            wx.setStorageSync("utilLogged", true);
            return result.data.data;
          },

          fail(error) {
            that.showModel('请求失败', error)
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
}

/**
    * 友好的时间显示
    * 
    * @param int    sTime 待显示的时间
    * @param string type  类型. normal | mohu | full | ymd | other
    * @param string alt   已失效
    * @return string
    */
var friendlyDate=function(sTime,sType = "normal") {
  //sTime=源时间，cTime=当前时间，dTime=时间差
  var cTime = date.getTime();
  var dTime = cTime - sTime;
  //dDay		=	intval(date("Ymd",cTime)) - intval(date("Ymd",sTime));
  var dDay = dTime / 3600 / 24;
  var dYear = parseInt(date("Y", cTime)) - parseInt(date("Y", sTime));
  //normal：n秒前，n分钟前，n小时前，日期
  if (sType == 'normal') {
    if (dTime < 60) {
      return dTime+"秒前";
    } else if(dTime < 3600){
      return parseInt(dTime / 60)+"分钟前";
    } else if(dTime >= 3600 && dDay == 0){
      //return intval(dTime/3600)."小时前";
      return '今天'+date('H:i', sTime);
    } else if(dYear == 0){
      return date("m月d日 H:i", sTime);
    }else{
      return date("Y-m-d H:i", sTime);
    }
  } else if(sType == 'mohu'){
    if (dTime < 60) {
      return dTime + "秒前";
    } else if(dTime < 3600){
      return parseInt(dTime / 60) + "分钟前";
    } else if(dTime >= 3600 && dDay == 0){
      return parseInt(dTime / 3600) + "小时前";
    } else if(dDay > 0 && dDay <= 7){
      return parseInt(dDay) + "天前";
    } else if(dDay > 7 && dDay <= 30){
      return ceil(dDay / 7) + '周前';
    } else if(dDay > 30){
      return ceil(dDay / 30) + '个月前';
    }
    //full: Y-m-d , H:i:s
  } else if(sType == 'full'){
    return date("Y-m-d , H:i:s", sTime);
  } else if(sType == 'ymd'){
    return date("Y-m-d", sTime);
  }else{
    if (dTime < 60) {
      return dTime+"秒前";
    } else if(dTime < 3600){
      return parseInt(dTime / 60)+"分钟前";
    } else if(dTime >= 3600 && dDay == 0){
      return parseInt(dTime / 3600)+"小时前";
    } else if(dYear == 0){
      return date("Y-m-d H:i:s", sTime);
    }else{
      return date("Y-m-d H:i:s", sTime);
    }
  }
}


module.exports = { formatTime, showBusy, showSuccess, showModel, checkLogin, login,friendlyDate }
