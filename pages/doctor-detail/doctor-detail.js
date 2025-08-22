// pages/doctor-detail/doctor-detail.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    doctorId: null,
    doctorInfo: {},
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

      this.setData({
        doctorInfo: doctorInfo,
        loading: false
      })

      // 设置页面标题为医生姓名
      wx.setNavigationBarTitle({
        title: doctorInfo.name
      })
    }, 500)
  },

  /**
   * 拨打电话
   */
  makePhoneCall() {
    if (!this.data.doctorInfo.phone) {
      wx.showToast({
        title: '暂无联系电话',
        icon: 'error'
      })
      return
    }

    wx.showModal({
      title: '拨打电话',
      content: `确定要拨打 ${this.data.doctorInfo.phone} 吗？`,
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: this.data.doctorInfo.phone,
            fail: (err) => {
              wx.showToast({
                title: '拨打失败',
                icon: 'error'
              })
              console.error('拨打电话失败：', err)
            }
          })
        }
      }
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