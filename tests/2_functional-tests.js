/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
           assert.equal(res.status, 200);
           assert.property(res.body.stockData, 'stock');
           assert.property(res.body.stockData, 'price');
           assert.property(res.body.stockData, 'likes');
           assert.equal(res.body.stockData.stock, 'GOOG')
          //complete this one too
          
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog', like: true})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body.stockData, 'stock');
            assert.property(res.body.stockData, 'price');
            assert.property(res.body.stockData, 'likes');
            assert.equal(res.body.stockData.stock, 'GOOG');
            assert.equal(res.body.stockData.likes, '1');
          
            done();
          })
          
        
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog', like: true})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body.stockData, 'stock');
            assert.property(res.body.stockData, 'price');
            assert.property(res.body.stockData, 'likes');
            assert.equal(res.body.stockData.stock, 'GOOG');
            assert.equal(res.body.stockData.likes, '1');
          
            done();
          })
        
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['goog', 'aapl']})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body.stockData[0], 'stock');
            assert.property(res.body.stockData[0], 'price');
            assert.property(res.body.stockData[0], 'rel_likes');
            assert.equal(res.body.stockData[0].stock, 'GOOG');
            assert.property(res.body.stockData[1], 'stock');
            assert.property(res.body.stockData[1], 'price');
            assert.property(res.body.stockData[1], 'rel_likes');
            assert.equal(res.body.stockData[1].stock, 'AAPL');
          
            done();
          })
        
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['goog', 'aapl'], like: true})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body.stockData[0], 'stock');
            assert.property(res.body.stockData[0], 'price');
            assert.property(res.body.stockData[0], 'rel_likes');
            assert.equal(res.body.stockData[0].stock, 'GOOG');
            assert.equal(res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes, '0')
            assert.property(res.body.stockData[1], 'stock');
            assert.property(res.body.stockData[1], 'price');
            assert.property(res.body.stockData[1], 'rel_likes');
            assert.equal(res.body.stockData[1].stock, 'AAPL');
          
            done();
          })
      
      });
      
    });

});
