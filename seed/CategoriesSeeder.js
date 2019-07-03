const { Category } = require('../models/Category')
const { delay } = require('./asyncLoop')
const { writeToFile } = require('./writeToFile')
const faker = require('faker')
const uuid = require('uuid')
const categories = require('../mocks/categories.mock.fr')

module.exports = async () => {
  console.log('\n----------------------------------------')
  console.info('[CategoriesSeeder] migration start')
  for (let key in categories) {
    let value = categories[key] || {}
    const date = Date.now()
    let parent
    if (value.name) {
      try{
        if (value.parent) {
          parent = await Category.findOne({ name: value.parent})
        }
        await Category.findOneAndUpdate(
          { name: value.name },
          {
            name: value.name,
            _parent: parent ? parent._id : undefined,
            parent: parent ? parent._id : undefined,
            keywords: value.name.toLocaleLowerCase().replace(/(&|-|\s)/g, ' ') + value.name.toLocaleLowerCase().replace(/(&|-|\s)/g, ' '),
            updatedAt: date,
            createdAt: date,
          },
          { upsert: true, new: true }
        )
      } catch (error) {
        console.info(error)
      }
    }
  }
  await delay(50)
  console.info('[CategoriesSeeder] Migration Done!')
}
