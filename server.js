//npm install axios
//npm install express
//npm i path

const axios = require('axios');
const express = require('express');
const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname, "views")));


// axios.get(querystr, {
//     params: {
//       latlng: `${latitude},${longitude}`,
//       key: apikey,
//     },
//   })
//     .then(response => {
      
//       address = response.data.results[0].formatted_address;
//       // Process the data as needed
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });

app.get('/', (req, res) => {

  res.sendFile(__dirname + "/views/testing.html");
}

);

app.listen(5000);

//localhost:5000