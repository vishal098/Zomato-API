const zomato = require("zomato")

const express = require("express")

const morgan = require('morgan')

const app = express()

const body_parser = require('body-parser')

const router = express.Router()

app.use(express.json())

app.set('view engine', 'ejs')

app.use(body_parser.urlencoded({ extended: true }))

app.use(morgan("div"))

var client = zomato.createClient({
    userKey: '016f35bdf532564d9cbec43b161fde8b', //as obtained from [Zomato API](https://developers.zomato.com/apis)
});


app.get('/category/:id', (req, res) => {
    let id = req.params.id
    client.getCategories(null, function(err, result) {
        result = JSON.parse(result)
        console.log(result);
        if (!err) {
            res.send(result.categories[id - 1].categories);
        } else {
            console.log(err);
        }

    });
})
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/zomato.html')
})

app.post('/search', (req, res) => {
    const city1 = req.body.city
    console.log(city1);

    client.getLocations({
        query: city1,
        count: 5 // suggestion for location name
    }, function(err, result) {
        result = JSON.parse(result)
            // console.log(result);
        let lat = result.location_suggestions[0].latitude //latitude
        let lon = result.location_suggestions[0].longitude //longitude
        console.log(lat, lon);

        if (!err) {
            client.getGeocode({
                lat: lat,
                lon: lon
            }, function(err, result2) {
                result2 = JSON.parse(result2)
                if (!err) {
                    var all_data = result2.nearby_restaurants;
                    // console.log(all_data);
                    let details = []
                    for (i of all_data) {
                        let restaurant = {}
                        restaurant['name'] = i.restaurant.name;
                        restaurant['url'] = i.restaurant.url;
                        restaurant['location'] = i.restaurant.location.address;
                        restaurant['average_cost_for_two'] = i.restaurant.average_cost_for_two;
                        restaurant['price_range'] = i.restaurant.price_range;
                        restaurant['featured_image'] = i.restaurant.featured_image;
                        restaurant['has_online_delivery'] = i.restaurant.has_online_delivery;
                        restaurant['cuisines'] = i.restaurant.cuisines;
                        details.push(restaurant)
                    }
                    res.render('zomato2', { data: details })
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });

})


const port = 3004
app.listen(port, () => {
    console.log(`${port} post is working`);
})



//   client.getLocations({
//     query:"New Delhi", // suggestion for location name
//     // lat:"28.613939", //latitude
//     // lon:"77.209021", //longitude
//     count:"2" // number of maximum result to fetch
//     }, function(err, result){
//         result=JSON.parse(result)
//         if(!err){
//           console.log(result.location_suggestions[0].latitude);
//         }else {
//           console.log(err);
//         }
//     });