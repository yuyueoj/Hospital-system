// pages/index/index.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hospitals: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadHospitals()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示页面时刷新数据
    this.loadHospitals()
  },

  /**
   * 加载医院数据
   */
  loadHospitals() {
    wx.showLoading({
      title: '加载中...',
    })

    // 模拟网络请求延迟
    setTimeout(() => {
      this.setData({
        hospitals: app.globalData.hospitalData
      })
      wx.hideLoading()
    }, 500)
  },

  /**
   * 选择医院
   */
  selectHospital(e) {
    const hospitalId = e.currentTarget.dataset.hospitalId
    const hospital = app.getHospitalById(hospitalId)
    
    if (!hospital) {
      wx.showToast({
        title: '医院信息不存在',
        icon: 'error'
      })
      return
    }

    // 跳转到科室页面
    wx.navigateTo({
      url: `/pages/departments/departments?hospitalId=${hospitalId}&hospitalName=${hospital.name}`
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '医生信息查询小程序',
      path: '/pages/index/index'
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadHospitals()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})