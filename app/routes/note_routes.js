/* routes/note_routes.js */
const Promise = require('bluebird');
const request = require('request');
const cheerio = require('cheerio');

function findIn(url) {
    var username = "bogo",
        password = "matkhau",
        auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
    return new Promise(resolve => {
        // request( {url, headers : { "Authorization" : auth }} ,  function(error, response, html){
        request( url ,  function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                resolve ($('body').text());
            }
            resolve (error);
        });
    });
}

module.exports = function (app, db) {

    app.post('/search', (req, res) => {
        try {
            var arrFunctions = [];
            var keyword = req.body.keyword;
            keyword = keyword.replace(/ /g,'-').toLowerCase();
            arrFunctions.push(findIn('http://couponmarathon.com/searchFromApi?keyword=' + keyword));
            arrFunctions.push(findIn('http://CouponChecked.com/searchFromApi?keyword=' + keyword));
            Promise.all(arrFunctions).then(function (results) {
                res.send(results);
            }).catch(function(error){
                res.send(error);
                console.log('error 1');
                console.log(error);
            });
        } catch (error) {
            console.log(error);
            res.send('Catch error 2');
        }
    });

};