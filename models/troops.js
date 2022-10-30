const { reject } = require('croppie')
const { resolve } = require('croppie')
const connection = require('../server/connection')

class Troops {
    async searchTroopsByUID(uid) {
        try {
            const promise = new Promise((resolve, reject) => {
                connection.query("SELECT name FROM troops WHERE uuid = ?", [uid], (err, result) => {
                    if(err) {
                        reject(err)
                    }
                    if(result.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
            })
            return await promise
        } catch(error) {
            console.log("error searching troops: " + error)
            return null
        }
    }
}

module.exports.Troops = Troops