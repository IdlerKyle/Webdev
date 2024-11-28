async function getOrganizations(con){
    
    

    var sql = "SELECT * FROM organizations";

    try
    {
        const [results] = await con.promise().query(sql);
        return { success:true, data:results};
    }
    catch (error)
    {
        return { success:false, error: error.message}
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
    