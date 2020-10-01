const app = require('../src/app')
const { expect } = require('chai');
const supertest = require('supertest');
const knex = require('knex');
const UserRouter = require('../src/users/users-router');
const StudentService = require('../src/students/student-service');
const helpers = require('./test-helpers')

describe('Students service object', () => {
  let db;

  const {
    testUsers,
    testStudents,
  } = helpers.makeArticlesFixtures();

  before('setup db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL || 'postgresql://hogwarts@localhost/headmaster-test4'
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('getAllStudents()', () => {
    it('returns an empty array', () => {
      return StudentService
        .getAllStudents(db)
        .then(students => expect(students).to.eql([]));
    });
    context('with data present', () => {
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
      it('returns all test students', () => {
        return StudentService
          .getAllStudents(db)
          .then(students => expect(students).to.eql(testStudents));
      });
    });
  });

  describe('insertStudent()' , () => {
    beforeEach('insert users', () =>
      helpers.seedUsers(
        db,
        testUsers,
      )
    )
    it('inserts record in db and returns student with new id', () => {
      const newStudent = {
        id: 5,
        pronouns: 'She/Her',
        pet: 'Owl',
        wandtype: 'Ash',
        wandcore: 'Dragon',
        favoritesubject: 'Flying',
        house: 'Gryffindor',
        user_id: 1
      };

      return StudentService.insertStudent(db, newStudent)
        .then(actual => {
          expect(actual).to.eql({
            id: 5,
            pronouns: 'She/Her',
            pet: 'Owl',
            wandtype: 'Ash',
            wandcore: 'Dragon',
            favoritesubject: 'Flying',
            house: 'Gryffindor',
            user_id: 1
          });
        });
    });


    it('throws not-null constraint error if pet not provided', () => {      
      const newStudent = {
        id: 1,
        pronouns: 'She/Her',
        wandtype: 'Alder',
        wandcore: 'Phoenix',
        favoritesubject: 'Astronomy',
        house: 'Gryffindor',
        user_id: 1
      };


      return StudentService 
        .insertStudent(db, newStudent)
        .then(
          () => expect.fail('db should throw error'),
          err => expect(err.message).to.include('not-null')
        );
    });
  });

  describe('getById()', () => {
    it('should return undefined', () => {
      return StudentService
        .getById(db, 999)
        .then(student => expect(student).to.be.undefined);
    });

    context('with data present', () => {
      before('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers,
        )
      )
      before('insert students', () =>
        helpers.seedStudents(
          db,
          testStudents,
        )
      )

      it('should return existing student', () => {
        const expectedStudentId = 3;
        const expectedStudent = testStudents.find(a => a.id === expectedStudentId);
        return StudentService.getById(db, expectedStudentId)
          .then(actual => expect(actual).to.eql(expectedStudent));
      });
    });
  });

  describe('deleteStudent()', () => {
    it('should return 0 rows affected', () => {
      return StudentService
        .deleteStudent(db, 999)
        .then(rowsAffected => expect(rowsAffected).to.eq(0));
    });

    context('with data present', () => {
      before('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers,
        )
      )
      before('insert students', () =>
        helpers.seedStudents(
          db,
          testStudents,
        )
      )

      it('should return 1 row affected and record is removed from db', () => {
        const deletedStudentId = 1;

        return StudentService
          .deleteStudent(db, deletedStudentId)
          .then(rowsAffected => {
            expect(rowsAffected).to.eq(1);
            return db('students').select('*');
          })
          .then(actual => {
            const expected = testStudents.filter(a => a.id !== deletedStudentId);
            expect(actual).to.eql(expected);
          });
      });
    });
  });
});