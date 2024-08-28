const db = require('../../utils/connect_db')

exports.get_items = async(req,res,next)=>{   

    var sql="SELECT i.id as id,i.name as item,quantity,c.name as category from items i JOIN categories c ON i.category_id = c.id WHERE i.name != ''";
    db.query(sql,function(err,results){
        if(err) {
            return next(err);
        };
        
        res.status(200).send(JSON.stringify(results));
    })
}