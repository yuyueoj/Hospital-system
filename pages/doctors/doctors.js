// pages/doctors/doctors.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hospitalId: null,
    departmentId: null,
    hospitalName: '',
    departmentName: '',
    doctors: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { hospitalId, departmentId, hospitalName, departmentName } = options
    
    if (!hospitalId || !departmentId) {
      wx.showToast({
        title: '参数错误',
        icon: 'error'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      return
    }

    this.setData({
      hospitalId: parseInt(hospitalId),
      departmentId: parseInt(departmentId),
      hospitalName: hospitalName || '',
      departmentName: departmentName || ''
    })

    this.loadDoctors()
  },

  /**
   * 加载医生数据
   */
  loadDoctors() {
    wx.showLoading({
      title: '加载中...',
    })

    // 模拟网络请求延迟
    setTimeout(() => {
      const department = app.getDepartmentById(this.data.hospitalId, this.data.departmentId)
      
      if (!department) {
        wx.hideLoading()
        wx.showToast({
          title: '科室信息不存在',
          icon: 'error'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
        return
      }

      this.setData({
        doctors: department.doctors
      })
      
      wx.hideLoading()
    }, 300)
  },

  /**
   * 选择医生
   */
  selectDoctor(e) {
    const doctorId = e.currentTarget.dataset.doctorId
    
    // 跳转到医生详情页面
    wx.navigateTo({
      url: `/pages/doctor-detail/doctor-detail?doctorId=${doctorId}`
    })
  },

  /**
   * 返回科室列表
   */
  goBack() {
    wx.navigateBack()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: `${this.data.hospitalName} ${this.data.departmentName} - 医生列表`,
      path: `/pages/doctors/doctors?hospitalId=${this.data.hospitalId}&departmentId=${this.data.departmentId}&hospitalName=${this.data.hospitalName}&departmentName=${this.data.departmentName}`
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadDoctors()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})