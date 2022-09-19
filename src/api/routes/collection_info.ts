import { Router, Request, Response, NextFunction } from "express"
import Logger from "../../loaders/logger"

import Dataset from '../../models/dataset'

const route = Router()

export default (app: Router) => {
    app.use('/collections', route)

    route.get('/list',
        (req: Request, res: Response, next: NextFunction) => {
            try {
                Dataset
                    .aggregate([
                        // { '$match': {  } },
                        // { '$project': { items: 0 } },
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
        })

    route.get('/:name',
        (req: Request, res: Response, next: NextFunction) => {
            try {
                const name = req.params['name']

                Dataset
                    .aggregate([
                        { '$match': { 'collection_id': name } },
                        {
                            '$project': {
                                _id: 0,
                                collection_id: 1,
                                url: 1,
                                version: 1,
                                contributor: 1,
                                dateCreated: 1,
                                description: 1,
                                year: 1,
                                total: 1
                            }
                        },
                        {
                            '$group': {
                                _id: {
                                    collection_id: '$name',
                                    version: '$version',
                                },
                                version: { $first: '$version' },
                                url: { $first: '$url' },
                                contributor: { $first: '$contributor' },
                                dateCreated: { $first: '$dateCreated' },
                                description: { $first: '$description' },
                                year: { $first: '$year' },
                                totalDocuments: { $first: '$total' },
                            }
                        },
                        {
                            '$project': {
                                _id: 0
                            }
                        }
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

        })


}