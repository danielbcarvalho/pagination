const router = require('express').Router(),
    faker = require('faker'),
    Product = require('../models/product')

router.get('/', function (req, res, next) {
    res.render('index')
})

router.get('/add-product', (req, res, next) => {
    res.render('main/add-product')
})

router.post('/add-product', function (req, res, next) {
    var product = new Product()

    product.category = req.body.category_name
    product.name = req.body.product_name
    product.price = req.body.product_price
    product.cover = faker.image.image()

    product.save(function (err) {
        if (err) throw err
        res.redirect('/add-product')
    })
})

router.get('/generate-fake-data', (req, res, next) => {
    for (let i = 0; i < 90; i++) {
        const product = new Product()

        product.category = faker.commerce.department()
        product.name = faker.commerce.productName()
        product.price = faker.commerce.price()
        product.cover = faker.image.image()

        product.save(err => {
            if (err) throw err
        })
    }
    res.redirect('/add-product')
})

router.get('/products/:page', function (req, res, next) {
    var perPage = 9
    var page = req.params.page || 1

    Product
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function (err, products) {
            Product.count().exec(function (err, count) {
                if (err) return next(err)
                res.render('main/products', {
                    products: products,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
})


module.exports = router