const { City } = require('../models/City')
const { User } = require('../models/User')
const { delay } = require('./asyncLoop')
const { writeToFile } = require('./writeToFile')
const faker = require('faker')
const uuid = require('uuid')
const bcrypt = require('bcrypt')

module.exports = async () => {
  console.log('\n----------------------------------------')
  console.info('[UsersSeeder] users migration start')
  const cities = await City.find({})
  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash('password', salt)
  for (let key in cities) {
    let city = cities[key] || {}
    const phone = faker.phone.phoneNumber()
    const date = Date.now()
    try{
      const user = await User.findOneAndUpdate(
        { phone: phone },
        {
          phone: phone,
          avatar: faker.image.avatar(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password,
          isVerified: true,
          profession: faker.name.jobType(),
          _province: city._province,
          _city: city._id,
          language: 'fr',
          createdAt: date,
          updatedAt: date,
          birthDate: faker.date.between(new Date('1991-07-08'), new Date('2018-07-08'))
        },
        { upsert: true, new: true }
      )
    } catch (error) {
      console.info(error)
    }
  }
  await delay(50)
  console.info('[UsersSeeder] Users Migration Done!')
}
