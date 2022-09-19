# Overview

A common problem when working with datasets is to store them and then collect the information they contain. It also involves retrieving a specific version of any collection or filtering some aspects of it.

`dataset` builds a simple REST interface that wraps and exposes a dataset with a common structure. It's intended to create methods to retrieve the objects contained in the dataset.

- ***So, what this repo does?***
- ***What this does not do?***

`dataset` does not offer an interface to store new data to the dataset.

# Prerequisites

This wrapper works with two premises: the dataset structure and the backend storage (to **/maybe/** supports more backends later).

## Dataset structure

The dataset structure is addressed to ML/AI processes where information about categories and annotations is present (yet not mandatory) and is heavily inspired in the [COCO dataset standard](https://cocodataset.org). We call every aspect of it as ****collections****, which are:

- Dataset information (dataset_info)
- Items
- Categories
- Annotations

Datasets could change over time. So, a versioning mechanism for the collections is added. The version is the key value to retrieve them.

A dataset has the following collections:

### Items

One key element of the dataset are the items we need to retrieve. An item at least has ****id and url**** properties. Other properties are optional.

```json

{

"item":

{

"id": str,

"url": str,

[ other properties ]

}

}

```

### Dataset Information

Holds the information of the dataset to retrieve. It's basic structure is defined as follows:

```json

{

"dataset_info": {

"name": str,

"version": int,

"url": str,

"contributor": str,

"description": str,

"date_created": date,

"year": int,

[ other properties ],

"items": Array<item>

}

}

```

### Categories

A category (**cat** in the further) has a similar structure, where at least ****id and name**** properties are need. Other properties are optional.

```json

{

"cat":{

"id": str,

"name": str

[ other properties ]

}

}

```

The cats collection is bound to a process that produces the categories. One suggested way to name it is `cats.PROCESS_NAME` (i.e. cats.species_detections, cats.genus_detection, etc.). It has the following structure:

```json

{

"cats.PROCESS_NAME": {

"version": int,

"version_description": str,

"cats": Array<cat>

}

}

```

### Annotations

A basic annotation (**ann** in the following) contains ****/\*surprise\*/**** the mandatory properties ****id, id of category, and the related item****. Other properties are optional.

```json

{

"ann":{

"id": str,

"cat_id": str,

"item_id": str,

[ other properties ]

}

}

```

The anns collection is also bound to a particular process. We suggest naming this collection as `anns.PROCESS_NAME`, where `PROCESS_NAME` is the name chosen for `cats.PROCESS_NAME` (where we obtain the `cat_id` property). (i.e. anns.species_detections, anns.genus_detection, etc.).

```json

{

"anns.PROCESS_NAME": {

"version": int,

"version_description": str,

"anns": Array<ann>

}

}

```

## Storage

- **--**
- ***Note:*** All the variables to be mentioned in the next lines are intended as ***environment variables***. We provide some suggestions to set up your environment in the [configuration section](#configuration).
- **--**

(For now) It's assumed you have your dataset stored in a mongoDB backend and also you have access to the backend. To establish a connection with the backend, you have to set the environment variable `DB_URL`.

An example of the expected storage structure is shown:

![structure](https://i.imgur.com/2AUzgYU.png)

Where each figure corresponds to a different MongoDB collection, and whose names are in the `ITEMS_COLLECTION`, `CATS_COLLECTION`, and `ANNS_COLLECTION` environment variables.

# Configuration

Some variables are needed to put `dataset` up an running.

In the ideal scenario, you have the correct storage and structure of your dataset. For those particular cases you only need to set up some variables in the [`docker-compose.yml`](https://github.com/thecopy-and-thepaste/dataset/blob/main/docker-compose.yml) file, to be described:

```yaml

NODE_ENV: Always in production for docker environment

DB_URL: Your connection to the mongodb. (i.e. mongodb://localhost:27017/db_name)

PORT: Container PORT to expose the service. It has to match with the ports section (i.e. 3000)

ITEMS_COLLECTION: Name of the collection that contains the items (i.e. test_collection)

CATS_COLLECTION: Name of the collection that contains the categories (i.e. cats.test_collection)

ANNS_COLLECTION: Name of the collection that contains the annotations (i.e. anns.test_collection)

API_PREFIX: Prefix to expose the API, which means your root will be docker_ip:port/API_PREFIX

(i.e. test_prefix -> localhost:8081/test_prefix/{endpoint})

```

- ***Note:***

If the `NODE_ENV` variable is not set to ****production****, it means we are in `dev` environment. So, we expect you to set the variables using either **env variables** or the `.env` file.

# Running

The easiest **(and the recommended)** way to use this repo is vía `docker-compose` (prior configuration), with:

```shell

docker-compose build

docker-compose up

```

in the root folder.

You can also run this repo by using `npm start`,`ts-node src/app.ts`, etc. Nonetheless, it expects the environment variables we described in the ****configuration section****.

# Endpoints

After you run/deploy, the wrapper will create 4 endpoints. To de described:

## Dataset Information

Dataset information (****dataset_info****) contains the global information of the collection to query.

- ***Location***

`API_PREFIX/datasets/DATASET_ID`.

Where:

- `API_PREFIX`: Name of the environment var defined.
- `DATASET_ID`: ID of the dataset to retrieve its information. (Name of the document that contains the desired dataset inside the `ITEMS_COLLECTION` collection.)
- ***Reponse***

```json

{

"data": [

{

"url": str,

"contributor": str,

"dateCreated": Date,

"description": str,

"year": int,

"totalDocuments": int

}

]

}

```

## Items

Items that match with the version of the collection.

- ***Location***

`API_PREFIX/items/DATASET_ID/VERSION?start=START_ROW`

Where:

- `API_PREFIX`: Name of the environment var defined.
- `DATASET_ID`: ID of the dataset to retrieve its information. (Name of the document that contains the desired dataset inside the `ITEMS_COLLECTION` collection.)
- `VERSION`: Version to retrieve.
- `START_ROW`: Start page (see [large datasets](#large-datasets))
- ***Reponse***

```json

{

"data": [

{

"items": [

. . .

]

}

]

}

```

## Cats

Categories that match with the version of the collection.

- ***Location***

`API_PREFIX/cats/VERSION`

Where:

- `API_PREFIX`: Name of the environment var defined.
- `VERSION`: Version to retrieve.
- ***Reponse***

```json

{

"data": [

{

"version": int,

"version_description": str,

"cats": [

. . .

]

}

]

}

```

## Anns

Annotations that match with the version of the collection.

- ***Location***

`API_PREFIX/anns/VERSION?start=START_ROW&lte=LTE_TH&gte=GTE_TH`

Where:

- `API_PREFIX`: Name of the environment var defined.
- `VERSION`: Version to retrieve.
- `LTE_TH`: Score threshold less than or equal to.
- `GTE_TH`: Score threshold greater than or equal to.
- `START_ROW`: Start page (see [large datasets](#large-datasets))
- ***Reponse***

```json

{

"data": [

{

"version": int,

"version_description": str,

"anns": [

. . .

],

"count": int

}

]

}

```

# Large datasets

In some cases datasets exceed [the maximum document size allowed by MongoDB](https://docs.mongodb.com/manual/reference/limits/#bson-documents). We suggest, as a workaround, paging the datasets in fixed-size chunks.

You can add the fields

```json

{

"start": int,

"end": int,

"has_next": bool,

"total": int

}

```

to your collections, and the wrapper will serve them as follows:

- ***For items collections***

```json

{

"data":{

"items": [

. . .

],

"start": int,

"end": int,

"has_next": true|false,

"total": int

}

}

```

- ***For cats collections***

```json

{

"data":{

"version": int,

"version_description": str,

"cats": [

. . .

],

"start": start_ix,

"end": end_ix,

"has_next": true|false,

"total": total_rows

}

}

```

- ***For anns collections***

Finally, for anns collections we add another field `count`. It retrieves the number or rows in the page that match with the query.

```json

{

"data":{

"version": int,

"version_description": str,

"anns": [

. . .

],

"start": start_ix,

"end": end_ix,

"has_next": true|false,

"total": total_rows,

"count": int

}

}

```

- **-----------**

Some examples of items collections are:

- Bib references

```json

{

"items": [

{

"id": uuid,

"url": "Doc location",

"title": "Doc title",

"language": "en",

"shortTitle": "Short title",

"volume": 0,

"DOI": doi,

"ISSN": issn,

"abstractNote": null

},{

"id": uuid,

[ . . . ]

}

}

```

- OCR Text extraction

```json

{

"items": [

{

"id": uuid,

"url": "Doc location",

"page": 0,

"ordinal": 0,

"hocr": [ array ],

"size": [ array ],

"item": "Text extracted"

},{

"id": uuid,

[ . . . ]

}

}

```