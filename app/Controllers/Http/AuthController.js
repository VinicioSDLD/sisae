'use strict'

const User = use('App/Models/User')

class AuthController {

  async register({ request }){
      const data = request.only(['nome', 'dataNasc', 'rg', 'cpf',	'endereco', 'bairro', 'cidade',	'estado',	'cep', 'celular',	'email', 	'password', 	'tipoAcesso' ])
      const user = await User.create(data)
      return user
  }

  async authenticate({ request, auth }){
    const {email, password} = request.all()
    const token = await auth.attempt(email, password)
    return token
  }

}

module.exports = AuthController
