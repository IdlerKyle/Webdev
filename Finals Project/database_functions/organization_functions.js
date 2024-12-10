function getOrganizations(con, callback) {
    var sql = "SELECT * FROM organizations";

    con.query(sql, (error, results) => {
        if (error == null) {
            callback(null, { success: true, data: results });
        } else {
            callback(error, { success: false, message: error.message });
        }
    });
}

function getBoothsForOrganization(con, orgId, callback) {
    const sql = "SELECT * FROM booths WHERE id IN (SELECT booth_id FROM boothorg WHERE org_id = ?)";
    
    con.query(sql, [orgId], (error, results) => {
        if (error) {
            console.error("Error fetching booths:", error.message);
            callback(error, null); 
        } else {
            callback(null, results); 
        }
    });
}

function getProductsForBooth(con, boothId, callback) {
    const sql = "SELECT * FROM products WHERE booth_id = ?";
    
    con.query(sql, [boothId], (error, results) => {
        if (error) {
            console.error("Error fetching products:", error.message);
            callback(error, null); 
        } else {
            callback(null, results); 
        }
    });
}

module.exports = { getOrganizations, getBoothsForOrganization , getProductsForBooth};

