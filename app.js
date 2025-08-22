// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  
  globalData: {
    userInfo: null,
    // 模拟数据库数据
    hospitalData: [
      {
        id: 1,
        name: "北京协和医院",
        address: "北京市东城区帅府园1号",
        phone: "010-69156114",
        image: "/images/hospital1.jpg",
        departments: [
          {
            id: 101,
            name: "内科",
            description: "内科疾病诊治",
            doctors: [
              {
                id: 1001,
                name: "张医生",
                title: "主任医师",
                specialty: "心血管内科",
                experience: "15年",
                education: "北京医科大学",
                phone: "010-69156001",
                schedule: "周一至周五 8:00-17:00",
                introduction: "擅长冠心病、高血压、心律失常等疾病的诊治"
              },
              {
                id: 1002,
                name: "李医生", 
                title: "副主任医师",
                specialty: "消化内科",
                experience: "12年",
                education: "清华大学医学院",
                phone: "010-69156002",
                schedule: "周二至周六 9:00-18:00",
                introduction: "专业从事胃肠疾病、肝胆疾病的诊治"
              }
            ]
          },
          {
            id: 102,
            name: "外科",
            description: "外科手术治疗",
            doctors: [
              {
                id: 1003,
                name: "王医生",
                title: "主任医师",
                specialty: "普外科",
                experience: "20年",
                education: "北京大学医学部",
                phone: "010-69156003",
                schedule: "周一至周五 8:00-16:00",
                introduction: "擅长腹腔镜手术、胃肠道肿瘤手术"
              }
            ]
          }
        ]
      },
      {
        id: 2,
        name: "北京大学第一医院",
        address: "北京市西城区西什库大街8号",
        phone: "010-83572211",
        image: "/images/hospital2.jpg",
        departments: [
          {
            id: 201,
            name: "神经内科",
            description: "神经系统疾病诊治",
            doctors: [
              {
                id: 2001,
                name: "赵医生",
                title: "主任医师",
                specialty: "神经内科",
                experience: "18年",
                education: "北京大学医学部",
                phone: "010-83572001",
                schedule: "周一至周四 8:30-17:30",
                introduction: "专攻脑血管疾病、癫痫、帕金森病的治疗"
              }
            ]
          }
        ]
      }
    ]
  },

  // 搜索功能
  searchDoctors(keyword) {
    const results = []
    this.globalData.hospitalData.forEach(hospital => {
      hospital.departments.forEach(department => {
        department.doctors.forEach(doctor => {
          if (doctor.name.includes(keyword) || 
              doctor.specialty.includes(keyword) ||
              doctor.introduction.includes(keyword) ||
              hospital.name.includes(keyword) ||
              department.name.includes(keyword)) {
            results.push({
              ...doctor,
              hospitalName: hospital.name,
              departmentName: department.name
            })
          }
        })
      })
    })
    return results
  },

  // 根据医院ID获取医院信息
  getHospitalById(hospitalId) {
    return this.globalData.hospitalData.find(hospital => hospital.id === hospitalId)
  },

  // 根据科室ID获取科室信息
  getDepartmentById(hospitalId, departmentId) {
    const hospital = this.getHospitalById(hospitalId)
    if (hospital) {
      return hospital.departments.find(dept => dept.id === departmentId)
    }
    return null
  },

  // 根据医生ID获取医生信息
  getDoctorById(doctorId) {
    for (let hospital of this.globalData.hospitalData) {
      for (let department of hospital.departments) {
        const doctor = department.doctors.find(doc => doc.id === doctorId)
        if (doctor) {
          return {
            ...doctor,
            hospitalName: hospital.name,
            departmentName: department.name
          }
        }
      }
    }
    return null
  }
})