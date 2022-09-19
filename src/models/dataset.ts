import mongoose from 'mongoose'

import { IDataset, IItem } from "../interfaces/intefaces"
import config from "../config"

const dataset = config.collections['collections']

const Item = new mongoose.Schema(
    {
        id: {
            type: String
        },
        url: {
            type: String
        }
    },
    { strict: false })

const Dataset = new mongoose.Schema(
    {
        collectionId: {
            type: String
        },
        version: {
            type: Number
        },
        name: {
            type: String
        },
        url: {
            type: String
        },
        contributor: {
            type: String
        },
        description: {
            type: String
        },
        dateCreated: {
            type: Date
        },
        year: {
            type: Number
        },
        items: {
            type: [Item]
        }

    },
    { strict: false }
)

export default mongoose
    .model<IDataset & mongoose.Document>(dataset, Dataset)