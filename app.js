const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productsRouter = require('./api/routes/products')
const ordersRouter = require('./api/routes/orders')
const usersRouter = require('./api/routes/user')

mongoose.connect('mongodb+srv://user:Raouf13579@cluster0.rqc3d.mongodb.net/nodeShop', {
    //useMongoClient = true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
})


//for handling requests
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,GET,DELETE');
        return res.status(200).json({})
    }
    next();
})

app.use('/products', productsRouter)
app.use('/orders', ordersRouter)
app.use('/user', usersRouter)


app.use((req, res, next) => {
    const error = new Error('Page Not Found !!');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app;