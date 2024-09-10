const db = require('../../utils/connect_db')

exports.get_notifications = async (req, res, next) => {
    var sql = `SELECT n.id as notification_id,i.id as item_id, n.created_at as created_at, n.is_active as is_active, i.name as name, i.quantity, c.name as category
                FROM notifications n
                JOIN notifications_items ni ON n.id=ni.notification_id
                JOIN items i ON i.id=ni.item_id
                JOIN categories c ON i.category_id=c.id
                order by n.id`;
    db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.status(200).send(results)
    })
}