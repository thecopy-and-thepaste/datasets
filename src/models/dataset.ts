import mongoose from 'mongoose'

import { IDataset, IDatasetInfo } from "../interfaces/intefaces"
import config from "../config"

const dataset = config.collections.items

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

const DatasetItem = new mongoose.Schema(
    {
        version: {
            type: Number
        },
        items: {
            type: [Item]
        }
    },
    { strict: false }
)
const Dataset = new mongoose.Schema(
    {
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
        datasetQty: {
            type: Number
        },
        datasets: {
            type: [DatasetItem]
        }

    },
    { strict: false }
)

export default mongoose
    .model<IDatasetInfo & mongoose.Document>(dataset, Dataset)