import express, { Request, Response, NextFunction } from 'express'
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')
import router from './routes'

const app = express()

const PORT = process.env.PORT || 3001

// const router = express.Router()

app.use('/api', router)

const apiProxy = createProxyMiddleware('/api', {
  target: 'http://localhost:3001',
})

app.use(apiProxy)

interface ResponseError extends Error {
  statusCode?: number
}

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')))

// All other GET requests not handled before will return our React app
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

app.use(
  (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    const { statusCode = 404 } = err
    res.status(statusCode).send({ msg: err.message })
  }
)

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
