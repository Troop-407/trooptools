const connection = require('../server/connection')
const Joi  =require('joi')
const {registrationValidation, loginValidation} = require('../validate')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const uuidv4 = require('uuid').v4
const {Utilities} = require('../utilities/utilities')

class User {
    // register a user 
    async register(data, req, res, web) {
        var utils = new Utilities
        // web param will render web page rather than send a response (optional and defaults to false)
        web = web || false
        // validate submitted data with joi
        const { error } = registrationValidation(data)
        //if(error) return res.status(400).send(error.details[0].message)
        if(error) {
            if (web) {
                return res.render('./login/register.ejs', {
                    errorMessage: error.details[0].message,
                    formData: data
                })
            }
            res.status(400).json(utils.createAPIErrorMessage("Unsuccessful", "AuthError", error.details[0].message, data))           
        }

        // check if email is already registered
        const emailExists = await this.emailExists(data.email);
        if(emailExists != "No email registered") {
            switch(emailExists) {
                case "Error checking server for existing email":
                    if(web) {
                        return res.render('./login/register.ejs', {
                            errorMessage: "Error registering a user",
                            formData: data
                        })
                    }
                    res.status(500).json(utils.createAPIErrorMessage("Unsuccessful", "AuthError", "Error registering a user", data))
                    return "Error registering a user"
                    break
                case "Email is already registered":
                    if(web) {
                        return res.render('./login/register.ejs', {
                            errorMessage: "Email already registered",
                            formData: data
                        })
                    }
                    res.status(500).json(utils.createAPIErrorMessage("Unsuccessful", "AuthError", "Email already registered", data))
                    return "Email already registered"
                    break
                default:
                    if(web) {
                        return res.render('./login/register.ejs', {
                            errorMessage: "Error registering a user",
                            formData: data
                        })
                    }
                    res.status(500).json(utils.createAPIErrorMessage("Unsuccessful", "AuthError", "Error registering a user", data))
                    return "Error registering a user"
                    break
            }
        }

        // hash password
        try {
            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(data.password, 10, async function(err, hash) {
                    if(err) reject(err)
                    resolve(hash)
                });
            })

            // UID 
            const token = uuidv4()
            // create user
            const params = [
                data.firstName,
                data.lastName,
                data.username,
                data.email,
                hashedPassword,
                token
            ]

