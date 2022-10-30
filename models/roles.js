const { response } = require('express')
const connection = require('../server/connection')
const uuidv4 = require('uuid').v4
const { Utilities } = require('../utilities/utilities')
const { roleCreationValidation, Validation } = require('../validate')
const { Troops } = require('./troops')

var utils = new Utilities
var troops = new Troops
var validation = new Validation
class Roles {
    // create a role
    async createRole(config, res, web) {
        web = web || false
        // config variable
        // set default color to grey ROLE COLOR is expieremental and may not be used
        var configArray = [
            uuidv4(),
            config.role_name,
            config.color || "fefefe",
            config.role_value || 0,
            config.troop_id
        ]
        var configObject = {
            role_name: config.role_name,
            color: config.color || "#fefefe",
            role_value: config.role_value || 0,
            troop_id: config.troop_id
        }
        // validate API input
        const {error} = roleCreationValidation(configObject)
        if(error) {
            if(web) {
                // do internal request thingy
            }
            return res.status(500).json(utils.createAPIErrorMessage("Unsuccessful", "RoleError", error.details[0].message, configObject))
        }
        // if validation passed
        
        // check if the troop uid is real
        if(await troops.searchTroopsByUID(config.troop_id) === null || await troops.searchTroopsByUID(config.troop_id) === "undefined") {
            if(web) {
                // do thing for internal web request
            }
            res.status(500).json(utils.createAPIErrorMessage("Unsuccessful", "RoleError", "Invalid troop_id"))
            return "No Troop Found"
        }
        // run create role sql command 
        try {
            var promise = new Promise((resolve, reject) => {
                connection.query("INSERT INTO roles (uuid, role_name, color, permissions_value, troop) VALUES(?, ?, ?, ?, ?)", configArray, (err, result) => {
                    if(err) {
                        console.log("Error creating role: " + err)
                        reject("Error creating role");
                    }
                    resolve(result)
                })
            })

            var response = await promise;
            if(web) {
                console.log("role created successfully")
                console.table(response)
                return response
            }
            
            var returnObject = {
                "role_name": config.roleName,
                "role_value": config.roleValue,
                "color": config.color,
                "troop_id": config.troop_id
            }
            res.status(200).json({
                server: {
                    status: "Successful"
                },
                data: {
                    message: "Role created successfully"
                },
                formResponse: configObject
            })
        } catch(err) {
            if(web) {
                console.log("error creating role: " + err)
                return err
            }
            var returnObject = {
                "role_name": config.roleName,
                "role_value": config.roleValue,
                "color": config.color,
                "troop_id": config.troop_id
            }
            console.log("error creating role: " + err)
            // return error response with util function
            res.status(500).json(utils.createAPIErrorMessage("Unsuccessful", "RoleError", "Unexpected error creating role", returnObject))
            // res.status(500).send("Unexpected error creating role")
        }
    }
    // update a role; finish it
    async updateRole(config, res, web) {
        // role id of role getting updated
        // params like createRole except not required 
        var troops = new Troops
        web = web || false
        // config variable
        // set default color to grey ROLE COLOR is expieremental and may not be used
        var configArray = [
            config.role_name || 'DEFAULT()',
            config.color || 'DEFAULT()',
            config.role_value || 'DEFAULT()',
            config.troop_id || 'DEFAULT()'
        ]
        try {
            var promise = new Promise((resolve, reject) => {
                connection.query("UPDATE SET role_name=?, color=?, permissions_value=? troop=? WHERE uuid = ?", configArray, (err, result) => {
                    if(err) {
                        reject(err)
                    }
                    resolve(result)
                })
            })
            var res = await promise;
            return res.status(200).send(res)
            // check to make sure troop is accurate
        } catch(error) {
            res.send(error)
        }
    }
    // gets a specific role by its uid
    async getRole() {

    }
    // get all roles in a troop
    async getRoles(troopid, res) {
        // validate troop id first 
        if(!troopid) {
            return utils.createAPIErrorMessage("Unsuccessful", "RoleError", "Missing 'troop_id' parameter")
        }
        const {error} = validation.getRolesValidation({troop_id: troopid})
        if(error) {
            return res.status(500).json(utils.createAPIErrorMessage("Unsuccessful", "RoleError", error.details[0].message, troopid))
        }
        // no errors continue
        // check if troop actually exists
        var troopExists = await troops.searchTroopsByUID(troopid);
        if(troopExists === true) {
            // get all roles where troop id = troop id
            try {
                var promise = new Promise((resolve, reject) => {
                    connection.query('SELECT * from roles WHERE troop = ?', [troopid], (err, result) => {
                        if(err) {
                            console.log("Error fetching roles in getRoles() " + err)
                            reject(err)
                        }
                        resolve(JSON.parse(JSON.stringify(result)))
                    })
                })
                // console.log(test)
                // ----------------DIVIDER----------------
                var roleCount = 0;
                for(var key in await promise) {
                    roleCount++
                }
                var roleObject = {}
                const returnObject = {
                    server: {
                        status: "Successful"
                    },
                    statistics: {
                        total_roles: roleCount
                    },
                    roles: await promise
                }
                return res.status(200).json(returnObject)
            } catch(err) {
                return res.status(500).json(utils.createAPIErrorMessage("Unsuccessful", "RoleError", "Unexpected error fetching roles", {troopid}))
            }
        } else {
            return res.status(500).json(utils.createAPIErrorMessage("Unsuccessful", "RoleError", "Troop could not be found", troopid))
        }
    }
}

module.exports = Roles