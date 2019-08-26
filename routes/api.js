/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const mongoose = require('mongoose');
var mongodb = require('mongodb');
const lookup = require('yahoo-stocks').lookup;
const history = require('yahoo-stocks').history;
const address = require('address');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useFindAndModify: false });
 //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  
  const Schema = new mongoose.Schema({
    stock: String,
    price: String,
    likes: {type: Number, default: 0},
    ip: Array
  });
  
  let stockSchema = mongoose.model('stockSchema', Schema);

  app.route('/api/stock-prices')
    .get(function (req, res){
    
    let stockCompare = req.query.stock
    let stock = req.query.stock;
    let like = req.query.like;
    let increase;
    let ipAddress;
    let arr = [];
    let likeStorage;  
        
    async function findStock(item) {
      try {
        
        if (like) {
          increase = 1;
          ipAddress = address.ip();
        } else {
          increase = 0;
        }  
        
        let yahooStock = await lookup(item);
        
        let stockUpdate = await stockSchema.findOneAndUpdate({stock: `${yahooStock.symbol}`}, {
          stock: `${yahooStock.symbol}`,
          price: `${yahooStock.currentPrice}`
        }, {upsert: true})
        
        let likeUpdate = await stockSchema.findOneAndUpdate({stock: `${yahooStock.symbol}`, ip: {$nin: `${ipAddress}`}}, {
          $inc: {likes: increase},
          $push: {ip: `${ipAddress}`}
        }, {upsert: false});
        
        let getStock = await stockSchema.find({stock: `${yahooStock.symbol}`})
        
        if (typeof(stockCompare) == 'object') {
          arr.push({stock: `${getStock[0].stock}`, price: `${getStock[0].price}`, rel_likes: `${getStock[0].likes}`})
          if (arr.length == 2) {
            return res.json({stockData: [{stock: `${arr[0].stock}`, price: `${arr[0].price}`, rel_likes: (arr[0].rel_likes - arr[1].rel_likes)}, {stock: `${arr[1].stock}`, price: `${arr[1].price}`, rel_likes: (arr[1].rel_likes - arr[0].rel_likes)}]})
          }
        } else {
          return res.json({stockData: {stock: `${getStock[0].stock}`, price: `${getStock[0].price}`, likes: `${getStock[0].likes}`}})

        }
        
        
      } catch (err) {
        console.log(err)
      }
    }
    
    async function compareStock() {
      for (const item of stockCompare) {
        await findStock(item)
      }
    }
    
    if (typeof(stockCompare) == 'object') {
      stockCompare = stockCompare.map((x) => x.toUpperCase());
      compareStock();
    } else {
      stock = stock.toUpperCase();
      findStock(stock)
    }
    
    
    
    });
    
};
