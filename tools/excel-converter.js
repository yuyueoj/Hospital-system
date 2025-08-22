// tools/excel-converter.js
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const DataValidator = require('./data-validator');

/**
 * Excel数据转换工具
 * 将Excel文件中的医生数据转换为小程序可用的JSON格式
 */
class ExcelConverter {
  constructor() {
    this.hospitalData = [];
  }

  /**
   * 读取Excel文件并转换数据
   * @param {string} filePath Excel文件路径
   * @param {object} options 转换选项
   */
  async convertExcelToJson(filePath, options = {}) {
    try {
      console.log('开始读取Excel文件:', filePath);
      
      // 读取Excel文件
      const workbook = XLSX.readFile(filePath);
      const sheetName = options.sheetName || workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // 转换为JSON数组
      const rawData = XLSX.utils.sheet_to_json(worksheet);
      console.log(`读取到 ${rawData.length} 条数据记录`);
      
      // 数据验证
      const validator = new DataValidator();
      const validation = validator.validateData(rawData);
      
      if (!validation.isValid) {
        console.error('数据验证失败，请修复错误后重试');
        const suggestions = validator.getCleaningSuggestions();
        if (suggestions.length > 0) {
          console.log('\n建议：');
          suggestions.forEach(s => console.log(`  - ${s}`));
        }
        throw new Error('数据验证失败');
      }
      
      // 数据清理和转换
      const cleanedData = this.cleanAndValidateData(validation.data);
      console.log(`有效数据记录: ${cleanedData.length} 条`);
      
      // 按医院和科室分组
      const groupedData = this.groupDataByHospitalAndDepartment(cleanedData);
      
      // 生成最终数据结构
      this.hospitalData = this.generateHospitalStructure(groupedData);
      
      console.log('数据转换完成!');
      return this.hospitalData;
      
    } catch (error) {
      console.error('Excel文件转换失败:', error.message);
      throw error;
    }
  }

  /**
   * 数据清理和验证
   */
  cleanAndValidateData(rawData) {
    const requiredFields = ['医生姓名', '医院名称', '科室名称'];
    
    return rawData.filter((row, index) => {
      // 检查必填字段
      for (const field of requiredFields) {
        if (!row[field] || row[field].toString().trim() === '') {
          console.warn(`第 ${index + 2} 行数据缺少必填字段: ${field}`);
          return false;
        }
      }
      return true;
    }).map(row => {
      // 数据清理和标准化
      return {
        doctorName: row['医生姓名']?.toString().trim(),
        hospitalName: row['医院名称']?.toString().trim(),
        departmentName: row['科室名称']?.toString().trim(),
        title: row['职称']?.toString().trim() || '医师',
        specialty: row['专业领域']?.toString().trim() || row['科室名称']?.toString().trim(),
        experience: row['从业经验']?.toString().trim() || '多年',
        education: row['毕业院校']?.toString().trim() || '医学院校',
        phone: row['联系电话']?.toString().trim() || '',
        schedule: row['出诊时间']?.toString().trim() || '请咨询医院',
        introduction: row['个人简介']?.toString().trim() || '经验丰富的医疗专家',
        hospitalAddress: row['医院地址']?.toString().trim() || '',
        hospitalPhone: row['医院电话']?.toString().trim() || '',
        departmentDescription: row['科室描述']?.toString().trim() || ''
      };
    });
  }

  /**
   * 按医院和科室分组数据
   */
  groupDataByHospitalAndDepartment(data) {
    const grouped = {};
    
    data.forEach(doctor => {
      const hospitalKey = doctor.hospitalName;
      const departmentKey = doctor.departmentName;
      
      if (!grouped[hospitalKey]) {
        grouped[hospitalKey] = {
          hospitalName: doctor.hospitalName,
          hospitalAddress: doctor.hospitalAddress,
          hospitalPhone: doctor.hospitalPhone,
          departments: {}
        };
      }
      
      if (!grouped[hospitalKey].departments[departmentKey]) {
        grouped[hospitalKey].departments[departmentKey] = {
          departmentName: doctor.departmentName,
          departmentDescription: doctor.departmentDescription || `${doctor.departmentName}专业诊疗`,
          doctors: []
        };
      }
      
      // 生成唯一的医生ID
      const doctorId = this.generateDoctorId(doctor);
      
      grouped[hospitalKey].departments[departmentKey].doctors.push({
        id: doctorId,
        name: doctor.doctorName,
        title: doctor.title,
        specialty: doctor.specialty,
        experience: doctor.experience,
        education: doctor.education,
        phone: doctor.phone,
        schedule: doctor.schedule,
        introduction: doctor.introduction
      });
    });
    
    return grouped;
  }

