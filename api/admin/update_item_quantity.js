const db = require('../../utils/connect_db')

exports.update_item_quantity = async(req,res,next)=>{
    var quantity = req.body.quantity   
    var item_id = req.body.id
    var sql = "UPDATE items SET quantity = ? WHERE id = ?";
    console.log(req.body)
    db.query(sql,[quantity,item_id],function(err,results){
        if(err) {
            return next(err);
        };
        
        res.status(200).send(JSON.stringify(results));
    })
}