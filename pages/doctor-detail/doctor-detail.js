// pages/doctor-detail/doctor-detail.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    doctorId: null,
    doctorInfo: {},
    specialtiesList: [],
    loading: true,
    error: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { doctorId } = options
    
    if (!doctorId) {
      this.setData({
        error: '参数错误',
        loading: false
      })
      return
    }

    this.setData({
      doctorId: parseInt(doctorId)
    })

    this.loadDoctorInfo()
  },

  /**
   * 加载医生详细信息
   */
  loadDoctorInfo() {
    this.setData({
      loading: true,
      error: null
    })

    // 模拟网络请求延迟
    setTimeout(() => {
      const doctorInfo = app.getDoctorById(this.data.doctorId)
      
      if (!doctorInfo) {
        this.setData({
          error: '医生信息不存在',
          loading: false
        })
        return
      }

      // 处理擅长病症列表
      const specialtiesList = doctorInfo.specialties ? 
        doctorInfo.specialties.split(/[、，,]/).filter(item => item.trim()) : [];

      this.setData({
        doctorInfo: doctorInfo,
        specialtiesList: specialtiesList,
        loading: false
      })

      // 设置页面标题为医生姓名
      wx.setNavigationBarTitle({
        title: doctorInfo.name
      })
    }, 500)
  },

  /**
   * 显示联系信息
   */
  showContactInfo() {
    const hospitalName = this.data.doctorInfo.hospitalName || '医院';
    wx.showModal({
      title: '联系医院',
      content: `请联系${hospitalName}相关科室进行预约挂号和咨询。建议通过医院官方渠道或现场挂号。`,
      confirmText: '知道了',
      showCancel: false
    })
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack()
  },

  /**
   * 重试加载
   */
  retry() {
    this.loadDoctorInfo()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: `${this.data.doctorInfo.name} - 医生详情`,
      path: `/pages/doctor-detail/doctor-detail?doctorId=${this.data.doctorId}`
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadDoctorInfo()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 页面滚动到底部
   */
  onReachBottom() {
    // 可以在这里实现更多相关医生推荐等功能
  }
})