  /**
   * 生成医院数据结构
   */
  generateHospitalStructure(groupedData) {
    const hospitals = [];
    let hospitalId = 1;
    let departmentId = 100;
    
    for (const [hospitalKey, hospitalInfo] of Object.entries(groupedData)) {
      const hospital = {
        id: hospitalId++,
        name: hospitalInfo.hospitalName,
        address: hospitalInfo.hospitalAddress || `${hospitalInfo.hospitalName}地址`,
        phone: hospitalInfo.hospitalPhone || '请联系医院',
        image: `/images/hospital${hospitalId}.jpg`,
        departments: []
      };
      
      for (const [departmentKey, departmentInfo] of Object.entries(hospitalInfo.departments)) {
        hospital.departments.push({
          id: departmentId++,
          name: departmentInfo.departmentName,
          description: departmentInfo.departmentDescription,
          doctors: departmentInfo.doctors
        });
      }
      
      hospitals.push(hospital);
    }
    
    return hospitals;
  }

  /**
   * 生成唯一的医生ID
   */
  generateDoctorId(doctor) {
    const hash = this.simpleHash(doctor.hospitalName + doctor.departmentName + doctor.doctorName);
    return 1000 + (hash % 9000); // 生成1000-9999之间的ID
  }

  /**
   * 简单哈希函数
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash);
  }

  /**
   * 保存转换后的数据到文件
   */
  async saveToFile(outputPath = './data/hospital-data.json') {
    try {
      // 确保输出目录存在
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // 保存JSON文件
      fs.writeFileSync(outputPath, JSON.stringify(this.hospitalData, null, 2), 'utf8');
      console.log(`数据已保存到: ${outputPath}`);
      
      // 同时生成app.js格式的数据
      this.generateAppJsData(path.join(dir, 'app-data.js'));
      
      return outputPath;
    } catch (error) {
      console.error('保存文件失败:', error.message);
      throw error;
    }
  }

  /**
   * 生成app.js格式的数据文件
   */
  generateAppJsData(outputPath) {
    const appJsContent = `// 自动生成的医院数据 - ${new Date().toLocaleString()}
// 请将此数据替换到 app.js 中的 globalData.hospitalData

const hospitalData = ${JSON.stringify(this.hospitalData, null, 2)};

module.exports = hospitalData;

// 使用方法:
// 1. 复制上面的 hospitalData 数组
// 2. 替换 app.js 中 globalData.hospitalData 的值
// 3. 或者使用 require 引入: const hospitalData = require('./data/app-data.js');
`;
    
    fs.writeFileSync(outputPath, appJsContent, 'utf8');
    console.log(`App.js数据文件已生成: ${outputPath}`);
  }

  /**
   * 生成数据统计报告
   */
  generateReport() {
    const report = {
      totalHospitals: this.hospitalData.length,
      totalDepartments: this.hospitalData.reduce((sum, h) => sum + h.departments.length, 0),
      totalDoctors: this.hospitalData.reduce((sum, h) => 
        sum + h.departments.reduce((dSum, d) => dSum + d.doctors.length, 0), 0),
      hospitalList: this.hospitalData.map(h => ({
        name: h.name,
        departments: h.departments.length,
        doctors: h.departments.reduce((sum, d) => sum + d.doctors.length, 0)
      }))
    };
    
    console.log('\n=== 数据导入统计报告 ===');
    console.log(`医院总数: ${report.totalHospitals}`);
    console.log(`科室总数: ${report.totalDepartments}`);
    console.log(`医生总数: ${report.totalDoctors}`);
    console.log('\n各医院详情:');
    report.hospitalList.forEach(h => {
      console.log(`  ${h.name}: ${h.departments}个科室, ${h.doctors}位医生`);
    });
    console.log('========================\n');
    
    return report;
  }
}

// 使用示例
async function main() {
  const converter = new ExcelConverter();
  
  try {
    // 检查命令行参数
    const excelFile = process.argv[2];
    if (!excelFile) {
      console.log('使用方法: node excel-converter.js <Excel文件路径>');
      console.log('示例: node excel-converter.js ./data/doctors.xlsx');
      return;
    }
    
    // 检查文件是否存在
    if (!fs.existsSync(excelFile)) {
      console.error('Excel文件不存在:', excelFile);
      return;
    }
    
    // 转换数据
    await converter.convertExcelToJson(excelFile);
    
    // 保存数据
    await converter.saveToFile('./data/hospital-data.json');
    
    // 生成报告
    converter.generateReport();
    
    console.log('✅ Excel数据导入完成!');
    
  } catch (error) {
    console.error('❌ 数据导入失败:', error.message);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = ExcelConverter;