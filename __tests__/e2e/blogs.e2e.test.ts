import { req } from "./../helpers"
import { setDB } from '../../src/db/db'
import { blog1, blog2, dataset1 } from "./../mockData"
import { BlogInputModel } from "../../src/models/BlogInputModel"
import { fromUTF8ToBase64 } from "../../src/global/middlewares/adminMiddleware"
import { SETTINGS } from "../../src/settings"
import { MongoMemoryServer } from "mongodb-memory-server"
import { Db, MongoClient } from "mongodb"

describe('BlogsController', () => {

  let mongoServer: MongoMemoryServer;
  let mongoClient: MongoClient;
  let db: Db;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    mongoClient = await MongoClient.connect(mongoUri);
    db = mongoClient.db();
    await db.collection('blogs').createIndex({ id: 1 }, { unique: true });
  });

  afterAll(async () => {
    await mongoClient.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    const blogsCollection = db.collection('blogs');
    await db.collection('blogs').deleteMany({});
  });

  describe('GET /blogs controller tests', () => {

    it('should return an empty array when the database is empty', async () => {
  
      const response = await req.get('/blogs')
      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })

    it('should return a non-empty array when the database is not empty', async () => {
      await db.collection('blogs').insertMany([
        blog1, blog2
       ]);
      const response = await req.get('/blogs')
      expect(response.status).toBe(200)
      expect(response.body.length).toBe(3)
      expect(response.body[0]).toEqual(dataset1.blogs[0])
    })

  })

  // describe('GET /blogs/:id controller tests', () => {

  //   beforeEach(() => {
  //     setDB(dataset1)
  //   })

  //   it('should return a blog by id', async () => {
  //     const response = await req.get('/blogs/2')
  //     expect(response.status).toBe(200)
  //     expect(response.body).toEqual(dataset1.blogs[1])
  //   })

  //   it('should return 404 if blog not found', async () => {
  //     const response = await req.get('/blogs/5')
  //     expect(response.status).toBe(404)
  //     expect(response.body).toEqual({ errorsMessages: [{ message: 'Blog not found', field: 'id' }] })
  //   })

  // })

  // describe('POST /blogs controller tests', () => {
  //   beforeEach(() => {
  //     setDB()
  //   })

  //   it('should return 401 error if user is not authorized', async () => {
  //     const inputData: BlogInputModel = {
  //       name: "Blog",
  //       description: "Description for the New Blog",
  //       websiteUrl: "https://www.newblog.com",
  //     }
  //     const response = await req.post('/blogs').send(inputData)
  //     expect(response.status).toBe(401)
  //   })

  //   it('should successfully create a blog with valid input', async () => {
  //     const blogInputData: BlogInputModel = {
  //       name: "New Blog",
  //       description: "Description for the New Blog",
  //       websiteUrl: "https://www.newblog.com",
  //     }
  //     const response = await req.post('/blogs').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(blogInputData)
  //     expect(response.status).toBe(201)
  //     expect(response.body).toHaveProperty('id')
  //     expect(response.body.name).toBe(blogInputData.name)

  //     const getResponse = await req.get('/blogs')
  //     expect(getResponse.status).toBe(200)
  //     expect(getResponse.body.length).toBe(1)
  //     expect(getResponse.body[0].description).toBe(blogInputData.description)
  //   })

  //   it('should return 400 with error messages for missed name', async () => {
  //     const invalidInputData: BlogInputModel = {
  //       name: "",
  //       description: "Description for the New Blog",
  //       websiteUrl: "https://www.newblog.com",
  //     }
  //     const response = await req.post('/blogs').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(invalidInputData)
  //     expect(response.status).toBe(400)
  //     expect(response.body.errorsMessages[0].field).toBe('name')
  //     expect(response.body.errorsMessages[0].message).toBe('Name must be between 1 and 15 characters')
  //   })

  //   it('should return 400 with error messages for invalid description', async () => {
  //     const invalidInputData: BlogInputModel = {
  //       name: "New Blog",
  //       description: "   ",
  //       websiteUrl: "https://www.newblog.com",
  //     }
  //     const response = await req.post('/blogs').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(invalidInputData)
  //     expect(response.status).toBe(400)
  //     expect(response.body.errorsMessages[0].field).toBe('description')
  //     expect(response.body.errorsMessages[0].message).toBe('Description must be between 1 and 500 characters')
  //   })

  //   it('should return 400 with error messages for invalid URL', async () => {
  //     const invalidInputData: BlogInputModel = {
  //       name: "New Blog",
  //       description: "Description for the New Blog",
  //       websiteUrl: "www.newblog.com",
  //     }
  //     const response = await req.post('/blogs').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(invalidInputData)
  //     expect(response.status).toBe(400)
  //     expect(response.body.errorsMessages[0].field).toBe('websiteUrl')
  //     expect(response.body.errorsMessages[0].message).toBe('Invalid URL format')
  //   })

  // })


  // describe('PUT /blogs controller tests', () => {
  //   beforeEach(() => {
  //     setDB(dataset1)
  //   })

  //   it('should return 401 error if user is not authorized', async () => {
  //     const inputData: BlogInputModel = {
  //       name: "Blog",
  //       description: "Description for the New Blog",
  //       websiteUrl: "https://www.newblog.com",
  //     }
  //     const response = await req.put('/blogs/1').send(inputData)
  //     expect(response.status).toBe(401)
  //   })

  //   it('should successfully update a blog with valid input', async () => {
  //     const blogInputData: BlogInputModel = {
  //       name: "New Blog",
  //       description: "Description for the New Blog",
  //       websiteUrl: "https://www.newblog.com",
  //     }
  //     const response = await req.put('/blogs/1').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(blogInputData)
  //     expect(response.status).toBe(204)

  //     const getResponse = await req.get('/blogs')
  //     expect(getResponse.status).toBe(200)
  //     expect(getResponse.body[0].description).toBe(blogInputData.description)
  //   })


  //   it('should return 404 error if blog to update was not found', async () => {
  //     const blogInputData: BlogInputModel = {
  //       name: "New post",
  //       description: "Description for the New post",
  //       websiteUrl: "https://www.newpost.com",
  //     }
  //     const response = await req.put('/blogs/9').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(blogInputData)
  //     expect(response.status).toBe(404)
  //     expect(response.body).toEqual({ errorsMessages: [{ message: 'Blog not found', field: 'id' }] })
  //   })

  //   it('should return 400 with error messages for missed name', async () => {
  //     const invalidInputData: BlogInputModel = {
  //       name: "",
  //       description: "Description for the New Blog",
  //       websiteUrl: "https://www.newblog.com",
  //     }
  //     const response = await req.put('/blogs/s1').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(invalidInputData)
  //     expect(response.status).toBe(400)
  //     expect(response.body.errorsMessages[0].field).toBe('name')
  //     expect(response.body.errorsMessages[0].message).toBe('Name must be between 1 and 15 characters')
  //   })

  //   it('should return 400 with error messages for invalid description', async () => {
  //     const invalidInputData: BlogInputModel = {
  //       name: "New Blog",
  //       description: "   ",
  //       websiteUrl: "https://www.newblog.com",
  //     }
  //     const response = await req.put('/blogs/1').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(invalidInputData)
  //     expect(response.status).toBe(400)
  //     expect(response.body.errorsMessages[0].field).toBe('description')
  //     expect(response.body.errorsMessages[0].message).toBe('Description must be between 1 and 500 characters')
  //   })

  //   it('should return 400 with error messages for invalid URL', async () => {
  //     const invalidInputData: BlogInputModel = {
  //       name: "New Blog",
  //       description: "Description for the New Blog",
  //       websiteUrl: "www.newblog.com",
  //     }
  //     const response = await req.put('/blogs/1').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(invalidInputData)
  //     expect(response.status).toBe(400)
  //     expect(response.body.errorsMessages[0].field).toBe('websiteUrl')
  //     expect(response.body.errorsMessages[0].message).toBe('Invalid URL format')
  //   })

  // })


  // describe('DELETE /blogs/:id controller tests', () => {
  //   beforeEach(() => {
  //     setDB(dataset1)
  //   })

  //   it('should return 401 error if user is not authorized', async () => {
  //     const response = await req.delete('/blogs/1')
  //     expect(response.status).toBe(401)
  //   })

  //   it('should successfully delete an existing blog', async () => {
  //     const deleteResponse = await req.delete(`/blogs/2`).set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`)
  //     expect(deleteResponse.status).toBe(204)

  //     const getResponse = await req.get(`/blogs/2`)
  //     expect(getResponse.status).toBe(404)
  //   })

  //   it('should return 404 if blog not found', async () => {
  //     const response = await req.delete(`/blogs/8`).set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`)
  //     expect(response.status).toBe(404)
  //     expect(response.body).toEqual({ errorsMessages: [{ message: 'Blog not found', field: 'id' }] })
  //   })

  //   it('should ensure the video is deleted from the database', async () => {
  //     await req.delete(`/videos/3`).set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`)

  //     const getResponse = await req.get('/blogs')
  //     expect(getResponse.body).not.toContainEqual(expect.objectContaining({ id: 3 }))
  //   })
  // })

})