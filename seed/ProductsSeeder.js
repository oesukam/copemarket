const { City } = require('../models/City')
const { User } = require('../models/User')
const { Product } = require('../models/Product')
const { Category } = require('../models/Category')
const { delay } = require('./asyncLoop')
const { writeToFile } = require('./writeToFile')
const faker = require('faker')
const uuid = require('uuid')
const bcrypt = require('bcrypt')

module.exports = async () => {
  console.log('\n----------------------------------------')
  console.info('[ProductsSeeder] Migration start')
  let categories = await Category.find({ _parent: { $ne: null }})
  const cities = await City.find({})
  const users = await User.find({})
  categories = categories.concat(categories)
  for (let key in categories) {
    let category = categories[key] || {}
    const phone = faker.phone.phoneNumber()
    const title = faker.commerce.productName()
    const date = Date.now()
    const city = cities[faker.random.number({min: 0, max: cities.length - 1})]
    const user = users[faker.random.number({min: 0, max: users.length - 1})]
    try{
      const record = await Product.findOneAndUpdate(
        { title },
        {
          title,
          poster: faker.image.fashion(),
          _category: category._parent,
          _type: category._id,
          _user: user._id,
          _city: city._id,
          _province: city._province,
          price: faker.random.number({min: 500, max: 10000}),
          description: faker.lorem.paragraph(),
          createdAt: date,
          updatedAt: date,
        },
        { upsert: true, new: true }
      )
    } catch (error) {
      console.info(error)
    }
  }
  await delay(50)
  console.info('[ProductsSeeder] Migration Done!')
}
