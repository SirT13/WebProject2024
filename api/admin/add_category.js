const db = require('../../utils/connect_db')

exports.add_category = async(req,res,next)=>{
    console.log("hey")
    var name = req.body.name
    var sql1="SELECT * FROM categories ORDER BY id DESC LIMIT 1";
    var sql2="INSERT INTO categories (id,name) VALUES (?,?)";
    db.query(sql1,[name],function(err,res1){
        if(err) {
            return next(err);
        };
        console.log()
        let cat_id = parseInt(res1[0].id, 10) + 1
        console.log(cat_id)
        db.query(sql2,[cat_id,name],function(err,res2){
            
            if(err) {
                return next(err);
            };
            
            res.status(200).send(JSON.stringify(res2));
        })
    })   

}