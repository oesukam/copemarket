const { Province } = require('../models/Province')
const { City } = require('../models/City')
const { delay } = require('./asyncLoop')
const { writeToFile } = require('./writeToFile')
const faker = require('faker')
const uuid = require('uuid')
const cities = require('../mocks/cities.mock.fr')

module.exports = async () => {
  console.log('\n----------------------------------------')
  console.info('[CitiesSeeder] cities migration start')
  for (let key in cities) {
    let value = cities[key] || {}
    const date = Date.now()
    try{
      const province = await Province.findOne({ name: value.province})
      if (province) {
        await City.findOneAndUpdate(
          { name: value.city },
          {
            uid: uuid.v4(),
            name: value.city,
            _province: province._id,
            keywords: value.city.toLocaleLowerCase().replace(/(-|\s)/g, ' ') + value.province.toLocaleLowerCase().replace(/(-|\s)/g, ' '),
            updatedAt: date,
            createdAt: date,
          },
          { upsert: true, new: true }
        )
      }

    } catch (error) {
      console.info(error)
    }
  }
  await delay(50)
  console.info('[CitiesSeeder] Cities Migration Done!')
}
