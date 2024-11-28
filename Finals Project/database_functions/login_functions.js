function login(con,params, callback){
    var username = params['username'];
    var password = params['password'];
    
    var sql = "SELECT * FROM accounts WHERE username = ? && password = ?";
    var response = {};
    con.query(sql,[username,password],(error,results)=>{
        if(error == null)
        {
            response['result'] = results;
        }
        else
        {
            response['message'] = error;
        }
        callback(response);
    })

    
}

module.exports = {login}