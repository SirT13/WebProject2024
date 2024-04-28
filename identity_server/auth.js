const db = require('../services/connect_db')
const jwt = require("jsonwebtoken")
var bcrypt = require('bcrypt');
exports.login = async(req,res,next)=>{
    console.log(req)    
    var username=req.body.username
    var password=req.body.password
    console.log("Hey")
    var sql = 'SELECT * FROM users WHERE username=? OR password=?'

    db.query(sql,[username,password],function(err,user){

        if(err) {errorHandler(err,req,res,next);return next()};
        
        if(user[0]){ //no user err handling
            bcrypt.compare(password,user[0].pass,(err,response)=>{
                if(response){
                    const user_data = {user_id:user[0].user_id,username: username,role:user[0].role}
                    const token=jwt.sign(user_data,process.env.SECRET_KEY)

                    res.header('auth-token',token).status(200).send(user[0])
                }
                else res.status(403).send({message:"Τα στοιχεία σύνδεσης είναι λάθος"})
            })
        }
        else res.status(404).send({message:"Ο χρήστης δε βρέθηκε"})
    })
}