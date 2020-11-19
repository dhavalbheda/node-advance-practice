const { removeCache } = require('../services/cache')

module.exports = async (req, res, next) => {
    await next();
    removeCache(req.user.id)
}