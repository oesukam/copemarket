const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql')
const UserTypes = require('./user_types')
const { phones, users } = require('../controllers')
const Phone = new GraphQLObjectType({
  name: 'Phone',
  fields: {
    _id: { type: GraphQLString },
    phone: { type: GraphQLString },
    code: { type: GraphQLString },
    seconds: { type: GraphQLString },
    verified: { type: GraphQLBoolean },
    _user: { type: GraphQLString },
    user: {
      type: UserTypes.User,
      resolve (parent, args) {
        return users.getById(parent._user)
      }
    },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  }
})

const PhoneSMS = new GraphQLObjectType({
  name: 'PhoneSMS',
  fields: {
    _id: { type: GraphQLString },
    phone: { type: GraphQLString },
    code: { type: GraphQLString },
    seconds: { type: GraphQLString },
    verified: { type: GraphQLBoolean },
    _user: { type: GraphQLString },
    user: {
      type: UserTypes.User,
      resolve (parent, args) {
        return users.getById(parent._user)
      }
    },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  }
})

const Phones = new GraphQLObjectType({
  name: 'Phones',
  fields: {
    limit: { type: GraphQLInt },
    page: { type: GraphQLInt },
    pages: { type: GraphQLInt },
    total: { type: GraphQLInt },
    data: {
      type: GraphQLList(Phone)
    }
  }
})

module.exports = {
  Phone,
  Phones
}
