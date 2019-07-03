var args = process.argv.slice(2)
require('../config/mongoose')
const { CategorySchema, ProvinceSchema, CitySchema, UserSchema, ProductSchema } = require('../models')

const completed = (msg = 'Seed Completed') =>
  new Promise(resolve => {
    setTimeout(() => {
      console.info('\n----------------------------------------')
      console.info('[seed-index]', msg)
      process.exit()
      resolve(true)
    }, 1000)
  })

const asyncFunc = (func = () => (console.error('Wrong param'))) =>
  new Promise(async resolve => {
    await func
    setTimeout(() => {
      resolve(true)
    }, 500)
  })

const seeder = {
  Categories: require('./CategoriesSeeder'),
  Provinces: require('./ProvincesSeeder'),
  Cities: require('./CitiesSeeder'),
  Users: require('./UsersSeeder'),
  Products: require('./ProductsSeeder'),
}

if (args.length === 0) {
  Promise.all([
    // asyncFunc(Event.remove({})),
    // asyncFunc(Place.remove({})),
    // asyncFunc(Category.remove({})),
    // asyncFunc(User.remove({})),
  ])
    .then(async () => {
      await seeder.Categories()
      await seeder.Provinces()
      await seeder.Cities()
      await seeder.Users()
      await seeder.Products()
      // await seeder.Places()
      // await seeder.Events()
      completed()
    })
} else {
  let seed = args[0]
  if (seed === 'delete') {
    Promise.all([
      asyncFunc(ProductSchema.remove({})),
      asyncFunc(CategorySchema.remove({})),
      asyncFunc(CitySchema.remove({})),
      asyncFunc(ProvinceSchema.remove({})),
      asyncFunc(UserSchema.remove({})),
    ])
      .then(async () => {
        completed('All data removed')
      })
  } else {
    Promise.all([])
    .then(async () => {
      await seeder[seed]()
      completed()
    })
  }
}
