const { required } = require('@hapi/joi/lib/base')
const Joi = require('joi')

class Validation {
    // auth and user
    registrationValidation(data) {
        // joi schema
        const schema = Joi.object({
            email: Joi.string()
                .email()
                .min(1)
                .required()
                .messages({
                    'string.email': `Email must be of type email`,
                    'string.empty': `An email is required`,
                    'string.min': `Your email has to be at least 1 character in length`,
                    'string.required': `A email is required`
                }),
            password: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                .min(5)
                .required()
                .messages({
                    'string.pattern': `Your password does not match pattern`,
                    'string.empty': `A password is required`,
                    'string.min': `Your password has to be at least 5 characters in length`,
                    'string.required': `A password is required`
                }),
            firstName: Joi.string()
                .alphanum()
                .min(1)
                .max(30)
                .required()
                .messages({
                    'string.alphanum': `Your first name can only contain alpha-numeric characters`,
                    'string.empty': `A first name is required`,
                    'string.min': `Your first name has to be at least 1 character in length`,
                    'string.max': `Your first name can not exceed 30 characters in length`,
                    'string.required': `A first name is required`
                }),
            lastName: Joi.string()
                .alphanum()
                .min(1)
                .max(30)
                .required()
                .messages({
                    'string.alphanum': `Your last name can only contain alpha-numeric characters`,
                    'string.empty': `A last name is required`,
                    'string.min': `Your last name has to be at least 1 character in length`,
                    'string.max': `Your last name can not exceed 30 characters in length`,
                    'string.required': `A last name is required`
                }),
            username: Joi.string()
                .alphanum()
                .min(3)
                .max(10)
                .required()
                .messages({
                    'string.alphanum': `Your username can only contain alpha-numeric characters`,
                    'string.empty': `A username is required`,
                    'string.min': `Your username has to be at least 3 characters in length`,
                    'string.max': `Your username can not exceed 10 characters in length`,
                    'string.required': `A username is required`
                }),
        })
        return schema.validate(data)
    }
    loginValidation(data) {
        // joi schema
        const schema = Joi.object({
            password: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                .min(5)
                .required()
                .messages({
                    'string.pattern': `Password does not match pattern`,
                    'string.empty': `A password is required`,
                    'string.min': `Your password has to be at least 5 characters in length`,
                    'string.required': `A password is required`
                }),
            email: Joi.string()
                .email()
                .min(1)
                .required()
                .messages({
                    'string.email': `Email must be of type email`,
                    'string.empty': `An email is required`,
                    'string.min': `Your email has to be at least 1 character in length`,
                    'string.required': `A email is required`
                })
        })
        return schema.validate(data)
    }
    // roles
    roleCreationValidation(data) {
        const schema = Joi.object({
            role_name: Joi.string()
                .min(1)
                .max(10)
                .required()
                .messages({
                    'string.empty': `A name is required`,
                    'string.min': `Role name must include 1 character`,
                    'string.max': `Role name must not exceede 10 characters`,
                    'string.required': `A name is required`
            })
            // roleValue: Joi.number()
            //     .required()
            //     .min(0)
            //     .max(1099511627776),
            // color: Joi.string()
            //     .pattern(/^#[a-fA-F0-9]{6}$/)
            //     .min(0)
            //     .required()
            //     .messages({
            //         'string.empty': `A color is required`,
            //         'string.min': `A role must include 1 character`,
            //         'string.required': `A name is required`
            // }),
            // troop_id: Joi.string()
            //     .required()
            //     .min(36)
            //     .max(36),
        })
        schema.validate(data)
    }
    // troop id validator 
    getRolesValidation(data) {
        // data is just the troop id
        const schema = Joi.object({
            troop_id: Joi.string()
                .required()
                .min(36)
                .max(36)
                .messages({
                    'string.empty': `A troop_id is required`,
                    'string.min': `troop_id must be 36 characters long`,
                    'string.max': `troop_id must be 36 characters long`,
                    'string.required': `troop_id is required`,
                })
        })

        return schema.validate(data)
    }
}
function registrationValidation(data) {
    // joi schema
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .min(1)
            .required()
            .messages({
                'string.email': `Email must be of type email`,
                'string.empty': `An email is required`,
                'string.min': `Your email has to be at least 1 character in length`,
                'string.required': `A email is required`
            }),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .min(5)
            .required()
            .messages({
                'string.pattern': `Your password does not match pattern`,
                'string.empty': `A password is required`,
                'string.min': `Your password has to be at least 5 characters in length`,
                'string.required': `A password is required`
            }),
        firstName: Joi.string()
            .alphanum()
            .min(1)
            .max(30)
            .required()
            .messages({
                'string.alphanum': `Your first name can only contain alpha-numeric characters`,
                'string.empty': `A first name is required`,
                'string.min': `Your first name has to be at least 1 character in length`,
                'string.max': `Your first name can not exceed 30 characters in length`,
                'string.required': `A first name is required`
            }),
        lastName: Joi.string()
            .alphanum()
            .min(1)
            .max(30)
            .required()
            .messages({
                'string.alphanum': `Your last name can only contain alpha-numeric characters`,
                'string.empty': `A last name is required`,
                'string.min': `Your last name has to be at least 1 character in length`,
                'string.max': `Your last name can not exceed 30 characters in length`,
                'string.required': `A last name is required`
            }),
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(10)
            .required()
            .messages({
                'string.alphanum': `Your username can only contain alpha-numeric characters`,
                'string.empty': `A username is required`,
                'string.min': `Your username has to be at least 3 characters in length`,
                'string.max': `Your username can not exceed 10 characters in length`,
                'string.required': `A username is required`
            }),
    })
    return schema.validate(data)
}
function loginValidation(data) {
    // joi schema
    const schema = Joi.object({
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .min(5)
            .required()
            .messages({
                'string.pattern': `Password does not match pattern`,
                'string.empty': `A password is required`,
                'string.min': `Your password has to be at least 5 characters in length`,
                'string.required': `A password is required`
            }),
        email: Joi.string()
            .email()
            .min(1)
            .required()
            .messages({
                'string.email': `Email must be of type email`,
                'string.empty': `An email is required`,
                'string.min': `Your email has to be at least 1 character in length`,
                'string.required': `A email is required`
            })
    })
    return schema.validate(data)
}
function roleCreationValidation(data) {
    const schema = Joi.object({
        role_name: Joi.string()
            .min(1)
            .max(36)
            .required()
            .messages({
                'string.empty': `A name is required`,
                'string.min': `Role name must include 1 character`,
                'string.max': `Role name must not exceed 36 characters`,
                'string.required': `A name is required`
        }),
        role_value: Joi.number()
            .required()
            .min(0)
            .max(1099511627776),
        color: Joi.string()
            .pattern(new RegExp('^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$'))
            .max(7)
            .min(4)
            .required()
            .messages({
                'string.empty': `A color is required`,
                'string.max': `Hex value must be 3 or 6 characters in length not including the #`,
                'string.min': `Hex value must be 3 or 6 characters in length not including the #`,
                'string.required': `A color is required`,
                'string.pattern.base': `Role color must be a valid hex combo`
        }),
        troop_id: Joi.string()
            .required()
            .min(36)
            .max(36)
            .messages({
                'string.empty': `A troop_id is required`,
                'string.min': `troop_id must be 36 characters long`,
                'string.max': `troop_id must be 36 characters long`,
                'string.required': `troop_id is required`,
            })
    })
    return schema.validate(data)
}

//legacy
module.exports.registrationValidation = registrationValidation
module.exports.loginValidation = loginValidation
module.exports.roleCreationValidation = roleCreationValidation
// modern which exports as validation class (old methods are supported too)
module.exports.Validation = Validation