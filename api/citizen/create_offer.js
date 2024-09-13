const db = require('../../utils/connect_db');

exports.create_offer = async (req, res, next) => {
    var citizen_id = req.user.user_id;
    var items = req.body.items;
    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    var sql = 'INSERT INTO tasks (citizen_id,item_id,quantity,status,type,date_submited) VALUES (?,?,?,?,?,?)';

    // Track how many items have been processed
    let itemsProcessed = 0;

    // Check if there are no items to process (send response early)
    if (items.length === 0) {
        return res.status(400).send("No items provided!");
    }

    items.forEach(item => {
        const values = [citizen_id, item.item_id, item.quantity, 'not_assigned', 'offer', currentDateTime];

        db.query(sql, values, (err) => {
            if (err) {
                return next(err);
            }
            // Increment the counter for processed items
            itemsProcessed++;
            // Once all items are processed, send the response
            if (itemsProcessed === items.length) {
                res.status(200).send("Tasks created successfully!");
            }
        });
    });
};
