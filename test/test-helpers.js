const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      password: 'password',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      password: 'password',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      password: 'password',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      password: 'password',
    },
  ]
}

function makeStudentsArray() {
  return [
    {
      id: 1,
      pronouns: 'She/Her',
      pet: 'Owl',
      wandtype: 'Ash',
      wandcore: 'Dragon',
      favoritesubject: 'Flying',
      house: 'Gryffindor',
      user_id: 1
    },
    {
      id: 2,
      pronouns: 'He/Him',
      pet: 'Cat',
      wandtype: 'Birch',
      wandcore: 'Unicorn',
      favoritesubject: 'Herbology',
      house: 'Slytherin',
      user_id: 1
    },
    {
      id: 3,
      pronouns: 'They/Them',
      pet: 'Toad',
      wandtype: 'Alder',
      wandcore: 'Phoenix',
      favoritesubject: 'Astronomy',
      house: 'Ravenclaw',
      user_id: 1
    },
  ];
}

function makeHogwartsData() {
  const testUsers = makeUsersArray()
  const testStudents = makeStudentsArray()
  return { testUsers, testStudents }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        students,
        users
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE students_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('users_id_seq', 0)`),
        trx.raw(`SELECT setval('students_id_seq', 0)`),
      ])
    )
  )
}

function cleanStudentTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        students
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE students_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('students_id_seq', 0)`),
      ])
    )
  )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
    .then(() =>
      db.raw(
        `SELECT setval('users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedStudents(db, students) {
  const preppedStudents = students.map(student => ({
    ...student
  }))
  return db.into('students').insert(preppedStudents)
    .then(() =>
      db.raw(
        `SELECT setval('students_id_seq', ?)`,
        [students[students.length - 1].id],
      )
    )
}

module.exports = {
  makeUsersArray,
  makeStudentsArray,
  makeHogwartsData,
  cleanTables,
  cleanStudentTables,
  makeAuthHeader,
  seedUsers,
  seedStudents
}