const request = require('supertest')
const faker = require('faker')
const app = require('../../app')
const url = '/api/v1/categories/'
let id = ''

const postData = {
  type: 'events',
  thumbnail: faker.image.imageUrl(),
  name: faker.lorem.words(),
  nameCn: faker.lorem.words(),
  description: faker.lorem.sentence(),
  descriptionCn: faker.lorem.sentence()
}

describe('Testing categories routes', () => {
  test(`POST ${url}`, async () => {
    const res = await request(app)
      .post(url)
      .send(postData)
    id = res.body.category._id
    expect(res.statusCode).toBe(200)
  })

  test(`GET ALL ${url}`, async () => {
    const response = await request(app).get(url)
    expect(response.statusCode).toBe(200)
    expect(response.body.categories).toBeInstanceOf(Array)
  })

  test(`GET ${url}`, async () => {
    const response = await request(app).get(url + id)
    expect(response.statusCode).toBe(200)
  })
  test(`UPDATE ${url}`, async () => {
    const response = await request(app)
      .put(url + id)
      .send(postData)
    expect(response.statusCode).toBe(200)
  })
  test(`DELETE ${url}`, async () => {
    const response = await request(app).get(url + id)
    expect(response.statusCode).toBe(200)
  })
})
