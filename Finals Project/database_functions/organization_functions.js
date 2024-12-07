async function getOrganizations(con,res){
    
    var sql = "SELECT * FROM organizations";

    try
    {
        const [results] = await con.promise().query(sql);
        res.send(results);
    }
    catch (error)
    {
        console.error(error);
    }

}



async function getBooth(con, params){
    var sql = "SELECT * FROM booths WHERE id = (SELECT booth_id FROM boothorg WHERE org_id = ?)";
    var org_id = params['org_id'];
    
    try
    {
        const [results] = await con.promise().query(sql, [org_id]);
        return { success:true, data:results};
    }
    catch (error)
    {
        return { success:false, error: error.message}
    }
    }

    module.exports = {getOrganizations,getBooth};
    