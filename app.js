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
                name: "张建华",
                photo: "https://example.com/photos/doctor1.jpg",
                title: "主任医师、教授",
                specialties: "冠心病、高血压、心律失常、心力衰竭",
                introduction: "从事心血管内科临床工作20余年，擅长冠心病介入治疗、高血压的个体化治疗、各种心律失常的诊断与治疗。发表学术论文50余篇，主持省级科研项目3项。",
                // 保持向后兼容
                specialty: "心血管内科"
              },
              {
                id: 1002,
                name: "李明华", 
                photo: "https://example.com/photos/doctor2.jpg",
                title: "副主任医师、副教授",
                specialties: "胃肠道疾病、肝胆疾病、消化道肿瘤",
                introduction: "消化内科专业，具有丰富的临床经验。擅长胃肠镜检查与治疗，对消化道肿瘤的早期诊断有独到见解。多次参与国际学术交流。",
                // 保持向后兼容
                specialty: "消化内科"
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
                name: "王志强",
                photo: "https://example.com/photos/doctor3.jpg",
                title: "主任医师、科室主任",
                specialties: "腹腔镜手术、胃肠道肿瘤、疝气手术、胆囊疾病",
                introduction: "普外科专家，从事外科临床工作25年。精通各类腹腔镜微创手术，在胃肠道肿瘤综合治疗方面有丰富经验。担任多个学术组织委员。",
                // 保持向后兼容
                specialty: "普外科"
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
                name: "赵丽娟",
                photo: "https://example.com/photos/doctor4.jpg",
                title: "主任医师、博士生导师",
                specialties: "脑血管疾病、癫痫、帕金森病、认知障碍、头痛",
                introduction: "神经内科资深专家，博士学位。在脑血管病的预防和治疗、癫痫的规范化治疗、帕金森病的综合管理等方面有深入研究。主编专著2部。",
                // 保持向后兼容
                specialty: "神经内科"
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
              (doctor.specialties && doctor.specialties.includes(keyword)) ||
              (doctor.specialty && doctor.specialty.includes(keyword)) ||
              doctor.title.includes(keyword) ||
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