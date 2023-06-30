
const axios = require('axios');
const express = require('express');
const path=require('path');
const connect = require('./connect');
const yelp = require('yelp-fusion');

const app = express();

app.use(express.static(path.join(__dirname,'views')));
app.use(express.json());




var Temp;
var City;
var Weather;



//default page
app.get('/', (req, res) => {

  res.sendFile(__dirname + "/views/index.html");
})

//search weather based on latitude and longitude
app.get('/searchWeather', (req, res) => {

  var lat = req.query.lat;
  var lon = req.query.lon;

  

  const weather = `https://api.weatherbit.io/v2.0/current?key=b70306e0571a4d3e8c95351dfc35292a&lat=${lat}&lon=${lon}`;
  const yelpClient = yelp.client(yelpApiKey = '9tlruqkqpweUeu1lWmufPI-Tr5HaE1XlMCLvCyZtcliMOzlUpljrogxH9yhM6dvnIqI400VZ3EymC_Dd3zmEIdG3iUVxA5vjGHdY7f8MW81BPPNUsl3COnVjbHthZHYx');

  axios.get(weather).then((response) => {
    Temp = response.data.data[0].app_temp;
    City = response.data.data[0].city_name;
    Weather = response.data.data[0].weather.description;

    yelpClient.search({
      latitude: lat,
      longitude: lon,
      radius: 5000, // 1km radius 
      limit: 10, // Number of restaurants 
    })
    .then((yelpResponse) => {
      const restaurants = yelpResponse.jsonBody.businesses;
      let restaurantTable = '<br><div class="table-container"><table><tr><th>Restaurant</th><th>Address</th><th>Picture</th></tr>';

      restaurants.forEach((restaurant) => {
          const name = restaurant.name;
          const address = restaurant.location.address1;
          const picture = restaurant.image_url;

        restaurantTable += `<tr><td>${name}</td><td>${address}</td><td><img src="${picture}" alt="${name}" width="100" height="100"></td></tr>`;
      });

      restaurantTable += '</table>';
    // Woei Lee write ur code here, use another axios to get restaurant by using latitude and longitude, 
    // after that go below add <td>${ur variable name}</td> below line 84, and wrap all of these code from line 47 -98 inside ur axios function
    

      const result = `

      <style>
        .table-container {
          display: flex;
          justify-content: center;
        }

        table {
          border-collapse: collapse;
        }

        th, td {
          border: 1px solid black;
          padding: 8px;
        }

        th {
          background-color: #f2f2f2;
        }
      </style>

      <div class="table-container">
        <table>
          <tr>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Temperature</th>
            <th>City</th>
            <th>Current Weather</th>
          </tr>
          <tr>
            <td>${lat}</td>
            <td>${lon}</td>
            <td>${Temp}</td>
            <td>${City}</td>
            <td>${Weather}</td>

          </tr>
        </table>
      </div>

      ${restaurantTable}
    `;


  
      res.send(result);
      })
    .catch((yelpError) => {
      console.error(yelpError);
      res.status(500).send('Internal Server Error');
    });
   
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Internal Server Error');
  });


});
  



//add weather using postman
app.post('/addWeather', (req, res) => {


    const weather = {
      "longitude" : req.body.longitude,
      "latitude" : req.body.latitude,
      "city" : req.body.city,
      "temp" : req.body.temp,
      "weather" : req.body.weather,
      "restaurant" : req.body.restaurant,
    };
    
    weatherValue = new connect ({
      Longitude : weather.longitude,
      Latitude : weather.latitude,
      City : weather.city,
      Temp : weather.temp,
      Weather : weather.weather,
      Restaurant : weather.restaurant,
    });
  
  
  weatherValue.save().then(result=> {
      console.log("Success" + result);
  })
  
  .catch (error=> {
      console.log("Error" + error);
  }
  
  );


  res.send("Added success");
})




//delete all 
app.delete('/deleteAll', (req ,res) => {
    connect.deleteMany().then(res=>{
        console.log("Success deleting all");
    })

    res.send("Delete All Success");
});

//delete by city name
app.delete('/delete', (req ,res) => {
  var city = req.query.city;
  
  connect.deleteOne({City : city }).then(res=>{
      console.log("Success");
  })

  res.send(`<h1>City : ${city} Delete Success</h1>`);
});



// update by city name
app.get('/update', (req ,res) => {

  var city = req.query.city;
  var lat = req.query.lat;
  var lon = req.query.lon;

  const weather = `https://api.weatherbit.io/v2.0/current?key=b70306e0571a4d3e8c95351dfc35292a&lat=${lat}&lon=${lon}`;

  axios.get(weather).then((response) => {
    var temp = response.data.data[0].app_temp;
    var city = response.data.data[0].city_name;
    var weather = response.data.data[0].weather.description;

    connect.updateOne(
      //condition
      {
        City : city
      },
      //new value
      {
        Temp : temp,
        City : city,
        Weather : weather
      }
      
      
      ).then(res=>{
        console.log("Success update");
    })

    res.send('<h1>Update Success</h1>');
   
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Internal Server Error');
  });


 

});


app.listen(5000);
