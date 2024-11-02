// import {req} from "./../helpers"
// import { setDB } from '../../src/db/db'
// import {dataset1} from "./../mockData"
// import { PostInputModel } from "../../src/models/PostInputModel"
// import { fromUTF8ToBase64 } from "../../src/global/middlewares/adminMiddleware"
// import { SETTINGS } from "../../src/settings"

// describe('GET /posts controller tests', () => {

//     it('should return an empty array when the database is empty', async () => {
//         setDB()
//         const response = await req.get('/posts')
//         expect(response.status).toBe(200)
//         expect(response.body).toEqual([])
//     })

//     it('should return a non-empty array when the database is not empty', async () => {
//         setDB(dataset1)
//         const response = await req.get('/posts')
//         expect(response.status).toBe(200)
//         expect(response.body.length).toBe(3)
//         expect(response.body[0]).toEqual(dataset1.posts[0])
//     })

// })

// describe('GET /posts/:id controller tests', () => {

//     beforeEach(() => {
//         setDB(dataset1)
//     })

//     it('should return a post by id', async () => {
//         const response = await req.get('/posts/2')
//         expect(response.status).toBe(200)
//         expect(response.body).toEqual(dataset1.posts[1])
//     })

//     it('should return 404 if post not found', async () => {
//         const response = await req.get('/posts/5')
//         expect(response.status).toBe(404)
//         expect(response.body).toEqual({ errorsMessages: [{ message: 'Post not found', field: 'id' }] })
//     })

// })

// describe('POST /posts controller tests', () => {
//     beforeEach(() => {
//         setDB()
//     })

//     it('should return 401 error if user is not authorized', async () => {
//       const postInputData: PostInputModel = {
//         title: "New post",
//         content: "Content for the New post",
//         shortDescription: "Short description for the New post",
//         blogId: "1",
//       }
//       const response = await req.post('/posts').send(postInputData)
//       expect(response.status).toBe(401)
//   })

//     it('should successfully create a post with valid input', async () => {
//         setDB(dataset1)
//         const postInputData: PostInputModel = {
//           title: "New post",
//           content: "Content for the New post",
//           shortDescription: "Short description for the New post",
//           blogId: "1",
//         }
//         const response = await req.post('/posts').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(postInputData)
//         expect(response.status).toBe(201)
//         expect(response.body).toHaveProperty('id')
//         expect(response.body.title).toBe(postInputData.title)

//         const getResponse = await req.get('/posts')
//         expect(getResponse.status).toBe(200)
//         expect(getResponse.body.length).toBe(4)
//         expect(getResponse.body[3].shortDescription).toBe(postInputData.shortDescription)
//     })

//     it('should return 400 with error messages for missed title', async () => {
//       const invalidInputData: PostInputModel = {
//         title: "",
//         content: "Content for the New post",
//         shortDescription: "Short description for the New post",
//         blogId: "1",
//       }
//         const response = await req.post('/posts').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(invalidInputData)
//         expect(response.status).toBe(400)
//         expect(response.body.errorsMessages[0].field).toBe('title')
//         expect(response.body.errorsMessages[0].message).toBe('Title must be between 1 and 30 characters')
//     })

//     it('should return 400 with error messages for invalid content', async () => {
//       const invalidInputData: PostInputModel = {
//         title: "New post",
//         content: "",
//         shortDescription: "Short description for the New post",
//         blogId: "1",
//       }
//         const response = await req.post('/posts').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(invalidInputData)
//         expect(response.status).toBe(400)
//         expect(response.body.errorsMessages[0].field).toBe('content')
//         expect(response.body.errorsMessages[0].message).toBe('Content must be between 1 and 1000 characters')
//     })

//     it('should return 400 with error messages for invalid short description', async () => {
//       const invalidInputData: PostInputModel = {
//         title: "New post",
//         content: "Content for the New post",
//         //@ts-ignore
//         shortDescription: 1,
//         blogId: "1",
//       }
//         const response = await req.post('/posts').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(invalidInputData)
//         expect(response.status).toBe(400)
//         expect(response.body.errorsMessages[0].field).toBe('shortDescription')
//         expect(response.body.errorsMessages[0].message).toBe('Short description must be a string')
//     })

//     it('should return 400 with error messages for invalid URL', async () => {
//       const invalidInputData: PostInputModel = {
//         title: "New post",
//         content: "Content for the New post",
//         shortDescription: "Short description for the New post",
//         blogId: "",
//       }
//         const response = await req.post('/posts').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(invalidInputData)
//         expect(response.status).toBe(400)
//         expect(response.body.errorsMessages[0].field).toBe('blogId')
//         expect(response.body.errorsMessages[0].message).toBe('Blog ID is required')
//     })

// })


