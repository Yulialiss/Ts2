// findByIdAndDelete - метод який видаляє 
// req.params.id - спосіб доступу через ід в express
// res -response обєкт надісланий клієнтоу у сервер
// req- reques обєкт відповідь сервер клієнту
// asyn фсиехронна функція
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');


const APP_DB_NAME = 'mongodb://localhost/Products_tovaru';
mongoose.connect(APP_DB_NAME);

const app = express();
app.use(bodyParser.json())


app.listen(3000, () => {
    console.log('Сервер працює на порту 3000');
  });

const PASSWORD = 'mysecretpassword';

const authenticate = (req, res, next) => {
    const password = req.headers['x-password'];
  
    if (!password || password !== PASSWORD) {
        return res.status(403).json({ message: 'Невірний пароль' });
      }
      next(); 
  };

  const  ProductSchema = {
    name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      manufacturer: {
        type: String,
        required: false
      }
    }
    const Product = mongoose.model('Product', new mongoose.Schema(ProductSchema));

const products = [{
    id: 1,
    name: 'Молоко',
    price: '345',
    manufacturer:'Корова',
}];

// const getProducts = async (req, res) => {
//     const products = await Product.find();
//     res.json(products);
// }

const deleteProduct = async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return res.status(404).json({ message: "Продукт не знайдено" });
    }
    res.json({ message: "Продукт видалено" });
}


const addProduct = async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
}


const getProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: "Продукт не знайдено" });
    }
    res.json(product);
};


app.get('/product/:id', authenticate, getProduct);
app.get('/product', authenticate, getProduct);
app.post('/product', authenticate, addProduct);
app.delete('/product/:id', authenticate, deleteProduct);


