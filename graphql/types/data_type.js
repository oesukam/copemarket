const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt
} = require('graphql')
const ProvinceType = require('./province_types')
const { provinces } = require('../controllers')
module.exports = new GraphQLObjectType({
  name: 'Data',
  fields: {
    page: { type: GraphQLString },
    limit: { type: GraphQLString },
    _province: { type: GraphQLString },
    province: {
      type: ProvinceType,
      resolve (parent, args) {
        return provinces.getById(parent._province)
      }
    },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  }
})
