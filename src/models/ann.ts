import mongoose from "mongoose"

import { IAnn } from "../interfaces/intefaces"
import config from "../config"

const annCollection = config.collections.anns
console.log(annCollection)

const Ann = new mongoose.Schema(
    {
        id: {
            type: String
        },
        catId: {
            type: Number
        },
        itemId: {
            type: String
        },
        version: {
            type: Number
        }
    },
    { strict: false }
)

export default mongoose
    .model<IAnn & mongoose.Document>(annCollection, Ann);