const db = require('../../utils/connect_db')

exports.update_task_status = async (req, res, next) => {
    var type = req.body.task_type
    var taskId = req.body.task_id
    var status = req.body.status
    var quantity = req.body.quantity
    var itemId = req.body.item_id
    var itemName = req.body.item_name
    var rescuer_id = req.user.user_id

    const task_sql = 'UPDATE tasks SET status = ? where id = ?'
    const vehicle_sql = "UPDATE vehicles SET number_of_tasks = number_of_tasks - 1"
    const get_load_sql = 'SELECT `load` from vehicles WHERE rescuer_id = ?'
    db.query(task_sql, [status, taskId], (err) => {
        if (err) {
            return next(err)
        }
        db.query(vehicle_sql, [rescuer_id], (err, results) => {
            if (err) {
                return next(err)
            }
        })
    })
    if (status === 'complete') {
        db.query(get_load_sql, [rescuer_id], (err, results) => {
            if (err) {
                return next(err)
            }
            
            let load = [];
            if (results[0].load != '') {
                load = JSON.parse(results[0].load)
            }

            const warehouse_sql = "UPDATE vehicles SET `load` = ? WHERE rescuer_id = ?";
            if (type === 'request') {
                // Remove the item with the matching itemId from the load array
                const updatedLoad = load.filter(item => item.id !== itemId);

                // Convert updated load back to JSON format
                var updatedLoadJson = JSON.stringify(updatedLoad);

            } else {
                // Find the item in the load array if it exists
                const existingItemIndex = load.findIndex(item => item.id === itemId);

                if (existingItemIndex > -1) {
                    // If the item exists, increase its load_quantity
                    load[existingItemIndex].load_quantity += quantity;
                } else {
                    // If the item doesn't exist, add a new item to the load array
                    load.push({
                        id: itemId,
                        item: itemName, // Assuming you have an `itemName` variable
                        load_quantity: quantity
                    });
                }

                // Convert updated load back to JSON format
                var updatedLoadJson = JSON.stringify(load);
            }
            db.query(warehouse_sql, [updatedLoadJson, rescuer_id], (err) => {
                if (err) {
                    return next(err)
                }
            })
        })

    }

    res.status(200).send("Task completed and warehouse updated!")
}