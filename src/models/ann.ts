import mongoose from "mongoose"

import { IAnn } from "../interfaces/intefaces"
import config from "../config"

const annCollection = config.collections['anns']

const Ann = new mongoose.Schema(
    {
        id: {
            type: String
        },
        itemId: {
            type: String
        },
        catId: {
            type: String
        }
    },
    {
        strict: false
    })

const AnnCollection = new mongoose.Schema(
    {
        collectionId: {
            type: String
        },
        version: {
            type: Number
        },
        versionDescription: {
            type: String
        },
        anns: {
            type: [Ann]
        }
    },
    { strict: false }
)

export default mongoose
    .model<IAnn & mongoose.Document>(annCollection, AnnCollection);