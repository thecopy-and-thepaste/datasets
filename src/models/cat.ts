import mongoose from "mongoose"

import { ICat } from "../interfaces/intefaces"
import config from "../config"

const catCollection = config.collections.cats

const Cat = new mongoose.Schema(
    {
        id: {
            type: String
        },
        name: {
            type: String
        },
        version: {
            type: Number
        }
    },
    { strict: false }
)

export default mongoose
    .model<ICat & mongoose.Document>(catCollection, Cat);