import { Router, Request, Response, NextFunction } from "express"
import Logger from "../../loaders/logger"

import Ann from "../../models/ann"

const route = Router()

export default (app: Router) => {
    app.use('/anns', route)

    route.get('/:version',
        (req: Request, res: Response, next: NextFunction) => {
            try {
                const version = parseInt(req.params['version'])

                const lte = req.query.lte as string
                const gte = req.query.gte as string
                let items = []

                items.push({ version: version })

                if (lte != null) {
                    const low_range = parseFloat(lte)
                    items.push({ score: { $lte: low_range } })
                }

                if (gte != null) {
                    const up_range = parseFloat(gte)
                    items.push({ score: { $gte: up_range } })
                }

                let query = {
                    $and: items
                }

                Ann.find(query, { '_id': 0 })
                    .exec((err, docs) => {
                        if (err) {
                            Logger.error(err)
                            return res
                                .json({ error: err })
                                .status(500)
                        }

                        if (docs) {
                            return res
                                .json({ data: docs })
                                .status(200)
                        }
                    })
            } catch (e) {
                Logger.error(e)
                return next(e)
            }

        })
}