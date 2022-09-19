import { Router } from "express"

import dataset_info from './routes/collection_info'
import datasets from './routes/items'
import cats from "./routes/cats"
import anns from "./routes/anns"

export default () => {
    const app = Router()
    dataset_info(app)
    datasets(app)
    cats(app)
    anns(app)


    return app
}