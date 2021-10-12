import { Router, Request, Response, NextFunction } from "express"
import Logger from "../../loaders/logger"

import Cat from "../../models/cat"

const route = Router()

export default (app: Router) => {
    app.use('/cats', route)

    route.get('/:version',
        (req: Request, res: Response, next: NextFunction) => {
            try {
                const version = parseInt(req.params['version'])
                const start = req.query['start'] as string || "0"

                Cat
                    .find({
                        'version': version,
                        'start': parseInt(start)
                    }, { '_id': 0 })
                    .exec((err, docs) => {
                        if (err) {
                            Logger.error(err)
                            return res
                                .json({ error: err })
                                .status(500)

                        }

                        if (docs) {
                            if (docs.length > 1)
                                return res
                                    .json({ error: "We found multiple entries for your query" })
                                    .status(500)
                            else
                                return res
                                    .json({ data: docs[0] })
                                    .status(200)
                        }
                    })
            } catch (e) {
                Logger.error(e)
                return next(e)
            }

        })
}