import { Router } from "express"

const loggerRouter = Router()

loggerRouter.use('/fatal', (req, res) => {
    req.logger.fatal('fatal')
    res.send('fatal')
})
loggerRouter.use('/error', (req, res) => {
    req.logger.error('error')
    res.send('error')
})
loggerRouter.use('/warning', (req, res) => {
    req.logger.warning('warning')
    res.send('warning')
})
loggerRouter.use('/info', (req, res) => {
    req.logger.info('info')
    res.send('info')
})

export default loggerRouter