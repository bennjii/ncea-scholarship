const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const fs = require('fs').promises;

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

//Create HTTP server and listen on port 3000 for requests
const server =  http.createServer((req, res) => {
  //console.log(req);

  if (req.method === 'POST') {
    let save = ''
    req.on('data', chunk => {
      console.log(JSON.parse(chunk));
      save = JSON.parse(chunk).info;
    });

    req.on('end', async () => {
      let response = await predict(save);
      res.end(await response.toString());

      console.log("Prediction Made and Sent!");
    });

  }else{
    fs.readFile(__dirname + "/index.html")
    .then(contents => {
        fs.readFile(__dirname + "/scripts/script.js").then(contents2 => {
          fs.readFile(__dirname + "/css/main.css").then(contents3 => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents.toString().replace("MAKE_JS", contents2.toString()).replace("MAKE_CSS", contents3.toString()));
        });
      });
    });
  }
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

predict([3.0, 204.0, 104.6, 1, 1, 174.873123, -36.874691]).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});

/*
  let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
  var encodedUri = encodeURI(csvContent);

  
    //console.log("\n\n\n---------------------   ROWS:   ---------------------");
    //const rows = ["4.0", "187.0", "131.6", "1", "1", "174.873123", "-36.874691"]; 
    //            ["Beds", "Land Area", "Living Area", "grade", "garage", "long","lat"],

    // const rows = tf.tensor([
    //   [4.0, 187.0, 131.6, 1, 1, 174.873123, -36.874691]
    // ]);
    //rows.print();
    //console.log(rows.shape);
    //console.log("----------------------------------------------------\n\n\n");

*/