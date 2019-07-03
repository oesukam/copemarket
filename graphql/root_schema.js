const {
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID
} = require('graphql')
const {
  UserTypes,
  CityTypes,
  ProvinceTypes,
  ProductTypes,
  PhoneTypes,
  CategoryTypes
} = require('./types')
const {
  cities,
  provinces,
  users,
  phones,
  categories,
  products
} = require('./controllers')
const { makeExecutableSchema } = require('graphql-tools');
const { directiveResolvers, attachDirectives } = require('./directives');
const { checkAuthAndResolve, checkScopesAndResolve } = require('./resolvers');

const typeDefs = `
  directive @isAuthenticated on QUERY | FIELD
  directive @hasScope(scope: [String]) on QUERY | FIELD
  ${CategoryTypes}
  ${ProvinceTypes}
  ${CityTypes}
  ${UserTypes}
  ${ProductTypes}
  type Query {
    category(id: String): Category
    categories: Categories
    categoriesList: [CategoriesList]
    province(id: String): Province
    provinces: Provinces
    city(id: String): City
    cities: Cities
    user(phone: String): User
    users: Users
    product(id: String): Product
    products: Products
  }
  type Mutation {
    loginWithPhoneAndPassword(phone: String! password: String!): UserLogin
  }
`;

const resolvers = {
  Query: {
    province: (_, args, context) => {
      return checkAuthAndResolve(context, provinces.getById, args)
    },
    provinces: (_, args, context) => {
      return provinces.getAll(args)
    },
    city: (parent, args, context) => {
      console.log(parent, 'oooo')
      return checkAuthAndResolve(context, cities.getById,  { _city: parent._city, ...args })
    },
    cities: (_, args, context) => {
      return cities.getAll(args)
    },
    category: (_, args, context) => {
      return checkAuthAndResolve(context, categories.getById, args)
    },
    categories: (_, args, context) => {
      return categories.getAll(args)
    },
    categoriesList: (_, args, context) => {
      return categories.getAllList(args)
    },
    user: (parent, args, context) => {
      return checkAuthAndResolve(context, users.getById, args)
    },
    users: (_, args, context) => {
      return users.getAll(args)
    },
    product: (parent, args, context) => {
      return checkAuthAndResolve(context, products.getById, args)
    },
    products: (parent, args, context) => {
      console.log('yeah llll')
      return products.getAll(args)
    }
  },
  Mutation: {
    loginWithPhoneAndPassword: (_, inputs, context) => {
      return checkAuthAndResolve(context, users.loginWithPhoneAndPassword, inputs);
    }
  },
  User: {
    city(user) {
      if (parent.city) {
        return parent.city
      }
      return cities.getById({id: parent._city})
    },
    province(parent) {
      if (parent.province) {
        return parent.province
      }
      return provinces.getById({id: parent._province})
    }
  },
  City: {
    province(parent) {
      if (parent.province) {
        return parent.province
      }
      return provinces.getById({id: parent._province})
    }
  },
  Product: {
    city(parent) {
      if (parent.city) {
        return parent.city
      }
      return cities.getById({id: parent._city})
    },
    province(parent) {
      if (parent.province) {
        return parent.province
      }
      return provinces.getById({id: parent._province})
    }
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

attachDirectives(schema);

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    phone: {
      type: PhoneTypes.Phone,
      args: {
        phone: { type: new GraphQLNonNull(GraphQLString) },
        code: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return phones.getByPhoneCode(args.phone)
      }
    },
    user: {
      type: UserTypes.User,
      args: {
        id: { type: GraphQLString },
        phone: { type: GraphQLString }
      },
      resolve(parent, args) {
        return users.getById(args)
      }
    },
    users: {
      type: UserTypes.Users,
      args: { limit: { type: GraphQLInt }, page: { type: GraphQLInt }},
      resolve (parent, args){
        return users.getAll(args)
      }
    },
    category: {
      type: CategoryTypes.Category,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return categories.getById(args.id)
      }
    },
    categories: {
      type: CategoryTypes.Categories,
      args: { limit: { type: GraphQLInt }, page: { type: GraphQLInt }},
      resolve (parent, args){
        return categories.getAll(args)
      }
    },
    province: {
      type: ProvinceTypes.Province,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve (parent, args){
        return provinces.getById(args.id)
      }
    },
    provinces: {
      type: ProvinceTypes.Provinces,
      args: { limit: { type: GraphQLInt }, page: { type: GraphQLInt }},
      resolve (parent, args){
        return provinces.getAll(args)
      }
    },
    city: {
      type: CityTypes.City,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve (parent, args){
        return cities.getById(args.id)
      }
    },
    cities: {
      type: CityTypes.Cities,
      args: { limit: { type: GraphQLInt }, page: { type: GraphQLInt }},
      resolve(parent, args) {
        return cities.getAll(args)
      }
    }
  }
})



const mutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    verifyPhone: {
      type: PhoneTypes.Phone,
      args: {
        phone: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return phones.create(args)
      }
    },
    addUser: {
      type: UserTypes.User,
      args: {
        phone: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        middleName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        gender: { type: new GraphQLNonNull(GraphQLString) },
        _city: { type: new GraphQLNonNull(GraphQLString) },
        _province: { type: new GraphQLNonNull(GraphQLString) },
        birthDate: { type: GraphQLString },
      },
      resolve(parent, args) {
        return users.create(args)
      }
    }
  }
});

// const schema = new GraphQLSchema({
//   mutation,
//   query: RootQuery
// })

module.exports = schema
