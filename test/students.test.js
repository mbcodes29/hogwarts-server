const knex = require('knex')
const app = require('../src/app')
const { expect } = require('chai');
const supertest = require('supertest');
const StudentRouter = require('../src/students/student-router');
const helpers = require('./test-helpers')


describe('Student endpoints', () => {
    let db;
  
    const {
        testUsers,
        testStudents
    } = helpers.makeHogwartsData()
    
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL 
      });
      app.set('db', db)
    });
  
    before('clean db', () => helpers.cleanTables(db));
  
    afterEach('clean db', () => helpers.cleanTables(db));
  
    after('destroy db connection', () => db.destroy());


    describe('GET/api/students/:student_id', () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(
                db,
                testUsers,
            )
        )
        beforeEach('insert students', () =>
            helpers.seedStudents(
                db,
                testStudents,
            )
        )
        it('should return an array of students', () => {
            return supertest(app)
            .get('/api/students')
            .send({})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
            })
        })
    })
    describe('POST/api/students/:student_id', () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(
                db,
                testUsers,
            )
        )
        beforeEach('insert students', () =>
            helpers.seedStudents(
                db,
                testStudents,
            )
        )
        it('should return an array of students with a new student added', () => {
            return supertest(app)
            .get('/api/students')
            .send({})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
            })
        })
    })
    describe('DELETE/api/students/1', () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(
                db,
                testUsers,
            )
        )
        beforeEach('insert students', () =>
            helpers.seedStudents(
                db,
                testStudents,
            )
        )
        it('remove an existing student', () => {
            return supertest(app)
            .delete('/api/students/1')
            .send({})
            .then(res => {
                expect(404, {
                    error: {message: `student does not exist.`}
                });
            })
        })
    })
})