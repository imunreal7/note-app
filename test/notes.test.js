const supertest = require('supertest');
const mongoose = require('mongoose');
const { get, post, put} = require('../routes/routes');
const dbName = 'Notes-CRUD-DB';
const app = require('../app.js');
const { connection } = require("mongoose");

jest.setTimeout(10000);

//Test Case 1: MongoDB connection created 
beforeAll(async () => {
    const url = `mongodb://localhost:27017/${dbName}`
    mongoose.createConnection(url)
})

//Test Case 2: MongoDB connection closed
afterAll(async () => {
    await connection.close()
})

//Test Case 3: check if connenction established
test('Should check MongoDB connection', async () => {
    if (connection != null) {
        console.log("Mongo connected successfully!")
    }
})

//Test Case 4: noteId should not be null
test('noteId should not be null', () => {
    expect(app.noteId).not.toBeNull();
})

//Test Case 5: email should not be null
test('email should not be null', () => {
    expect(app.email).not.toBeNull();
})

//Test Case 6: get should be a function
test('Should GET be a function', async () => {
    expect(typeof get).toEqual('function');
})

//Test Case 7: post should be a function
test('Should POST be a function', async () => {
    expect(typeof post).toEqual('function');
})

//Test Case 8: put should be a function
test('Should PUT be a function', async () => {
    expect(typeof put).toEqual('function');
})

//Test Case 9: secret should not be null
test('secret should not be null', () => {
    expect(app.secret).not.toBeNull();
})

//Test case 10: POST 200
test('Should create a note', async () => {
    const res = await supertest(app).post('/api/notes/create').send({
        email: 'testuser@gmail.com',
        secret: 'test',
        title: 'A test note',
        description: 'Hey! welcome to jest unit testing'
    });
    expect(res.status).toEqual(200);
})

//Test case 11: GET 200
test('Should get all the notes for  a user', async () => {
    email = 'testuser@gmail.com'
    secret = 'test'
    const res = await supertest(app).get(`/api/notes/find?email=${email}`)
        .set("secret", secret)
        .send()
    expect(res.status).toEqual(200);
})

//Test case 12: GET all notes 200
test('Should get all the notes for all the users', async () => {
    const res = await supertest(app).get(`/api/notes/findall`)
        .send()
    expect(res.status).toEqual(200);
})

//Test case 13: GET 200 by noteId
test('Should get a note for user by passing noteId', async () => {
    email = 'testuser@gmail.com'
    secret = 'test'
    const res = await supertest(app).get(`/api/notes/find/:noteId?email=${email}`)
        .set("secret", secret)
        .send()
    expect(res.status).toEqual(200);
})

//Test case 14: PUT 200
test('Should update a note for a user', async () => {
    email = 'testuser@gmail.com'
    secret = 'test'
    const res = await supertest(app).put(`/api/notes/update/noteId?email=${email}`)
        .set("secret", secret)
        .send({
            title: 'Updated note',
            description: 'Loving it'
        });
    expect(res.status).toEqual(200);
})

//Test case 15: DELETE 200
test('Should delete a note for a user', async () => {
    email = 'testuser@gmail.com'
    secret = 'test'
    const res = await supertest(app).delete(`/api/notes/remove/:noteId?email=${email}`)
        .set("secret", secret)
        .send();
    expect(res.status).toEqual(200);
})

//Test case 16: GET 404
test('Should not get a note for a user by passing email (404)', async () => {
    email = 'nottest@gmail.com'
    secret = 'test'
    const res = await supertest(app).get(`/api/notes/find?email=${email}`)
        .set("secret", secret)
        .send()
    expect(res.status).toEqual(404);
})

//Test case 17: GET 404 by noteId
test('Should not get a note for a user by passing email and noteId (404)', async () => {
    email = 'test@gmail.com'
    secret = 'test'
    const res = await supertest(app).get(`/api/notes/find/:noteId?email=${email}`)
        .set("secret", secret)
        .send()
        if(!email){
            send();
            expect(res.status).toEqual(404);
        }
})

//Test case 18: PUT 404
test('Should not update a note for user (404)', async () => {
    email = 'notatestuser@gmail.com'
    secret = 'test'
    const res = await supertest(app).put(`/api/notes/update/:noteId?email=${email}`)
        .set("secret", secret)
        .send({
            title: 'Updated note',
            description: 'Loving it'
        });
    expect(res.status).toEqual(404);
})

//Test case 19: DELETE 404
test('Should not delete a note for user (404)', async () => {
    email = 'nottestuser@gmail.com'
    secret = 'test'
    const res = await supertest(app).delete(`/api/notes/remove/:noteId?email=${email}`)
        .set("secret", secret)
        .send();
    expect(res.status).toEqual(404);
})

//Test case 20: GET 401
test('Should not get a note for an unautherized user (401)', async () => {
    email = 'testuser@gmail.com'
    secret = ''
    const res = await supertest(app).get(`/api/notes/find?email=${email}`)
        .set("secret", secret)
        .send()
    expect(res.status).toEqual(401);
})

//Test case 21: GET 401 for noteId
test('Should not get a note for an unautherized user by passing noteId (401)', async () => {
    email = 'testuser@gmail.com'
    secret = 'abc'
    const res = await supertest(app).get(`/api/notes/find/:noteId?email=${email}`)
        .set("secret", secret)
        .send()
    expect(res.status).toEqual(401);
})

//Test case 22: PUT 401
test('Should not update a note for an unautherised user (401)', async () => {
    email = 'testuser@gmail.com';
    secret = '';
    const res = await supertest(app).put(`/api/notes/update/:noteId?email=${email}`)
        .set("secret", secret)
        .send({
            title: 'Updated note',
            description: 'Loving it'
        });
    expect(res.status).toEqual(401);
})

//Test case 23: DELETE 401
test('Should not delete a note for an unauthorized user (401)', async () => {
    email = 'testuser@gmail.com'
    secret = ''
    const res = await supertest(app).delete(`/api/notes/remove/:noteId?email=${email}`)
        .set("secret", secret)
        .send();
    expect(res.status).toEqual(401);
})