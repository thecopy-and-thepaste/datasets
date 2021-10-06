import express from 'express';

import Logger from './loaders/logger';
import config from './config'

async function startServer() {
    const app = express()
    await require('./loaders').default({ app: app })

    Logger.info("All loaders ready")

    app.listen(config.port, () => {
        Logger.info(`App listening port:${config.port}`)

    }).on('error', (err) => {
        Logger.error(err)
        process.exit(1)
    }) 
}

startServer()