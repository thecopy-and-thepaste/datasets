import { Router, Request, Response, NextFunction } from "express"
import { listenerCount } from "process"
import Logger from "../../loaders/logger"

import Dataset from '../../models/dataset'

const route = Router()

export default (app: Router) => {
    app.use('/items', route)

    route.get('/:collection_id/:version',
        (req: Request, res: Response, next: NextFunction) => {

            try {
                const version = parseFloat(req.params['version'])
                const collection_id = req.params['collection_id']
                const start = req.query['start'] as string || "0"

                Dataset
                    .find(
                        {
                            '$and': [
                                { 'collection_id': collection_id },
                                { 'version': version },
                                { 'start': parseInt(start) },
                            ]
                        },
                        {
                            "start": 1,
                            "end": 1,
                            "has_next": 1,
                            'items': 1,
                            'total': 1,
                            _id: 0

                        })
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
                                    .json({
                                        data: docs[0]
                                    })
                                    .status(200)
                        }
                    })
            } catch (e) {
                Logger.error(e)
                return next(e)
            }

        })
}