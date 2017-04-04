var faker = require('faker');
var count = 1;

let createRecord = (knex, id) => {
  return knex('users').insert({
    user_id: count++,
    user_name: faker.internet.userName(),
    email: faker.internet.exampleEmail(),
    password: "whatever"
  })
}

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      // Inserts seed entries
      let records = [];

      for (let i = 1; i < 10; i++) {
        records.push(createRecord(knex, i))
      }

      return Promise.all(records);
    });
};