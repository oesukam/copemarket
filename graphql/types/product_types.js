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
const { provinces } = require('../controllers')
const Product = new GraphQLObjectType({
  name: 'Product',
  fields: {
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    _city: { type: GraphQLString },
    _province: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    province: {
      type: ProvinceTypes.Province,
      resolve (parent, args) {
        return provinces.getById(parent._province)
      }
    },
    city: {
      type: CityTypes.City,
      resolve (parent, args) {
        return provinces.getById(parent._city)
      }
    },
  }
})

const Products = new GraphQLObjectType({
  name: 'Products',
  fields: {
    limit: { type: GraphQLInt },
    page: { type: GraphQLInt },
    pages: { type: GraphQLInt },
    total: { type: GraphQLInt },
    data: {
      type: GraphQLList(Product)
    }
  }
})


const typeDef = `
  type Product {
    _id: ID
    _user: String
    _city: String
    _province: String
    _category: String
    _type: String
    poster: String
    title: String
    description: String
    city: City
    currency: String
    price: String
    province: Province
    user: User
    category: Category
    type: Category
  }
  type Products {
    limit: Int,
    page: Int,
    pages: Int,
    total: Int,
    data:  [Product]
  }
`

module.exports = typeDef
