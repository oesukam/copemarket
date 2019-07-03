const { Province } = require('../models/Province')
const { delay } = require('./asyncLoop')
const { writeToFile } = require('./writeToFile')
const faker = require('faker')
const uuid = require('uuid')
const provinces = require('../mocks/provinces.mock.fr')

module.exports = async () => {
  console.log('\n----------------------------------------')
  console.info('[ProvincesSeeder] migration start')
  for (let key in provinces) {
    let value = provinces[key] || ''
    const date = Date.now()
    try{
      await Province.findOneAndUpdate(
        { name: value },
        {
          uid: uuid.v4(),
          name: value,
          keywords: value.toLocaleLowerCase().replace(/(-|\s)/g, ' '),
          updatedAt: date,
          createdAt: date,
        },
        { upsert: true, new: true }
      )
    } catch (error) {
      console.info(error)
    }
  }
  await delay(50)
  console.info('[ProvinceSeeder] Migration Done!')
}
