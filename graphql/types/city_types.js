const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt
} = require('graphql')
const ProvinceTypes = require('./province_types')
const { provinces, cities } = require('../controllers')
const City = new GraphQLObjectType({
  name: 'City',
  fields: {
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    _province: { type: GraphQLString },
    province: {
      type: ProvinceTypes.Province,
      resolve (parent, args) {
        return provinces.getById(parent._province)
      }
    },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  }
})

const Cities = new GraphQLObjectType({
  name: 'Cities',
  fields: {
    limit: { type: GraphQLInt },
    page: { type: GraphQLInt },
    pages: { type: GraphQLInt },
    total: { type: GraphQLInt },
    data: {
      type: GraphQLList(City)
    }
  }
})

const typeDef = `
  type City {
    _id: ID
    _province: String
    name: String
    province: Province
  }
  type Cities {
    limit: Int,
    page: Int,
    pages: Int,
    total: Int,
    data:  [City]
  }
`

module.exports = typeDef
