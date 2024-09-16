const db = require('../../utils/connect_db')
const jwt = require("jsonwebtoken")

exports.get_rescuer_map_info = async (req, res, next) => {
    const userId = req.user.user_id

    const sql1 = `SELECT t.id AS task_id, i.id AS item_id, i.name AS item_name, 
                    t.quantity, t.type, t.status, t.date_submited, t.date_assigned,
                    c.latitude AS citizen_latitude, c.longitude AS citizen_longitude,
                    CONCAT(c.first_name, ' ', c.last_name) AS citizen, 
                    c.phone_number AS citizen_phone_number 
                 FROM tasks t
                 JOIN items i ON t.item_id = i.id 
                 LEFT JOIN users u ON t.rescuer_id = u.id 
                 LEFT JOIN users c ON t.citizen_id = c.id
                 WHERE (u.id = ? AND t.status != 'complete') OR (t.rescuer_id IS NULL AND t.status = 'not_assigned')`;

    db.query(sql1, [userId, userId], (err, taskResults) => {
        if (err) {
            return next(err);
        }

        // Execute the second query to get rescuer information
        const sql2 = 'SELECT * FROM users WHERE id = ?';

        db.query(sql2, [userId], (err, rescuerInfo) => {
            if (err) {
                return next(err);
            }

            // Combine the results into one object
            const response = {
                tasks: taskResults,
                rescuer: rescuerInfo[0] // Assuming we only expect one result
            };

            res.status(200).json(response); // Send combined results as JSON
        });
    });
}
