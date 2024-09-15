const db = require('../../utils/connect_db')

exports.create_notification = async(req,res,next)=>{
    var item_ids = req.body.items
    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var sql1="INSERT INTO notifications (created_at,is_active) VALUES (?,?)";
    var sql2="INSERT INTO notifications_items (notification_id,item_id) VALUES (?,?)";
    db.query(sql1,[currentDateTime,1],function(err,result){
        if(err) {
            return next(err);
        };
        const notific_id = result.insertId
        item_ids.forEach(item_id => {
            db.query(sql2, [notific_id,item_id], function (err, res1) {
                if (err) {
                    return next(err);  // Handle the error
                }
                console.log('Query executed for item:', item_id);
                res.status(200).send("Notification Added")
            });
        });
        
    })   
}