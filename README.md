# Adonis API application

This is the boilerplate for creating an API server in AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Authentication
3. CORS
4. Lucid ORM
5. Migrations and seeds

# Desenvolvendo Sistema Web NodeJS
# Framework - AdonisJS (API) | Biblioteca ReactJS (View)

1. Criar projeto API Adonis + Add Biblioteca MySQL
    adonis new "nomeProjeto" --api-only && cd "nomeProjeto" && npm install mysql --save

2. Configurando a Conexão MySQL
    Arquivo “.env”
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=
    DB_DATABASE=adonis
    HASH_DRIVER=bcrypt

3. Ver status ( database/migrations ) e migrar tabelas defaults ( user, token) para o MySQL
    adonis migration:status
    adonis migration:run

4. Criar controle HTTP de autenticação de usuários (app/controllers/http)
  	adonis make:controller Auth
  	adonis make:controller App

    ### No arquivo recém criado “AuthController.js” adicione: ###
      //Constante do Model User
         const User = use('App/Models/User')

      //Método (async register) - registro de novo usuário
         async register({ request }){
           const data = request.only(['username','email', 'password'])
           const user = await User.create(data)
           return user
         }
      //Método (async authenticate) – autenticação via token do usuário registrado
         async authenticate({ request, auth }){
           const {email, password} = request.all()
           const token = await auth.attempt(email, password)
           return token
         }

    ### No arquivo recém criado “AppController.js” adicione o método: ###
	      index () {  return 'Hello world'  }

5. Criar CRUD => (model + migration + Controller) */ (-m Criar Migration | -c Criar Controller) /*
  	adonis make:model Tweet –m –c

    ### No arquivo de migration recém criado “Tweet_schema.js” adicione os campos da tabela:
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('content', 240).notNullable()

    //Migrar tabela
    adonis migration:run

    ### No arquivo recém criado “TweetController.js” adicione a constate e os métodos: ###
        const Tweet =use('App/Models/Tweet')

        async index () {
          const tweets = await Tweet.query()
          .with('user')
          .fetch()
          return tweets
        }
        async store ({ request, auth }) {
          const data = request.only(['content'])
          const tweet = await Tweet.create({ user_id: auth.user.id, ...data })
          return tweet
        }
        async show ({ params }) {
          const tweet = await Tweet.findOrFail(params.id)
          return tweet
        }
        async destroy ({ params, auth, response }) {
          const tweet = await Tweet.findOrFail(params.id)
          if (tweet.user_id != auth.user.id){
            return response.status(401)
          }
          await tweet.delete()
        }

6. Criando Rotas e Route.group do CRUD

    ### No arquivo de rotas (start/routes/routes.js) adicione as rotas dos métodos (register/authenticate) do arquivo AuthController.js adicione:

    //Rota de novo registro de usuário
    Route.post('/register', 'AuthController.register')

    //Rota de autenticação de usuário
    Route.post('/authenticate', 'AuthController.authenticate')

    //Rota protegida pela autenticação
    Route.get('/app', 'AppController.index').middleware(['auth'])

    //Grupo de Rotas CRUD protegida por autenticação
    Route.group(() => {
    Route.resource('tweets','TweetController').apiOnly().except('update')
    }).middleware(['auth'])

7. Listar rotas e testar com o Insomnia
    //Listar todas as rotas
    adonis route:list

    ### EXEMPLO DE TESTE DE ROTAS COM O INSOMNIA ###
    // Criando um novo registro de usuário
    Send POST JSON - http://localhost:3333/register
    {
    	"username":"vinicios",
    	"email":"vsdld2@gamil.com",
    	"password":"301051"
    }

    //Autenticando o usuário e gerando token
    Send POST JSON - http://localhost:3333/authenticate
    {
    	"email":"vsdld2@gamil.com",
    "password":"301051"
    }

    //Teste de Autenticação
    Send GET Auth => Bearer Token
    //Enviar token de autenticação gerado
    TOKEN:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTU1MDQ0Mjk5MX0.-7R-jEe_PbCGkqsJ4jQuSdRaYKJ53J5EUJFWHyY8K7I
