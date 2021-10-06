export interface IDatasetInfo {
    url: string
    contributor: string
    description: string
    dateCreated: string
    year: number
    datasetQty: number
}

export interface IItem {
    id: string
    url: string
}

export interface IDataset {
    version: number
    items: [IItem]
}

export interface IAnn {
    id: string
    catId: number
    itemId: string
    version: number
}

export interface ICat {
    id: string
    name: string
    version: number
}