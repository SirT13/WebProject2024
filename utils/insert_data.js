const db = require('../utils/connect_db')

const insertData = (data) => {
    let items = data.items
    let categories = data.categories
    const sql = 'SELECT id from warehouse'
    db.query(sql,(err,result) =>  {
      const ids = result.map(row => row.id);
      items.forEach(entry => {
        if (!ids.includes(parseInt(entry.id, 10)))
        {
          const category_name = categories.find(cat => cat.id === entry.category).category_name;
          entry['quantity'] = 0;
          entry['is_available'] = 0;
          entry.details = JSON.stringify(entry.details)
          const query = 'INSERT INTO warehouse (id, name, category_id, category_name, quantity, is_available, details) VALUES (?,?,?,?,?,?,?)';
          db.query(query, [entry.id, entry.name, entry.category,category_name, entry.quantity, entry.is_available, entry.details], (err, result) => {
            if (err) {
              console.error('Failed to insert data: ' + err.message);
            } else {
              console.log('Inserted data with ID:', result.insertId);
            }
          });
        }
      });
    })
  };

  module.exports = insertData;