const express = require('express');
const path = require('path');
const mysql = require('mysql')
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

// ***********RENDER************//
app.set('view engine', 'ejs');

// ***********MYSQL FUNCTIONS************//

const loginFunctions = require('./database_functions/login_functions.js');
const organizationFunctions = require('./database_functions/organization_functions')
const productFunction = require('./database_functions/product_functions.js');

// ***********END MYSQL FUNCTIONS************//

app.use(express.static(path.join(__dirname,'public')))

// ***********ESTABLISHING MYSQL CONNECTION************//

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"404database"
})
con.connect((error)=>{
    if(error) throw error;
    console.log("Connected");
})

// ***********END ESTABLISHING MYSQL CONNECTION************//

// ***********SESSION HANDLING************//

app.use(session({
    secret: 'zq;C:#jCn9z=ir=vUb7<8HD(}`@v`gBM1pA+p|.3+g]G8B+)T',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
    }})
);

// ***********END SESSION HANDLING************//

// ***********LOGIN************//

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","login.html"))
})
app.post("/",bodyParser.urlencoded({extended:false}),(req,res)=>{
    var params = req.body;
    var username = params['username'];
    var password = params['password'];
    if(username != null && password != null)
    {
        loginFunctions.login(con,params,(queryResponse)=>{
            if(queryResponse['message']!=null)
            {
                console.log(queryResponse['message'])
                res.status(500).send({message:"Serve issue"})
            }
            else
            {
                var queryResult = queryResponse['result'];
                if(queryResult.length > 0)
                {
                    req.session.currentUserID = queryResult[0]['userid'];
                    res.status(200).send("<script>window.location.replace('homepage')</script>")
                }
                
            }
        })
    }
    else
    {
        res.status(400).send({message:"Empty Request"})
    }
})

// ***********END LOGIN************//

// ***********HOMEPAGE************//
app.get("/Homepage", (req, res) => {
    if (!req.session.currentUserID) {
        return res.send("<script>window.location.replace('/')</script>");
    }

    const selectedOrg = req.query.org || null; 

    
<<<<<<< HEAD
    organizationFunctions.getOrganizations(con, (error, organizationResult) => {
        if (error) {
            console.error("Error fetching organizations:", error.message);
            return res.status(500).send("Internal server error");
        }

        if (organizationResult.success) {
           
            let booths = [];
            if (selectedOrg) {
               
                organizationFunctions.getBoothsForOrganization(con, selectedOrg, (error, boothResults) => {
                    if (error) {
                        console.error("Error fetching booths:", error.message);
                        booths = []; 
                    } else {
                        booths = boothResults; 
                    }

                   
                    res.render("homepage", {
                        organizations: organizationResult.data,
                        selectedOrg: selectedOrg,
                        booths: booths
                    });
                });
            } else {
                
                res.render("homepage", {
                    organizations: organizationResult.data,
                    selectedOrg: selectedOrg,
                    booths: booths
                });
            }
        } else {
            res.status(500).send("Error fetching organizations");
        }
    });
});
=======
    if(!req.session.currentUserID)
    {
        res.send("<script>window.location.replace('/')</script>")
    }
    else
    {
        organizationFunctions.getOrganizations(con,res, qResponse =>{
            res.render('/Homepage', {organizations: qResponse['result']});

        })
       
        res.sendFile(path.join(__dirname,"public","homepage.html"))
>>>>>>> 3f0151cb382df142ffc456017e2da5ebb753acc5




// ***********END HOMEPAGE************//

// ***********PRODUCTS PAGE************//


app.get('/product', (req, res) => {
    const boothId = req.query.booth;

    if (boothId) {
        // Fetch booth from the database using the boothId
        const sql = "SELECT * FROM booths WHERE id = ?";

        con.query(sql, [boothId], (error, results) => {
            if (error) {
                console.error("Error fetching booth:", error.message);
                return res.send('Error fetching booth');
            }

            const booth = results[0]; // Assuming booth exists and is returned as the first result

            if (booth) {
                // Use the getProductByBooth function to fetch products for this booth
               organizationFunctions.getProductsForBooth(con, boothId, (err, products) => {
                    if (err) {
                        return res.send('Error fetching products');
                    }

                    // Render the product page and pass booth and products data
                    res.render('product', { booth, products });
                });
            } else {
                res.send('Booth not found');
            }
        });
    } else {
        res.send('No booth selected');
    }
});

// ***********END PRODUCTS PAGE************//

app.listen(5000,()=>{
    console.log("Server started")
})