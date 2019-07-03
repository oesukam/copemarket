const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt
} = require('graphql')
const Province = new GraphQLObjectType({
  name: 'Province',
  fields: {
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  }
})

const Provinces = new GraphQLObjectType({
  name: 'Provinces',
  fields: {
    limit: { type: GraphQLInt },
    page: { type: GraphQLInt },
    pages: { type: GraphQLInt },
    total: { type: GraphQLInt },
    data: {
      type: GraphQLList(Province)
    }
  }
})

const typeDef = `
  type Province {
    _id: ID
    name: String
    description: String
    createdAt: String
    updatedAt: String
  }
  type Provinces {
    limit: Int,
    page: Int,
    pages: Int,
    total: Int,
    data:  [Province]
  }
`
module.exports = typeDef
