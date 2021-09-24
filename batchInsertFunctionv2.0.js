const db = require('./db/db')
const fs = require('fs')
const data = fs.readFileSync('./sampledata.csv', 'utf8')
const csv = require('fast-csv')
const format = require('pg-format')



// 1.import CSV file from ULR
let filteredData = []
let id = []

fs.createReadStream('sampledata.csv')
  .pipe(csv.parse())
  .on('data', function (data) {
    filteredData.push(data)
    id.push(data[1])

  })
  .on('end', function () {
    // we remove the headers
    filteredData.shift()
    id.shift()
    const sql = `
    INSERT INTO orders(orderid, customerid, item, quantity)
    SELECT  %L
    WHERE EXISTS ( SELECT customerid FROM customers WHERE customers.customerid = %L)
    `

    db.connect((err, client, done) => {
      if (err) throw err;

      try {
        console.log(id)
        console.log(filteredData)
        client.query(format(sql, filteredData, id));
      } finally {
        done();
      }
    });
  });


