async function getProducts(con,params, callback){
   
    var booth_id = params['booth_id'];

    var sql = "SELECT * FROM products WHERE booth_id = ?";
 
    try
    {
        const [results] = await con.promise().query(sql, [booth_id]);
        return { success:true, data:results};
    }
    catch (error)
    {
        return { success:false, error: error.message}
    }
}

module.exports = {getProducts};