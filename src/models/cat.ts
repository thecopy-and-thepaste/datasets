import mongoose from "mongoose"

import { ICatCollection } from "../interfaces/intefaces"
import config from "../config"

const catCollection = config.collections['cats']

const Cat = new mongoose.Schema(
    {
        id: {
            type: String
        },
        name: {
            type: String
        }
    },
    {
        strict: false
    })

const CatCollection = new mongoose.Schema(
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
        cats: {
            type: [Cat]
        }
    },
    { strict: false }
)

export default mongoose
    .model<ICatCollection & mongoose.Document>(catCollection, CatCollection);