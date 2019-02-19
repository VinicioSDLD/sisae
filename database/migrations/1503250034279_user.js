'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('nome',120).notNullable().unique()
      table.date('dataNasc')
      table.string('rg',30)
      table.string('cpf',20)
      table.string('endereco',200)
      table.string('bairro',50)
      table.string('cidade',80)
      table.string('estado',80)
      table.string('cep',30)
      table.string('celular',30)
      table.string('email',100).notNullable().unique()
      table.string('password',60).notNullable()
      table.integer('tipoAcesso',1)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
