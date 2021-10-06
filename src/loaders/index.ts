import Logger from './logger'
import mongooseLoader from './mongoose'
import expressLoader from './express'

export default async ({ app }) => {
    const mongoConnection = await mongooseLoader()
    Logger.info("@Mongoose ready")

    await expressLoader({ app: app });
    Logger.info('@Express ready');
}