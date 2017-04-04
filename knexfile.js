// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: 'yala_netlob_development',
      user:     'root',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
