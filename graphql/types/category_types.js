const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt
} = require('graphql')
const ProvinceTypes = require('./province_types')
const { categories } = require('../controllers')
const Category = new GraphQLObjectType({
  name: 'Category',
  fields: {
    _id: { type: GraphQLString },
    icon: { type: GraphQLString },
    poster: { type: GraphQLString },
    name: { type: GraphQLString },
    _parent: { type: GraphQLString },
    parent: {
      type: new GraphQLObjectType({
        name: 'SubCategory',
        fields: {
          _id: { type: GraphQLString },
          icon: { type: GraphQLString },
          poster: { type: GraphQLString },
          name: { type: GraphQLString },
          _parent: { type: GraphQLString }
        }
      }),
      resolve (parent, args) {
        return categories.getById(parent._parent)
      }
    },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  }
})

const Categories = new GraphQLObjectType({
  name: 'Categories',
  fields: {
    limit: { type: GraphQLInt },
    page: { type: GraphQLInt },
    pages: { type: GraphQLInt },
    total: { type: GraphQLInt },
    data: {
      type: GraphQLList(Category)
    }
  }
})


const typeDef = `
  type Category {
    _id: ID
    _parent: String
    icon: String
    poster: String
    name: String
  }
  type Categories {
    limit: Int,
    page: Int,
    pages: Int,
    total: Int,
    data:  [Category]
  }
  type CategoriesList {
    _id: ID
    _parent: String
    icon: String
    poster: String
    name: String
    subs: [Category]
  }
`

module.exports = typeDef
