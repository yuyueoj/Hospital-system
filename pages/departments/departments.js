// pages/departments/departments.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hospitalId: null,
    hospitalName: '',
    hospitalInfo: {},
    departments: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { hospitalId, hospitalName } = options
    
    if (!hospitalId) {
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
      hospitalName: hospitalName || ''
    })

    this.loadDepartments()
  },

  /**
   * 加载科室数据
   */
  loadDepartments() {
    wx.showLoading({
      title: '加载中...',
    })

    // 模拟网络请求延迟
    setTimeout(() => {
      const hospital = app.getHospitalById(this.data.hospitalId)
      
      if (!hospital) {
        wx.hideLoading()
        wx.showToast({
          title: '医院信息不存在',
          icon: 'error'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
        return
      }

      this.setData({
        hospitalInfo: hospital,
        hospitalName: hospital.name,
        departments: hospital.departments
      })
      
      wx.hideLoading()
    }, 300)
  },

  /**
   * 选择科室
   */
  selectDepartment(e) {
    const departmentId = e.currentTarget.dataset.departmentId
    const department = app.getDepartmentById(this.data.hospitalId, departmentId)
    
    if (!department) {
      wx.showToast({
        title: '科室信息不存在',
        icon: 'error'
      })
      return
    }

    // 跳转到医生列表页面
    wx.navigateTo({
      url: `/pages/doctors/doctors?hospitalId=${this.data.hospitalId}&departmentId=${departmentId}&hospitalName=${this.data.hospitalName}&departmentName=${department.name}`
    })
  },

  /**
   * 返回医院列表
   */
  goBack() {
    wx.navigateBack()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: `${this.data.hospitalName} - 科室选择`,
      path: `/pages/departments/departments?hospitalId=${this.data.hospitalId}&hospitalName=${this.data.hospitalName}`
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadDepartments()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})