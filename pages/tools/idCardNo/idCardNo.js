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
   * 计算身份证号末位
   */
  bindKeyInput: function (e) {
    var code = e.detail.value;
    code = code.split('');
    //∑(ai×Wi)(mod 11)
    //加权因子
    var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    //校验位
    var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
    var sum = 0;
    var ai = 0;
    var wi = 0;
    for (var i = 0; i < 17; i++) {
      ai = code[i];
      wi = factor[i];
      sum += ai * wi;
    }

    var last = parity[sum % 11];

    this.setData({
      idCardLast: last
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