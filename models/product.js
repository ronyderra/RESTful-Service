const Joi = require("joi");

class Product {

    constructor(id, name, price, stock) {
        if (id !== undefined) this.id = id;
        if (name !== undefined) this.name = name;
        if (price !== undefined) this.price = price;
        if (stock !== undefined) this.stock = stock;
    }

    validatePost() {
        const schema = {
            id: Joi.optional(),
            name: Joi.string().required().min(3).max(100),
            price: Joi.number().required().min(0).max(1000),
            stock: Joi.number().required().min(0).max(10000)
        };
        const result = Joi.validate(this, schema, { abortEarly: false }); // { abortEarly: false } = Return all errors
        return result.error ? result.error.details.map(err => err.message) : null; // null = no errors
    }

    validatePut() {
        const schema = {
            id: Joi.number().required().min(0),
            name: Joi.string().required().min(3).max(100),
            price: Joi.number().required().min(0).max(1000),
            stock: Joi.number().required().min(0).max(10000)
        };
        const result = Joi.validate(this, schema, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }

    validatePatch() {
        const schema = {
            id: Joi.number().required().min(0),
            name: Joi.string().min(3).max(100),
            price: Joi.number().min(0).max(1000),
            stock: Joi.number().min(0).max(10000)
        };
        const result = Joi.validate(this, schema, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }
}

module.exports = Product;
