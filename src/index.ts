import { config } from 'dotenv'
config({ path: `.env.${process.env.NODE_ENV}` })
import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import morgan from 'morgan'
import cors from 'cors'
import { errorHandler } from './middleware/error-handler'
import { connectDb } from './db'
import { authRoute } from './routes/auth'
import { userRoute } from './routes/user'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { startStandaloneServer } from '@apollo/server/standalone'

// app
const app = express()
const PORT = process.env.PORT || 3001

// setting
app.set('title', 'shopkart-api')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve(__dirname, '..', 'public')))

app.use(cors())

// appolo serve
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`
const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin'
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster'
  }
]
const resolvers = {
  Query: {
    books: () => books
  }
}
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
})

app.use((req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development') {
    morgan('dev')
  }
  res.locals.baseUrl = process.env.BASE_URL
  res.locals.clientUrl = process.env.CLIENT_URL
  next()
})

// routes
app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)

app.get('/register', (req: Request, res: Response, next: NextFunction) => {
  res.render('./verification-code.ejs', {
    brand: 'Vue Social',
    baseUrl: res.locals.baseUrl,
    firstname: 'Pradeep',
    lastname: 'Kumar',
    token: 'dfsdfsdfasfsfsfdf'
  })
})

// catch all route and if not found throw error
// app.get('*', function (req, res) {
//   throw new Error('Route not found')
// })

app.use(errorHandler)

// listen
const server = app.listen(PORT, async () => {
  await connectDb()
  console.log(`Server is running on: localhost:${PORT}`)
})

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

function gracefulShutdown() {
  server.close(() => {
    process.exit(0)
  })
}

module.exports = app
