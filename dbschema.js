CREATE TABLE Customers(
  customerId varchar,
  firstname varchar,
  lastName varchar)
  ;

  CREATE TABLE Orders(
    orderID varchar,
    customerID varchar,
    item varchar,
    quantity INT
  );