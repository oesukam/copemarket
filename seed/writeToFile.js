const fs = require('fs')

module.exports.writeToFile = ({ fileNamePath = '', data = ''}) => {
  return new Promise(async (resolve, reject) => {
    if (!fileNamePath || !data) {
      reject(new Error('fileName or data not provided'))
    }
    const jsonData = JSON.stringify(data)
    try {
      const saved = await fs.writeFileSync(`${__dirname}/${fileNamePath}`, jsonData )
    }
    catch(err) {
      reject(new Error(err))
    }
    console.info('[writeToFile]', fileNamePath, 'updated')
    resolve(true)
  })
}

