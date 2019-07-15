const dbConfig = require('../knexfile')
const connection = require('knex')(dbConfig)

module.exports = connection