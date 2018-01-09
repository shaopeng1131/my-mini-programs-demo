// pages/idCardNo/idCardNo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    idCardLast: '',
    bankCardLast:''
  },

  /**
   * 计算银行卡末位置
   */
  bindReplaceInput: function (e) {
    var cardNo = e.detail.value;
    var luhmSum = 0;
    var lastNo;
    for (var i = cardNo.length - 1, j = 0; i >= 0; i-- , j++) {
      var k = cardNo.substring(i, i + 1);
      if (j % 2 == 0) {
        k *= 2;
        k = k > 9 ? k - 9 : k;
      }
      luhmSum += parseInt(k);
    }
    luhmSum += "";
    var s = luhmSum.charAt(luhmSum.length - 1);

    if (parseInt(s) > 0) {
      lastNo = 10 - s;
    } else {
      lastNo = 0;
    }
    this.setData({
      bankCardLast: lastNo
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(this.shi);
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
    return {
      title: '身份证号校验位计算',
      desc: '身份证号校验位计算',
      path: '/pages/idCardNo/idCardNo'
    }
  }
})