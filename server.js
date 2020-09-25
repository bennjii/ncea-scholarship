const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const fs = require('fs').promises;

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')));

//Create HTTP server and listen on port 3000 for requests
app.get('/predict', async function (req, res) {
  let save = req.query.info.map(Number);
  console.log(save)

  let response = await predict(save);
  res.end(await response.toString());

  console.log("Prediction Made and Sent!");
});

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

/*  Prediction  */
async function predict(inputs) {
    const model = await tf.loadLayersModel('file://model/model.json');

    const rows = tf.tensor([
        inputs
    ]);

    // Convert to appropriate file type unit (float32)
    tf.cast(rows, 'float32');

    rows.print();
    
    const prediction = model.predict(rows);
    const prediction_val = prediction.dataSync()[0];

    console.log(`\nPREDICTION: ${prediction_val}`);
    return prediction_val;
}

// predict([3.0, 204.0, 104.6, 1, 1, 174.873123, -36.874691]).then((result) => {
//   console.log(result);
// }).catch((err) => {
//   console.log(err);
// });