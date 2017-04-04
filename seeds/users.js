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

// exports.seed = function(knex, Promise) {
//   // Deletes ALL existing entries
//   return knex('users').del()
//     .then(function () {
//       // Inserts seed entries
//       return knex('table_name').insert([
//         {id: 1, colName: 'rowValue1'},
//         {id: 2, colName: 'rowValue2'},
//         {id: 3, colName: 'rowValue3'}
//       ]);
//     });
// };

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