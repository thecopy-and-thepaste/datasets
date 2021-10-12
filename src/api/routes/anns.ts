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

                const start = req.query['start'] as string || "0"

                const lte = req.query.lte as string
                const gte = req.query.gte as string
                let cond_items = []

                if (lte != null) {
                    const low_range = parseFloat(lte)
                    cond_items.push({ $lte: ['$$ann.score', low_range] })
                }

                if (gte != null) {
                    const up_range = parseFloat(gte)
                    cond_items.push({ $gte: ['$$ann.score', up_range] })
                }

                let cond = {
                    $and: cond_items
                }

                Ann.aggregate([
                    {
                        $match: { 'version': version, 'start': parseInt(start) }
                    },
                    {
                        $project: {
                            'start': 1,
                            'version': 1,
                            'end': 1,
                            'has_next': 1,
                            'anns': {
                                $filter: {
                                    input: '$anns',
                                    as: 'ann',
                                    cond: cond
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            'start': 1,
                            'version': 1,
                            'end': 1,
                            'has_next': 1,
                            'anns': 1,
                            'count': {
                                $size: '$anns'
                            }
                        }
                    }

                ]).exec((err, docs) => {
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