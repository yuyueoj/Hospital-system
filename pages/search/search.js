// pages/search/search.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchKeyword: '',
    searchFocus: false,
    searchResults: [],
    searchHistory: [],
    suggestions: [],
    showSuggestions: false,
    searched: false,
    searching: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadSearchHistory()
    this.initSuggestions()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示页面时，设置搜索框焦点
    this.setData({
      searchFocus: true
    })
  },

  /**
   * 初始化搜索建议
   */
  initSuggestions() {
    const allSuggestions = [
      '张医生', '李医生', '王医生', '赵医生',
      '内科', '外科', '神经内科', '心血管内科', '消化内科', '普外科',
      '北京协和医院', '北京大学第一医院',
      '主任医师', '副主任医师',
      '心血管', '消化', '神经', '肿瘤'
    ]
    this.allSuggestions = allSuggestions
  },

  /**
   * 加载搜索历史
   */
  loadSearchHistory() {
    const history = wx.getStorageSync('searchHistory') || []
    this.setData({
      searchHistory: history.slice(0, 10) // 最多显示10条历史记录
    })
  },

  /**
   * 保存搜索历史
   */
  saveSearchHistory(keyword) {
    if (!keyword.trim()) return
    
    let history = this.data.searchHistory
    // 移除重复项
    history = history.filter(item => item !== keyword)
    // 添加到开头
    history.unshift(keyword)
    // 限制数量
    history = history.slice(0, 10)
    
    this.setData({
      searchHistory: history
    })
    
    wx.setStorageSync('searchHistory', history)
  },

  /**
   * 搜索输入处理
   */
  onSearchInput(e) {
    const keyword = e.detail.value
    this.setData({
      searchKeyword: keyword
    })

    // 实时搜索建议
    if (keyword.trim()) {
      const suggestions = this.allSuggestions.filter(item => 
        item.includes(keyword)
      ).slice(0, 5)
      
      this.setData({
        suggestions: suggestions,
        showSuggestions: suggestions.length > 0
      })
    } else {
      this.setData({
        suggestions: [],
        showSuggestions: false,
        searchResults: [],
        searched: false
      })
    }
  },

  /**
   * 搜索确认
   */
  onSearchConfirm(e) {
    const keyword = e.detail.value
    if (keyword.trim()) {
      this.performSearchWithKeyword(keyword)
    }
  },

  /**
   * 执行搜索
   */
  performSearch() {
    const keyword = this.data.searchKeyword.trim()
    if (keyword) {
      this.performSearchWithKeyword(keyword)
    }
  },

  /**
   * 使用关键词执行搜索
   */
  performSearchWithKeyword(keyword) {
    this.setData({
      searching: true,
      showSuggestions: false,
      searched: true
    })

    // 保存搜索历史
    this.saveSearchHistory(keyword)

    // 模拟网络请求延迟
    setTimeout(() => {
      const results = app.searchDoctors(keyword)
      
      this.setData({
        searchResults: results,
        searching: false,
        searchKeyword: keyword
      })
    }, 500)
  },

  /**
   * 选择搜索建议
   */
  selectSuggestion(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({
      searchKeyword: keyword
    })
    this.performSearchWithKeyword(keyword)
  },

  /**
   * 选择搜索历史
   */
  selectHistory(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({
      searchKeyword: keyword
    })
    this.performSearchWithKeyword(keyword)
  },

  /**
   * 清空搜索历史
   */
  clearHistory() {
    wx.showModal({
      title: '清空历史',
      content: '确定要清空所有搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            searchHistory: []
          })
          wx.removeStorageSync('searchHistory')
        }
      }
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '医生信息搜索',
      path: '/pages/search/search'
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    // 重新加载搜索历史
    this.loadSearchHistory()
    wx.stopPullDownRefresh()
  }
})