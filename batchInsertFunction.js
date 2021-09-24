const db = require('./db/db')
const fs = require('fs')
const data = fs.readFileSync('./sampledata.csv', 'utf8')
const csv = require('fast-csv')
// 1.import CSV file from ULR
let filteredData = []

fs.createReadStream('sampledata.csv')
  .pipe(csv.parse())
  .on('data', (data) => filteredData.push(data))
  .on('end', function () {
    // we remove the headers
    filteredData.shift()
    const sql = `
    INSERT INTO orders(orderid, customerid, item, quantity)
    VALUES($1, $2, $3, $4)
    `
    db.connect((err, client, done) => {
      if (err) throw err;

      try {
        filteredData.forEach(row => {
          client.query(sql, row, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              console.log("data transfer complete");
            }
          });
        });

      } finally {
        done();
      }
    });
  });

// 

// Data.insert(filteredData[0]['orderID'], filteredData[0]['customerId'], filteredData[0]['item'], filteredData[0]['quantity'])

const Data = {
  insert(orderid, customerid, item, quantity) {
    const sql = `
    INSERT INTO orders(orderid, customerid, item, quantity)
    VALUES($1, $2, $3, $4)
    `

    return db.query(sql, [orderid, customerid, item, quantity])
      .then(dbResponse => {
        return dbResponse.rows[0]
      })
  }
}


// Data.insert('test1', 'test1', '1', 5)


