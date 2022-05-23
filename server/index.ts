import express, { Request, Response, NextFunction } from 'express'
import router from './routes'
const path = require('path')
const cors = require('cors')

const app = express()

const PORT = process.env.PORT || 3001

interface ResponseError extends Error {
  statusCode?: number
}

app.use('/api', router)

app.use(cors({ origin: true }))

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
