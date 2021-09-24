# 📝 Goals:
- Create a function that can take a file/URL for a csv file and import into a database
- the function should be able to filter out the data to remove any orders that dont have customersid


## 🖥️ How to use
node batchInsertFunction
or
node batchInsertFunctionv2.0.js

## 🛠️ Technologies/Libraries used
- Node JS
- PostgreSQL
- fast-csv
- pg-format


## 📐 Planning
I broke down the function into 4 main components 
1. import the data 
2. format the data
3. filter the data to remove any rows that had unmatched customerId
4. insert function 
***

### 🚧 My experience and key learning:
- The first method I used to implement the function is the least scalable. It involves parsing the data then formating before using a forEach loop to have an INSERT statement used for every row. The issue with this strategy is predominantly scalabiltiy. With every INSERT statement, there is overhead with regards to postgreSQL, and with larger data files/rows this can lead to significant slow down. The advantage to this approach was the use of WHERE EXISTS to have a conditional statement be part of the filter

- My original approach to creating the function was inefficient. The original premise I had was to create a object that I could reference whenever I needed to use an INSERT function. This startegy was what I implmented when I created a full stack application as other functional types could be created (such as SELECT or DELETE) and would follow  DRY 

- I also timeboxed myself and limited myself to 2 hours. The version 1 is the result of this.
- I also attempted to manually parse the rows, however, this lead to difficulties with "/r" and "/n"
  - As a result, I used a library - fast-csv - with this i could use csv.parse() to format the data 

V2
- For the second version I utilized a different strategy to bulk enter the data. 
- I first, created an asynchronous function to get the customersId from the customers table
- Then, i filtered the data where if the data had a matching ID it would be pushed into a new arrray ( filteredData)
- As a result, i could use 1 insert statement and all the values would be insert through the %L with the pg-format library
- The advantage of this is only 1 Insert is used and as a result there is less overhead from PostgreSQL
- This puts the difficulty into the parsing to occur before the insert statement which increases its complexity
- V2 definitely took longer to work out.
  
### 🧪 Testing 
In terms of testing to check if the function was working, I created a databse with the db schema listed. From here , I inserted data into the customers table with corresponding ID along with a sampledata. 
- In the sample data there was different quantity and customerId to make it more easily identifiable
- smaller files were used first to ensure that the functions were performing as intended. After each function i manually checked in psql CLI
- After this I implmenetd a  console.time('manyinsert') and  console.timeEnd('manyinsert') to log the amount of time it took for the function to perform
- Without very large files however, it is difficult to see the differences between the original implementation and v2 ( v1: 12.468 vs v2: 18.247s for 37 rows of data)
- Certain edge cases weren't considered e.g if the data had escape marks or if there were blanks.



### 📚 Challenges:
- importing a file from a URL
  - As I didn't have access/any sample URL's with the correct CSV files it was difficult
  - instead I created a local file and used this instead
  - in v2.0 i used a http protocol with a GET request to get the .csv file. This, however, may not be sufficient as the formatting might not match /require the same formating as the local csv file i used as a template 
- Asynchronous functions needed to be used to prevent race conditions
- One method within postgreSQL was to use an INSERT and a WHERE clause for the condition. However, the WHERE clause was unable to utilize sub-queries which made it difficult to implment a condition( the customerID had to exist)
- Also attempted to utilize the COPY statement which is exclusive to postreSQL. The issue, however, is it is only able to copy the entire data over without filters
  - to use this i would need to follow similar steps to v2 where i would need to filter/parse the data before the copy is used.