            // insert user into database
            connection.query("INSERT INTO users (first_name, last_name, username, email, password, uuid) VALUES(?, ?, ?, ?, ?, ?)", params, async (error, user) => {
                // check for an error and return 505
                if(error) {
                    res.status(505).json(utils.createAPIErrorMessage("Unsuccessful", "AuthError", "Error registering a user", data))
                    return "Error registering a user"
                }
                // legacy response
                const jsonResponse = {
                    "status": "successful",
                    "user": {
                        "firstName": data.firstName,
                        "lastName": data.lastName,
                        "username": data.username,
                        "email": data.email,
                        "password": hashedPassword
                    },
                    "token": {
                        "authToken": token
                    }
                }
                // check if if there is a result and return 400
                // if request is internal
                const jwtToken = jwt.sign({token: token}, process.env.JWT_SECRET)
                // send server response
                // redirects user to greetings page because it was sent from login form
                if(web) {
                    res.cookie('auth_token', jwtToken, { maxAge: 172000000, httpOnly: true }).send("<script>if(window.opener == null){window.location.href='/greetings'}else{window.opener.postMessage('Developer: Login Success. REDIRECT_TRUE', '*');window.close()}</script >")
                    return 'success'
                }
                // return resposne of created user API caller
                res.status(200).json(
                    {
                        "server": {
                            "status": "Successful"
                        },
                        "data": {
                            "credentials": {
                                data
                            },
                            "auth-token": jwtToken
                        },
                        "formResponse": {
                            "first_name": data.firstName,
                            "last_name": data.lastName,
                            "username": data.username,
                            "email": data.email,
                            "password": hashedPassword
                        }
                    }
                )
                return jsonResponse
            })
        } catch(error) {
            res.status(505).json(utils.createAPIErrorMessage("Unsuccessful", "AuthError", "Error registering a user", data))
            return "Error registering a user"
        }
    }
    // login user
    async login(data, req, res, web) {
        var utils = new Utilities
        // web param will render web page rather than send a response (optional and defaults to false)
        web = web || false
        // validate credentials 
        // validate submitted data with joi
        const { error } = loginValidation(data)
        if(error) {
            if (web) {
                return res.render('./login/auth-login.ejs', {
                    errorMessage: error.details[0].message,
                    formData: data
                })
            }
            return res.status(500).json(utils.createAPIErrorMessage("Unsuccessful", "AuthError", error.details[0].message, data))
        }
        // check if email is already registered
        const emailExists = await this.emailExists(data.email);
        if(emailExists != "Email is already registered") {
            switch(emailExists) {
                case "Error checking server for existing email":
                    if(web) {
                        return res.render('./login/auth-login.ejs', {
                            errorMessage: "Error checking email",
                            formData: data
                        })
                    }
                    res.status(500).json(utils.createAPIErrorMessage("Unsuccessful", "AuthError", "Error checking server for existing email", data))
                    break
                case "No email registered":
                    if(web) {
                        return res.render('./login/auth-login.ejs', {
                            errorMessage: "This email is not registered",
                            formData: data
                        })
                    }
                    res.status(500).json(utils.createAPIErrorMessage("Unsuccessful", "AuthError", "This email is not registered", data))
                    break
                default:
                    if(web) {
                        return res.render('./login/auth-login.ejs', {
                            errorMessage: "Error checking email",
                            formData: data
                        })
                    }
                    res.status(500).json(utils.createAPIErrorMessage("Unsuccessful", "AuthError", "Error checking server for existing email", data))
                    break
            }
            return
        }

        // get users token (not jwt)
        const tokenResponse = await this.getToken(data.email)
        const token = tokenResponse[0].uuid

        // check if password is correct
        try {
            const passwordFromDatabase = await this.getPassword(data.email)
            const pass = passwordFromDatabase[0].password
            const rawPass = data.password
            try {
                const validPassword = await new Promise((resolve, reject) => {
                    bcrypt.compare(rawPass, pass, (error, result) => {
                        if(error) reject(error)
                        resolve(result)
                    })
                })
                if(!validPassword) {
                    if(web) {
                        return res.render('./login/auth-login.ejs', {
                            errorMessage: "Username or password is incorrect",
                            formData: data
                        })
                    }
                    res.status(500).json(utils.createAPIErrorMessage("Unsuccessful", "AuthError", "Username or password is incorrect", data))
                }
            } catch(error) {
                if(web) {
                    return res.render('./login/auth-login.ejs', {
                        errorMessage: "Error logging in user",
                        formData: data
                    })
                }
                res.status(500).json(utils.createAPIErrorMessage("Unsuccessful", "AuthError", "Error logging in", data))
            }
            // user has successfuly logged in
            // first create jtw
            const jwtToken = jwt.sign({token: token}, process.env.JWT_SECRET)
            // send server response
            if(web) {
                res.cookie('auth_token', jwtToken, { maxAge: 172000000, httpOnly: true }).send("<script>if(window.opener == null){window.location.href='/greetings'}else{window.opener.postMessage('Developer: Login Success. REDIRECT_TRUE', '*');window.close()}</script >")
                return 'success'
            }
            res.header('auth-token', jwtToken).status(200).json(
                {
                    "server": {
                        "status": "Successful"
                    },
                    "data": {
                        "credentials": {
                            data
                        },
                        "auth-token": jwtToken
                    },
                    "formResponse": data
                }
            )
            return
        }
        //error logging in
        catch(error) {
            console.log(error)
            res.status(505).send(utils.createAPIErrorMessage("Unsuccessful", "AuthError", "Error logging in", data))
        }
    }
    // check if email is existing already
    emailExists(email) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT username FROM users WHERE email = ?', [email], (error, result) => {
                // check for an error and return 505
                if(error) {
                    reject("Error checking server for existing email")
                }
                // check if if there is a result
                if(result.length > 0) {
                    resolve("Email is already registered")
                } 
                resolve("No email registered")
            })
        })
    }
    // get password by email (PRIMARY KEY)
    getPassword(email) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT password FROM users WHERE email = ?', [email], (error, result) => {
                // check for an error and return 505
                if(error) {
                    reject("Error getting password from server")
                }
                // check if if there is a result and return 400
                resolve(result)
            })
        })
    }
    getToken(email) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT uuid FROM users WHERE email = ?', [email], (error, result) => {
                // check for an error and return 505
                if(error) {
                    reject(error)
                    // error registering a user
                }
                resolve(result)
                // found or not found
            })
        })
    }
}
module.exports.User = User