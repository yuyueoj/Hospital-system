# 医生信息查询小程序

一个基于微信小程序的医生信息检索系统，支持三级目录结构（医院-科室-医生）和关键词搜索功能。

## 功能特性

### 🏥 三级目录浏览
- **第一级：医院列表** - 显示所有医院信息，包括地址、电话等
- **第二级：科室列表** - 显示选定医院的所有科室
- **第三级：医生列表** - 显示选定科室的所有医生

### 🔍 智能搜索
- **关键词搜索** - 支持医生姓名、科室、医院名称搜索
- **搜索建议** - 实时显示搜索建议
- **搜索历史** - 自动保存搜索历史记录

### 👨‍⚕️ 医生详情
- **完整信息** - 显示医生的详细信息
- **联系方式** - 支持一键拨打电话
- **出诊时间** - 显示医生的工作时间安排

### 🎨 用户体验
- **现代化UI** - 采用卡片式设计，界面美观
- **响应式布局** - 适配不同屏幕尺寸
- **加载状态** - 提供加载和错误状态反馈
- **下拉刷新** - 支持下拉刷新数据

## 项目结构

```
/
├── app.js                 # 小程序主入口文件
├── app.json              # 小程序全局配置
├── app.wxss              # 全局样式文件
├── sitemap.json          # 搜索配置文件
├── images/               # 图片资源目录
└── pages/                # 页面目录
    ├── index/            # 首页（医院列表）
    │   ├── index.wxml    # 页面模板
    │   ├── index.js      # 页面逻辑
    │   ├── index.wxss    # 页面样式
    │   └── index.json    # 页面配置
    ├── departments/      # 科室页面
    │   ├── departments.wxml
    │   ├── departments.js
    │   ├── departments.wxss
    │   └── departments.json
    ├── doctors/          # 医生列表页面
    │   ├── doctors.wxml
    │   ├── doctors.js
    │   ├── doctors.wxss
    │   └── doctors.json
    ├── doctor-detail/    # 医生详情页面
    │   ├── doctor-detail.wxml
    │   ├── doctor-detail.js
    │   ├── doctor-detail.wxss
    │   └── doctor-detail.json
    └── search/           # 搜索页面
        ├── search.wxml
        ├── search.js
        ├── search.wxss
        └── search.json
```

## 核心功能实现

### 1. 数据管理 (`app.js`)

```javascript
// 全局数据存储
globalData: {
  hospitalData: [
    {
      id: 1,
      name: "医院名称",
      departments: [
        {
          id: 101,
          name: "科室名称",
          doctors: [
            {
              id: 1001,
              name: "医生姓名",
              // ... 其他医生信息
            }
          ]
        }
      ]
    }
  ]
}

// 搜索功能
searchDoctors(keyword) {
  // 在医院、科室、医生信息中搜索关键词
}

// 数据获取工具函数
getHospitalById(hospitalId)
getDepartmentById(hospitalId, departmentId)
getDoctorById(doctorId)
```

### 2. 页面导航

```javascript
// 医院 → 科室
wx.navigateTo({
  url: `/pages/departments/departments?hospitalId=${hospitalId}`
})

// 科室 → 医生列表
wx.navigateTo({
  url: `/pages/doctors/doctors?hospitalId=${hospitalId}&departmentId=${departmentId}`
})

// 医生列表 → 医生详情
wx.navigateTo({
  url: `/pages/doctor-detail/doctor-detail?doctorId=${doctorId}`
})
```

### 3. 搜索功能

- **实时搜索建议**: 用户输入时显示匹配的建议
- **搜索历史**: 使用 `wx.getStorageSync` 和 `wx.setStorageSync` 存储历史记录
- **模糊匹配**: 支持医生姓名、专业、医院、科室等多字段搜索

### 4. 用户交互

- **下拉刷新**: 所有列表页面支持下拉刷新
- **一键拨号**: 使用 `wx.makePhoneCall` 实现一键拨打医生电话
- **页面分享**: 使用 `onShareAppMessage` 支持页面分享

## 样式设计

### 设计理念
- **简洁现代**: 采用卡片式设计，界面简洁清晰
- **色彩统一**: 使用蓝色系作为主色调 (`#4a90e2`)
- **用户友好**: 提供清晰的视觉反馈和状态指示

### 关键样式特性
- **渐变背景**: 使用CSS渐变创建视觉层次
- **圆角设计**: 统一的圆角风格 (`16rpx`)
- **阴影效果**: 适度的阴影增加层次感
- **动画过渡**: 平滑的交互动画效果

### 响应式设计
```css
@media (max-width: 375px) {
  .mobile-full-width {
    width: 100% !important;
  }
}
```

## 开发要点

### 1. 数据结构设计
```javascript
// 医院数据结构
{
  id: 1,
  name: "医院名称",
  address: "医院地址",
  phone: "联系电话",
  departments: [
    {
      id: 101,
      name: "科室名称",
      description: "科室描述",
      doctors: [
        {
          id: 1001,
          name: "医生姓名",
          title: "职称",
          specialty: "专业领域",
          experience: "从业经验",
          education: "教育背景",
          phone: "联系电话",
          schedule: "出诊时间",
          introduction: "个人介绍"
        }
      ]
    }
  ]
}
```

### 2. 页面状态管理
- **加载状态**: 显示加载指示器
- **错误状态**: 提供错误信息和重试按钮
- **空状态**: 友好的空数据提示

### 3. 性能优化
- **数据缓存**: 使用小程序存储缓存搜索历史
- **按需加载**: 页面数据按需获取
- **图片优化**: 使用适当的图片格式和尺寸

## 部署说明

### 1. 开发环境
- 微信开发者工具
- Node.js (可选，用于构建工具)

### 2. 配置步骤
1. 在微信开发者工具中导入项目
2. 配置小程序AppID
3. 上传代码到微信后台
4. 提交审核并发布

### 3. 数据对接
- 替换 `app.js` 中的模拟数据
- 实现真实的API接口调用
- 配置服务器域名白名单

## 扩展功能

### 可以添加的功能
- **用户登录**: 实现用户系统
- **收藏功能**: 收藏常用医生
- **预约挂号**: 集成预约系统
- **评价系统**: 医生评价和反馈
- **地图导航**: 医院位置导航
- **多媒体**: 医生照片和视频介绍

### 技术改进
- **状态管理**: 使用更复杂的状态管理方案
- **组件化**: 抽取可复用组件
- **TypeScript**: 使用TypeScript增强类型安全
- **单元测试**: 添加自动化测试

## 许可证

MIT License - 可自由使用和修改

## 联系方式

如有问题或建议，请通过以下方式联系：
- 创建 Issue
- 发送邮件
- 微信群讨论

---

**注意**: 这是一个演示项目，包含模拟数据。在生产环境中使用时，请替换为真实的医生和医院数据，并确保数据的准确性和时效性。