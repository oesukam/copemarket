const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt
} = require('graphql')
const ProvinceTypes = require('./province_types')
const CityTypes = require('./city_types')
const { provinces, cities, users } = require('../controllers')

const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    _city: { type: GraphQLString },
    _province: { type: GraphQLString },
    avatar: { type: GraphQLString },
    phone: { type: GraphQLString },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    middleName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    birthDate: { type: GraphQLString },
    gender: { type: GraphQLString },
    province: {
      type: ProvinceTypes.Province,
      resolve (parent, args) {
        return provinces.getById(parent._province)
      }
    },
    city: {
      type: CityTypes.City,
      resolve (parent, args) {
        return cities.getById(parent._city)
      }
    },
    token: { type: GraphQLString }
  }
})

const Users = new GraphQLObjectType({
  name: 'Users',
  fields: {
    limit: { type: GraphQLInt },
    page: { type: GraphQLInt },
    pages: { type: GraphQLInt },
    total: { type: GraphQLInt },
    data: {
      type: GraphQLList(User)
    }
  }
})

const typeDef = `
  type User {
    _id: ID
    _province: String
    _city: String
    phone: String
    avatar: String
    firstName: String
    lastName: String
    middleName: String
    gender: String
    birthDay: String
    token: String
    province: Province
    city: City
  }
  type Users {
    limit: Int,
    page: Int,
    pages: Int,
    total: Int,
    data:  [User]
  }
  type UserLogin {
    token: String
    user: User
  }
`

module.exports = typeDef
