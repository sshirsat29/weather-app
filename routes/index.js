var express = require('express')
var router = express.Router();

const apiKey = '761e5114583f1460afc0fdd1360887ed';
var request = require('request')
var http = require('http')
var path = require('path')
//get home
router.get('/', ensureAuthenticated, function(req, res){
    res.render('index')

});

router.post('/', ensureAuthenticated, function(req, res){
        let city = req.body.city;
        let country = req.body.country;
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${apiKey}`

        // here comes the request usage from node-weather
        request(url, function(err, response, body){
            if(err){
                res.render('index', {weather:null, error:'Error, try again'})
            } else {
                let weather = JSON.parse(body)
                console.log(weather.weather[0].description)
                if(weather.main==undefined){
                    res.render('index',{weather:null, error:'Error, no data found'})
                } else {
                    let message = `The weather in ${weather.name} of country ${weather.sys.country} is ${weather.main.temp} degrees`
                    let description = weather.weather[0].description;
                    let icon = weather.weather[0].icon;
                    let datam = `Temp in city ${weather.name} is ${weather.main.temp} `+`Humidity ${weather.main.humidity}% <br>`
//                    +`<h1> Pressure: ${weather.main.pressure}</h1>`
                    //console.log(weather.description);
                    res.render('index',{weather:weather, description:description,icon:icon, error:null})}
                }

            });
       // console.log(req.body.city)

    //res.render('index')

});


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_msg','You are not signed in');
        res.redirect('/users/login');
    }
}

module.exports = router;
