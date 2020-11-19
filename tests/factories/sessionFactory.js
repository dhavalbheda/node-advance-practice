const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip')
const cookieSecrect = require('../../config/keys').cookieKey
const keyGrip = new Keygrip([cookieSecrect])

module.exports = (user) => {
    const sessionObject = {
        passport: {
            user: user._id.toString()
        }
    }
    const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64')
    
    const sig = keyGrip.sign('session='+ session)
    return {session, sig}
}