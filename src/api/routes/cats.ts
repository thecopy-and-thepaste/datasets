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

                Cat.find({ 'version': version }, {'_id': 0})
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