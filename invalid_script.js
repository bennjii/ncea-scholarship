import * as tf from '@tensorflow/tfjs';

const model = await tf.loadLayersModel('./model__/model.json');

const rows = [
    ["Beds", "Land Area", "Living Area", "grade", "garage", "long","lat"],
    ["4.0", "187.0", "131.6", "1", "1", "174.873123", "-36.874691"]
];

let csvContent = "data:text/csv;charset=utf-8," 
    + rows.map(e => e.join(",")).join("\n");
    
var encodedUri = encodeURI(csvContent);

const prediction = model.predict(encodedUri);
console.log(prediction);