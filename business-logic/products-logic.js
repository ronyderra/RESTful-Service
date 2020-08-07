const dal = require("../data-access-layer/dal");

// Get all products: 
async function getAllProductsAsync() {
    // const sql = "SELECT ProductID as id, ProductName as name, UnitPrice as price, UnitsInStock as stock FROM Products";

    // const sql = `
    // SELECT ProductID as id, ProductName as name, UnitPrice as Price, UnitsInStock as Stock, categoryName
    // FROM Products JOIN Categories
    // ON Products.CategoryID = Categories.CategoryID
    // `;

    const sql = `
    SELECT ProductID as id, ProductName as name, UnitPrice as Price, 
           UnitsInStock as Stock, categoryName, companyName
    FROM Products JOIN Categories
    ON Products.CategoryID = Categories.CategoryID
    JOIN Suppliers
    ON Products.SupplierID = Suppliers.SupplierID
    `;

    const products = await dal.executeAsync(sql);
    return products;
}

// Get one product: 
async function getOneProductAsync(id) {
    // const sql = `SELECT ProductID as id, ProductName as name, UnitPrice as price, UnitsInStock as stock FROM Products WHERE ProductID = ${id}`;
    const sql = `
    SELECT ProductID as id, ProductName as name, UnitPrice as Price, UnitsInStock as Stock, categoryName
    FROM Products JOIN Categories
    ON Products.CategoryID = Categories.CategoryID
    WHERE ProductID = ${id}
    `;
    const products = await dal.executeAsync(sql);
    return products[0];
}

// Add new Product: 
async function addProductAsync(product) {
    const sql = `INSERT INTO Products(ProductName, UnitPrice, UnitsInStock) VALUES('${product.name}', ${product.price}, ${product.stock})`;
    const info = await dal.executeAsync(sql); // info is an information object regarding the current operation
    product.id = info.insertId;
    return product;
}

// Update existing product: 
async function updateFullProductAsync(product) {
    const sql = `UPDATE Products SET ProductName = '${product.name}', UnitPrice = ${product.price}, 
    UnitsInStock = ${product.stock} WHERE ProductID = ${product.id}`;
    const info = await dal.executeAsync(sql);

    if(info.affectedRows) { // if there are affected rows - product has been found to be updated.
        return product;
    }

    return null; // no affected rows. no such product.

    // return info.affectedRows === 0 ? null : product;
}

async function updatePartialProductAsync(product) {
    let sql = "UPDATE Products SET ";
    
    if(product.name !== undefined) {
        sql += `ProductName = '${product.name}',`;
    }

    if(product.price !== undefined) {
        sql += `UnitPrice = ${product.price},`;
    }

    if(product.stock !== undefined) {
        sql += `UnitsInStock = ${product.stock},`;
    }

    sql = sql.substr(0, sql.length - 1); //Remove last comma

    sql += ` WHERE ProductID = ${product.id}`;

    const info = await dal.executeAsync(sql);

    if(info.affectedRows) { // if there are affected rows - product has been found to be updated.
        return product;
    }

    return null; // no affected rows. no such product.
}

// Delete existing product: 
async function deleteProductAsync(id) {
    const sql = `DELETE FROM Products WHERE ProductID = ${id}`;
    await dal.executeAsync(sql);
}

// Get cheaper products than a max price: 
async function getCheapestProductsAsync(maxPrice) {
    const sql = `SELECT ProductID as id, ProductName as name, UnitPrice as price, UnitsInStock as stock FROM Products WHERE UnitPrice <= ${maxPrice} ORDER BY UnitPrice`;
    const products = await dal.executeAsync(sql);
    return products;
}

// Get price range products:
async function getPriceRangeProductsAsync(minPrice, maxPrice) {
    const sql = `SELECT ProductID as id, ProductName as name, UnitPrice as price, UnitsInStock as stock FROM Products WHERE UnitPrice BETWEEN ${minPrice} AND ${maxPrice} ORDER BY UnitPrice`;
    const products = await dal.executeAsync(sql);
    return products;
}

module.exports = {
    getAllProductsAsync,
    getOneProductAsync,
    addProductAsync,
    updateFullProductAsync,
    updatePartialProductAsync,
    deleteProductAsync,
    getCheapestProductsAsync,
    getPriceRangeProductsAsync
};