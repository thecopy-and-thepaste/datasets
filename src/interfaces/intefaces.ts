export interface IDataset {
    collection_id: string
    version: number
    name: string
    url: string
    contributor: string
    description: string
    dateCreated: string
    year: number
    items: [IItem]
}

export interface IItem {
    id: string
    url: string
}

export interface ICatCollection {
    collection_id: string
    version: number
    versionDescription: string
    cats: [ICat]
}

export interface ICat {
    id: string
    name: string
}

export interface IAnnCollection {
    collection_id: string
    version: number
    versionDescription: string
    anns: [IAnn]
}

export interface IAnn {
    id: string
    catId: number
    itemId: string
}

