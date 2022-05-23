import express, { Request, Response, NextFunction } from 'express'
const path = require('path')
const Client = require('bitcoin-core')
const fs = require('fs')

const router = express.Router()

const wrapAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}

const client = new Client({
  username: 'user',
  password: 'password',
})

router.get(
  '/getblockchaininfo',
  wrapAsync(async (req: Request, res: Response) => {
    const chainInfo = await client.getBlockchainInfo()
    res.send({ chainInfo })
  })
)

router.get(
  '/getmininginfo',
  wrapAsync(async (req: Request, res: Response) => {
    const miningInfo = await client.getMiningInfo()
    res.send({ miningInfo })
  })
)

router.get(
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

router.get(
  '/wallet',
  wrapAsync(async (req: Request, res: Response) => {
    const wallets: string[] = []
    fs.readdir('$HOME/.bitcoin/wallets', (err: Error, files: string[]) => {
      files.forEach((file) => {
        wallets.push(file)
      })
    })
    res.send({ wallets })
  })
)

export default router
