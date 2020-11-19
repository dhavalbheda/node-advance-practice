const { constants } = require('buffer')
const mongoose = require('mongoose')
const exec = mongoose.Query.prototype.exec
const redis = require('redis')
const redisURL = require('../config/keys').redisURL
const client = redis.createClient(redisURL)
client.hget = require('util').promisify(client.hget)

mongoose.Query.prototype.cache = function(options = {}) {
    this.allowChache = true
    this.hashKey = JSON.stringify(options.key || '')
    return this
}

//  Configure exec fuction for add Cache feature
mongoose.Query.prototype.exec = async function() {
    if(!this.allowChache) {
        return exec.apply(this, arguments)
    }

    const key = JSON.stringify(Object.assign({}, this.getFilter(), {collection: this.mongooseCollection.name}))
    const cacheValue = await client.hget(this.hashKey, key)
    if(cacheValue) {
        const document = JSON.parse(cacheValue)
        return Array.isArray(document)
                ? document.map(item => new this.model(item))
                : new this.model(document)
        
    }
    const result = await exec.apply(this, arguments)
    client.hset(this.hashKey, key, JSON.stringify(result))
    return result
}

module.exports =  {
    removeCache(hashKey) {
        client.del(JSON.stringify(hashKey))
    }
}