const db = require('./db/db')
const fs = require('fs')
const data = fs.readFileSync('./sampledata.csv', 'utf8')
const csv = require('fast-csv')
const format = require('pg-format')
const http = require("http")
const file = fs.createWriteStream("data.csv")

http.get("http://www.example.com/test.csv", response => {
  response.pipe(file);
});



// 1.import CSV file from ULR
let unfilteredData = []
let id = []
let filteredData = []
fs.createReadStream('sampledata.csv')
  .pipe(csv.parse())
  .on('data', function (data) {
    unfilteredData.push(data)
  })
  .on('end', async function () {
    // we remove the headers
    unfilteredData.shift()
    console.time('manyinsert')
    let validId = await db.query('SELECT customerid FROM customers', (error, results) => {
      if (error) {
        throw error
      }
      results.rows.forEach(row => { id.push(row.customerid) })

      for (i = 0; i < unfilteredData.length; i++) {
        if (id.includes(unfilteredData[i][1])) {
          filteredData.push(unfilteredData[i])
        } else {
          console.log('invalidID')
        }
      }
    })



    const sql = `
    INSERT INTO orders(orderid, customerid, item, quantity)
    VALUES  %L
    `
    db.connect((err, client, done) => {
      if (err) throw err;

      try {
        client.query(format(sql, filteredData));
        console.timeEnd('manyinsert')
      } finally {
        done();
      }
    });
  });

