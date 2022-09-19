import { Router, Request, Response, NextFunction } from "express"
import Logger from "../../loaders/logger"

import Cat from "../../models/cat"

const route = Router()

export default (app: Router) => {
    app.use('/cats', route)

    route.get('/list',
        (req: Request, res: Response, next: NextFunction) => {
            try {
                Cat
                    .aggregate([
                        // { '$match': {} },
                        // { '$project': { cats: 0 } },
                        {
                            $group: {
                                _id: {
                                    "collection_id": "$collection_id",
                                    "version": "$version"
                                },
                                version: { $first: '$version' },
                                collection_id: { $first: '$collection_id' },
                                total: { $first: '$total' },
                                info: { $first: '$info' }
                            }
                        },
                        { $project: { _id: 0 } }
                    ])
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
        }
    )

    route.get('/:collection_id/:version',
        (req: Request, res: Response, next: NextFunction) => {
            try {
                const collection_id = req.params['collection_id']
                const version = parseFloat(req.params['version'])
                const start = req.query['start'] as string || "0"

                Cat
                    .find({
                        'collection_id': collection_id,
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
                            let doc = docs[0]

                            return res
                                .json({ data: doc })
                                .status(200)
                        }
                    })
            } catch (e) {
                Logger.error(e)
                return next(e)
            }

        })
}