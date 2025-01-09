import Papa from 'papaparse';

const fs = require('fs');
const papa = require('papaparse');
const file = fs.createReadStream('n_x_data.csv');
var numColRow;
var uData; //uData = math.matrix([[]])
var vData;

papa.parse(file, {
    worker: true,
    step: function(result) {
        numColRow = result;
    },
    complete: function(results, file){
        console.log('complete');
    }
});


