const db = require('../../utils/connect_db')

exports.add_category = async(req,res,next)=>{
    var name = req.body.name
    var sql1="SELECT * FROM categories ORDER BY id DESC LIMIT 1";
    var sql2="INSERT INTO categories (id,name) VALUES (?,?)";
    db.query(sql1,[name],function(err,res1){
        if(err) {
            return next(err);
        };
        let cat_id = parseInt(res1[0].id, 10) + 1
        db.query(sql2,[cat_id,name],function(err,res2){
            
            if(err) {
                return next(err);
            };
            
            res.status(200).send(JSON.stringify(res2));
        })
    })   

}