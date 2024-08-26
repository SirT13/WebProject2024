const db = require('../utils/connect_db')

const insertData = (data) => {
    let items = data.items
    let categories = data.categories

    const category_sql = 'SELECT id from categories'
    db.query(category_sql,(err,result) =>  {
      const category_ids = result.map(row => row.id);
      categories.forEach(entry => {
        if (!category_ids.includes(parseInt(entry.id, 10)))
        {
          console.log(categories)
          console.log(entry)
          const category_name = categories.find(cat => cat.id === entry.id).category_name;
          entry['quantity'] = 0;
          entry['is_available'] = 0;
          entry.details = JSON.stringify(entry.details)
          const cat_values = [entry.id,category_name]
          const categories_query = 'INSERT INTO categories (id, name) VALUES (?,?)';
          db.query(categories_query, cat_values, (err, result) => {
            if (err) {
              console.error('Failed to insert categories data: ' + err.message);
            } else {
              console.log('Inserted categories data with ID:', result.insertId);
            }
          });
        }
      });
    })


    const item_sql = 'SELECT id from items'
    db.query(item_sql,(err,result) =>  {
      const item_ids = result.map(row => row.id);
      items.forEach(entry => {
        if (!item_ids.includes(parseInt(entry.id, 10)))
        {
          entry['quantity'] = 0;
          entry['is_available'] = 0;
          entry.details = JSON.stringify(entry.details)
          const item_values = [entry.id, entry.name, entry.category, entry.quantity, entry.is_available, entry.details]
          const items_query = 'INSERT INTO items (id, name, category_id, quantity, is_available, details) VALUES (?,?,?,?,?,?)';

          db.query(items_query, item_values, (err, result) => {
            if (err) {
              console.error('Failed to insert item data: ' + err.message);
            } else {
              console.log('Inserted item data with ID:', result);
            }
          });
        }
      });
    })
    
  };

  module.exports = insertData;