// describe('PUT /posts controller tests', () => {
//   beforeEach(() => {
//       setDB(dataset1)
//   })

//   it('should return 401 error if user is not authorized', async () => {
//     const postInputData: PostInputModel = {
//       title: "New post",
//       content: "Content for the New post",
//       shortDescription: "Short description for the New post",
//       blogId: "1",
//     }
//     const response = await req.put('/posts/1').send(postInputData)
//     expect(response.status).toBe(401)
// })

//   it('should successfully update a post with valid input', async () => {
//     const postInputData: PostInputModel = {
//       title: "New post",
//       content: "Content for the New post",
//       shortDescription: "Short description for the New post",
//       blogId: "1",
//     }
//       const response = await req.put('/posts/1').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(postInputData)
//       expect(response.status).toBe(204)

//       const getResponse = await req.get('/posts')
//       expect(getResponse.status).toBe(200)
//       expect(getResponse.body[0].content).toBe(postInputData.content)
//   })

//   it('should return 404 error if post to update was not found', async () => {
//     const postInputData: PostInputModel = {
//       title: "New post",
//       content: "Content for the New post",
//       shortDescription: "Short description for the New post",
//       blogId: "1",
//     }
//     const response = await req.put('/posts/8').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(postInputData)
//     expect(response.status).toBe(404)
//     expect(response.body).toEqual({ errorsMessages: [{ message: 'Post not found', field: 'id' }] })
// })

// it('should return 400 with error messages for missed title', async () => {
//   const invalidInputData: PostInputModel = {
//     title: "",
//     content: "Content for the New post",
//     shortDescription: "Short description for the New post",
//     blogId: "1",
//   }
//     const response = await req.put('/posts/2').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(invalidInputData)
//     expect(response.status).toBe(400)
//     expect(response.body.errorsMessages[0].field).toBe('title')
//     expect(response.body.errorsMessages[0].message).toBe('Title must be between 1 and 30 characters')
// })

// it('should return 400 with error messages for invalid content', async () => {
//   const invalidInputData: PostInputModel = {
//     title: "New post",
//     content: "",
//     shortDescription: "Short description for the New post",
//     blogId: "1",
//   }
//     const response = await req.put('/posts/2').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(invalidInputData)
//     expect(response.status).toBe(400)
//     expect(response.body.errorsMessages[0].field).toBe('content')
//     expect(response.body.errorsMessages[0].message).toBe('Content must be between 1 and 1000 characters')
// })

// it('should return 400 with error messages for invalid short description', async () => {
//   const invalidInputData: PostInputModel = {
//     title: "New post",
//     content: "Content for the New post",
//     //@ts-ignore
//     shortDescription: 1,
//     blogId: "1",
//   }
//     const response = await req.put('/posts/2').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(invalidInputData)
//     expect(response.status).toBe(400)
//     expect(response.body.errorsMessages[0].field).toBe('shortDescription')
//     expect(response.body.errorsMessages[0].message).toBe('Short description must be a string')
// })

// it('should return 400 with error messages for invalid URL', async () => {
//   const invalidInputData: PostInputModel = {
//     title: "New post",
//     content: "Content for the New post",
//     shortDescription: "Short description for the New post",
//     blogId: "",
//   }
//     const response = await req.put('/posts/2').set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`).send(invalidInputData)
//     expect(response.status).toBe(400)
//     expect(response.body.errorsMessages[0].field).toBe('blogId')
//     expect(response.body.errorsMessages[0].message).toBe('Blog ID is required')
// })

// })


// describe('DELETE /posts/:id controller tests', () => {
//   beforeEach(() => {
//       setDB(dataset1)
//   })

//   it('should return 401 error if user is not authorized', async () => {
//     const response = await req.delete('/posts/1')
//     expect(response.status).toBe(401)
// })

//   it('should successfully delete an existing post', async () => {
//       const deleteResponse = await req.delete(`/posts/2`).set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`)
//       expect(deleteResponse.status).toBe(204)

//       const getResponse = await req.get(`/posts/2`)
//       expect(getResponse.status).toBe(404)
//   })

//   it('should return 404 if post not found', async () => {
//       const response = await req.delete(`/posts/8`).set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`)
//       expect(response.status).toBe(404)
//       expect(response.body).toEqual({ errorsMessages: [{ message: 'Post not found', field: 'id' }] })
//   })

//   it('should ensure the video is deleted from the database', async () => {
//       await req.delete(`/videos/3`).set('Authorization', `Basic ${fromUTF8ToBase64(SETTINGS.ADMIN)}`)
      
//       const getResponse = await req.get('/posts')
//       expect(getResponse.body).not.toContainEqual(expect.objectContaining({ id: 3 }))
//   })
// })
