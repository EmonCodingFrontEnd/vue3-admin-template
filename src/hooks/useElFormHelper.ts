export default function(showAllError = false) {
  const validateCallback = (valid, fields) => {
    if (!valid) {
      let errMsg = '表单校验错误！'
      if (fields) {
        const fieldsKeys = Object.keys(fields)
        if (!showAllError) {
          const fieldsValue = fields[fieldsKeys[0]]
          errMsg = fieldsValue[0].message
        } else {
          errMsg = fieldsKeys.reduce((accumulator: string[], currentValue: string) => {
            const fieldsValue = fields[currentValue]
            accumulator.push(fieldsValue[0].message)
            return accumulator
          }, []).join('<br/>')
        }
      }
      throw new Error(errMsg)
    }
  }
  return { validateCallback }
}