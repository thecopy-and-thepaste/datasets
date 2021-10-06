import { Router, Request, Response, NextFunction } from "express"
import Logger from "../../loaders/logger"

import Dataset from '../../models/dataset'

const route = Router()

export default (app: Router) => {
    app.use('/datasets', route)

    route.get('/:name',
        (req: Request, res: Response, next: NextFunction) => {
            try {
                const name = req.params['name']


                Dataset
                    .aggregate([
                        { '$match': { 'name': name } },
                        {
                            '$project': {
                                _id: 0,
                                name: 1,
                                url: 1,
                                version: 1,
                                contributor: 1,
                                dateCreated: 1,
                                description: 1,
                                year: 1,
                                item_count: { '$size': '$items' }
                            }
                        },
                        {
                            '$group': {
                                _id: {
                                    name: '$name',
                                    version: '$version',
                                },
                                url: { $first: '$url' },
                                contributor: { $first: '$contributor' },
                                dateCreated: { $first: '$dateCreated' },
                                description: { $first: '$description' },
                                year: { $first: '$year' },
                                totalDocuments: { $sum: '$item_count' }
                            }
                        },
                        {
                            '$project': {
                                _id: 0
                            }
                        },
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