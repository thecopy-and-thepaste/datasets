import dotenv from 'dotenv'

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


if (process.env.NODE_ENV == 'development') {
    const envFound = dotenv.config();

    if (envFound.error) {
        throw new Error(".env file not found");
    }
}

export default {
    dbUrl: process.env.DB_URL,
    port: parseInt(process.env.PORT),
    /**
    * database collections 
    **/
    collections:{
        items: process.env.ITEMS_COLLECTION,
        anns: process.env.ANNS_COLLECTION,
        cats : process.env.CATS_COLLECTION,
    },
    logs: {
        level: process.env.LOG_LEVEL || 'debug',
    },
    /**
    * API configs
    **/
    api: {
        prefix: `/${process.env.API_PREFIX}`,
    }
}