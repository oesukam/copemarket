var jwt = require('jsonwebtoken')
const { signEmailToken } = require('../../utils/authorizationTools')
const { mapMongooseErrors } = require('../../utils/formatErrors')
const { JWT_SECRET } = require('../../config/mocks')
const request = require('supertest')
const faker = require('faker')
const app = require('../../app')
const { User } = require('../../models')
const url = '/api/v1/users/'
let id = ''

let userData = {
  account: faker.internet.email(),
  password: faker.internet.password()
}

//let userDataPost = { userData, account : faker.internet.email()}

describe('Testing users functions', () => {
  test('token', async () => {
    const token = signEmailToken(userData)
    const user = jwt.verify(token, JWT_SECRET)
    expect(user.sub).toBe(userData.account)
  })

  test('mongoose errors mapping', async () => {
    try {
      await User.create({ password: faker.internet.password() })
    } catch (error) {
      const { errFields } = mapMongooseErrors(error)
      expect(errFields.account).toBeDefined()
    }
  })
})

describe('Testing users routes', () => {
  test(`POST ${url}`, async () => {
    const res = await request(app)
      .post(url)
      .send(userData)
    id = res.body.user._id
    expect(res.statusCode).toBe(200)
  })

  test(`GET ALL ${url}`, async () => {
    const response = await request(app).get(url)
    expect(response.statusCode).toBe(200)
    expect(response.body.users.docs).toBeInstanceOf(Array)
  })

  test(`GET ${url}`, async () => {
    const response = await request(app).get(url + id)
    expect(response.statusCode).toBe(200)
  })
  test(`UPDATE ${url}`, async () => {
    const response = await request(app)
      .put(url + id)
      .send(userData)
    expect(response.statusCode).toBe(200)
  })
  test(`DELETE ${url}`, async () => {
    const response = await request(app).get(url + id)
    expect(response.statusCode).toBe(200)
  })
})
