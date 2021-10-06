# Overview

A common problem when working with datasets is to store them and then collect the information they contain. It also involves retrieving a specific version of any collection or filters some aspects of it.

`dataset` builds a simple REST interface that wraps and exposes a dataset with a particular structure. It's intended to create methods to retrieve the objects contained in the dataset.

**So, what this repo does?**

 

**What this does not do?**

`dataset` does not offer an interface to store new data to the dataset.

# Prerequisites

This wrapper works with two premises: the dataset structure and the backend storage (to */maybe/* supports more backends later).
## Dataset structure

The dataset structure is addressed to ML/AI processes where categories and annotations data are needed and is heavily inspired in the [COCO dataset standard](https://cocodataset.org). We call every aspect of it as **dataset collection**, which are:
- Dataset information (dataset_info)
- Items
- Categories
- Annotations

We know that datasets could change over time. So, we add a versioning mechanism for the collections. The version is the key value to retrieve them.

A dataset has the following collections:
### Items

One key element of the dataset are the items we need to retrieve. An item at least has and **id and url**. Other properties are optional.

```json
{
    "item":{
        "id": {
            "url": str,
            [ other properties ]
        }
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
        "items": dict<item>
    }
}
```

### Categories

A category (*cat* in the further) needs also need at least an **id and name**. Other properties are optional.

```json
{
    "cat":{
        "id":{
            "name": str,
            [ other properties ]
        }
    }
}
```

The cats collection is bounded to a process that produces the categories. One suggested way to name it is `cats.PROCESS_NAME` (i.e. cats.species_detections, cats.genus_detection, etc.). It has the following structure:

 ```json
{
    "cats.PROCESS_NAME": {
        "version": int,
        "cats": dict<cat>
    }
}
```

### Annotations

A basic annotation (*ann* in the following) contains **/\*surprise\*/** an id, an id of category, and the related item. As follows:

 ```json
{
    "ann":{
        "id":{
            "cat_id": str,
            "item_id": str,
            "score": float
            [ other properties ]
        }
    }
}
```

The anns collection is also bounded to a particular process. We suggest to name this collection as `anns.PROCESS_NAME` (i.e. anns.species_detections, anns.genus_detection, etc.).

```json
{
    "anns.PROCESS_NAME": {
        "version": int,
        "anns": dict<ann>
    }
}
```

## Storage

---

**Note:** All the variables to be mentioned in the next lines are intended as **environment variables**. We provide some suggestions to set up your environment in the [configuration section](#configuration).

---

(For now) We assume you have your dataset stored in a mongoDB backend and also you have access to the backend. To establish a connection with the backend, you have to set the environment variable `DB_URL`.

We depict  an example of the expected storage structure in the backend, according to the structure required.

![structure](https://i.imgur.com/URgVyNS.jpg)

Where each figure corresponds to a different MongoDB collection, and whose names are in the `ITEMS_COLLECTION`, `CATS_COLLECTION`, and `ANNS_COLLECTION` environment variables.


# Endpoints

In process 

![In process](https://thecopy-and-thepaste.github.io/images/unsee.webp)

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

**Note:**

If the `NODE_ENV` variable is not set to **production**, it means we are in `dev` environment. So, we expect you to set the variables using either *env variables* or the `.env` file.

# Running

The easiest *(and the recommended)* way to use this repo is vía `docker-compose` (prior configuration), with:

```shell
docker-compose build
docker-compose up 
```

in the root folder.

You can also run this repo by using `npm start`,`ts-node src/app.ts`, etc. Nonetheless, it expects the environment variables we described in the **configuration section**.
