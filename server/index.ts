import express, { Application, Request, Response, NextFunction } from 'express'
const path = require('path')
const Client = require('bitcoin-core')
const fs = require('fs')

const folder = '$HOME/.bitcoin/wallets'

const app = express()

const PORT = process.env.PORT || 3001

const client = new Client({
  username: 'user',
  password: 'password',
})

interface ResponseError extends Error {
  statusCode?: number
}

const wrapAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')))

app.get(
  '/getblockchaininfo',
  wrapAsync(async (req: Request, res: Response) => {
    const chainInfo = await client.getBlockchainInfo()
    res.send({ chainInfo })
  })
)

app.get(
  '/getmininginfo',
  wrapAsync(async (req: Request, res: Response) => {
    const miningInfo = await client.getMiningInfo()
    res.send({ miningInfo })
  })
)

app.get(
  '/blockinfo/:id',
  wrapAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const blockInfo = await client.getBlockchainInfo()
    if (!/^\d+$/.test(id)) {
      throw new Error('Only digits are allowed')
    }
    if (parseInt(id) > blockInfo.blocks) {
      throw new Error('Max block count exceeded')
    }
    const blockHash = await client.getBlockHash(parseInt(id))
    const block = await client.getBlock(blockHash)
    if (parseInt(id) === 0) {
      res.send({ block, blockStats: '' })
    }
    const blockStats = await client.getBlockStats(blockHash)
    res.send({ block, blockStats })
  })
)

app.get(
  '/wallet',
  wrapAsync(async (req: Request, res: Response) => {
    const wallets: string[] = []
    fs.readdir(folder, (err: Error, files: string[]) => {
      files.forEach((file) => {
        wallets.push(file)
      })
    })
    res.send({ wallets })
  })
)

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