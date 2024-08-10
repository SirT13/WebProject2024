const mysql = require('mysql');
const fs = require('fs');

// Configure MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '9de07afe9b',
  database: 'civilsecdb'
});

// Connect to MySQL
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the database!');
});

// Read JSON file
const data = JSON.parse(fs.readFileSync('C:\\Users\\mtzan\\WebProject2024\\initObj.txt', 'utf8'));
let items = data.items


const insertData = (items) => {
    items.forEach(entry => {
      entry['quantity'] = 0;
      entry['is_available'] = 0;
      entry.details = JSON.stringify(entry.details)
      const query = 'INSERT INTO warehouse (id, name, category, quantity, is_available, details) VALUES (?,?,?,?,?,?)';
      connection.query(query, [entry.id, entry.name, entry.category, entry.quantity, entry.is_available, entry.details], (err, result) => {
        if (err) {
          console.error('Failed to insert data: ' + err.message);
        } else {
          console.log('Inserted data with ID:', result.insertId);
        }
      });
    console.log(entry)
    });
  };


  insertData(items);

// Close connection
connection.end();
