// tools/data-validator.js
/**
 * 数据验证工具
 * 用于验证Excel导入数据的完整性和准确性
 */
class DataValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      duplicates: 0
    };
  }

  /**
   * 验证数据完整性
   */
  validateData(data) {
    this.reset();
    this.stats.totalRows = data.length;

    console.log('开始数据验证...');
    
    const validatedData = [];
    const seenDoctors = new Set();

    data.forEach((row, index) => {
      const rowNumber = index + 2; // Excel行号（从2开始，因为第1行是标题）
      const validation = this.validateRow(row, rowNumber);
      
      if (validation.isValid) {
        // 检查重复数据
        const doctorKey = `${row.医院名称}-${row.科室名称}-${row.医生姓名}`;
        if (seenDoctors.has(doctorKey)) {
          this.warnings.push(`第${rowNumber}行: 发现重复医生数据 - ${doctorKey}`);
          this.stats.duplicates++;
        } else {
          seenDoctors.add(doctorKey);
          validatedData.push(row);
          this.stats.validRows++;
        }
      } else {
        this.stats.invalidRows++;
      }
    });

    this.generateValidationReport();
    return {
      isValid: this.errors.length === 0,
      data: validatedData,
      errors: this.errors,
      warnings: this.warnings,
      stats: this.stats
    };
  }

  /**
   * 验证单行数据
   */
  validateRow(row, rowNumber) {
    const errors = [];
    
    // 必填字段验证
    const requiredFields = ['医生姓名', '医院名称', '科室名称'];
    requiredFields.forEach(field => {
      if (!row[field] || row[field].toString().trim() === '') {
        errors.push(`第${rowNumber}行: 缺少必填字段 "${field}"`);
      }
    });

    // 数据格式验证
    if (row['联系电话'] && !this.validatePhone(row['联系电话'])) {
      errors.push(`第${rowNumber}行: 联系电话格式不正确 "${row['联系电话']}"`);
    }

    // 数据长度验证
    if (row['医生姓名'] && row['医生姓名'].toString().length > 20) {
      errors.push(`第${rowNumber}行: 医生姓名过长（超过20个字符）`);
    }

    if (row['个人简介'] && row['个人简介'].toString().length > 500) {
      errors.push(`第${rowNumber}行: 个人简介过长（超过500个字符）`);
    }

    // 记录错误
    errors.forEach(error => this.errors.push(error));

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * 验证电话号码格式
   */
  validatePhone(phone) {
    const phoneRegex = /^[\d\-\s\(\)]+$/;
    const cleanPhone = phone.toString().replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(phone) && cleanPhone.length >= 7 && cleanPhone.length <= 15;
  }

  /**
   * 重置验证状态
   */
  reset() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      duplicates: 0
    };
  }

  /**
   * 生成验证报告
   */
  generateValidationReport() {
    console.log('\n=== 数据验证报告 ===');
    console.log(`总行数: ${this.stats.totalRows}`);
    console.log(`有效行数: ${this.stats.validRows}`);
    console.log(`无效行数: ${this.stats.invalidRows}`);
    console.log(`重复数据: ${this.stats.duplicates}`);
    console.log(`错误数量: ${this.errors.length}`);
    console.log(`警告数量: ${this.warnings.length}`);

    if (this.errors.length > 0) {
      console.log('\n❌ 数据错误:');
      this.errors.slice(0, 10).forEach(error => console.log(`  ${error}`));
      if (this.errors.length > 10) {
        console.log(`  ... 还有 ${this.errors.length - 10} 个错误`);
      }
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  数据警告:');
      this.warnings.slice(0, 5).forEach(warning => console.log(`  ${warning}`));
      if (this.warnings.length > 5) {
        console.log(`  ... 还有 ${this.warnings.length - 5} 个警告`);
      }
    }

    console.log('==================\n');
  }

  /**
   * 数据清理建议
   */
  getCleaningSuggestions() {
    const suggestions = [];

    if (this.stats.invalidRows > 0) {
      suggestions.push('请检查并修复无效行的数据');
    }

    if (this.stats.duplicates > 0) {
      suggestions.push('请检查并删除重复的医生数据');
    }

    if (this.errors.some(e => e.includes('电话格式'))) {
      suggestions.push('请检查电话号码格式，确保只包含数字、短横线、空格和括号');
    }

    if (this.errors.some(e => e.includes('过长'))) {
      suggestions.push('请缩短过长的文本字段');
    }

    return suggestions;
  }
}

module.exports = DataValidator;