class ResultModal {
  /**
   * 执行成功
   * @param {*} data 
   * @returns 
   */
  success(data = {}) {
    return {
      code: '000000',
      success: true,
      message: '成功',
      data
    }
  }

  /**
   * 执行错误
   * @param {*} codeType 
   * @param {*} message
   * @param {*} data 
   * @returns 
   */
  error(codeType, message, data = {}) {
    return {
      code: codeType.code,
      success: false,
      message: message || codeType.defaultMsg,
      data
    }
  }
}

module.exports = new ResultModal()