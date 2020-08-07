const express = require("express");
const productsLogic = require("../business-logic/products-logic");
const Product = require("../models/product");

const router = express.Router();

// GET all products - http://localhost:3000/api/products
router.get("/", async (request, response) => {
    try {
        const products = await productsLogic.getAllProductsAsync();
        response.json(products);
    }
    catch (err) {
        console.log(err);
        response.status(500).send(err.message);
    }
});

// GET one product - http://localhost:3000/api/products/7
router.get("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const product = await productsLogic.getOneProductAsync(id);
        if (!product) {
            response.sendStatus(404);
            return;
        }
        response.json(product);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// POST product - http://localhost:3000/api/products
router.post("/", async (request, response) => {
    try {
        const product = new Product(undefined, request.body.name, request.body.price, request.body.stock);

        // Validate user data: 
        const errors = product.validatePost();
        if(errors) {
            response.status(400).send(errors);
            return;
        }

        const addedProduct = await productsLogic.addProductAsync(product);
        response.status(201).json(addedProduct);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// PUT product - http://localhost:3000/api/products/7
router.put("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const product = new Product(id, request.body.name, request.body.price, request.body.stock);

        // Validate user data: 
        const errors = product.validatePut();
        if(errors) {
            response.status(400).send(errors);
            return;
        }

        const updatedProduct = await productsLogic.updateFullProductAsync(product);
        if (!updatedProduct) {
            response.sendStatus(404);
            return;
        }
        response.json(updatedProduct);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// PATCH product - http://localhost:3000/api/products/7
router.patch("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const product = new Product(id, request.body.name, request.body.price, request.body.stock);

        // Validate user data: 
        const errors = product.validatePatch();
        if(errors) {
            response.status(400).send(errors);
            return;
        }

        const updatedProduct = await productsLogic.updatePartialProductAsync(product);
        if (!updatedProduct) {
            response.sendStatus(404);
            return;
        }
        response.json(updatedProduct);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// DELETE product - http://localhost:3000/api/products/7
router.delete("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        await productsLogic.deleteProductAsync(id);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// GET cheaper products - http://localhost:3000/api/products/cheaper-than/35.79
router.get("/cheaper-than/:maxPrice", async (request, response) => {
    try {
        const maxPrice = +request.params.maxPrice;
        const products = await productsLogic.getCheapestProductsAsync(maxPrice);
        response.json(products);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// GET price range products - http://localhost:3000/api/products/price-range/10/20
router.get("/price-range/:minPrice/:maxPrice", async (request, response) => {
    try {
        const minPrice = +request.params.minPrice;
        const maxPrice = +request.params.maxPrice;
        const products = await productsLogic.getPriceRangeProductsAsync(minPrice, maxPrice);
        response.json(products);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;

