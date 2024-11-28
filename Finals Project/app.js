const express = require('express');
const path = require('path');
const mysql = require('mysql')
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

// ***********MYSQL FUNCTIONS************//

const loginFunctions = require('./database_functions/login_functions.js');
const organizationFunctions = require('.database_functions/organization_functions')
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
app.get("/Homepage",(req,res)=>{

    
    if(!req.session.currentUserID)
    {
        res.send("<script>window.location.replace('/')</script>")
    }
    else
    {
        organizationFun
        res.sendFile(path.join(__dirname,"public","homepage.html"))

    }
    
})


app.post("/", bodyParser.urlencoded({extended:false}),(req,res) =>{
    var params = req.body;
    organizationFunctions.getOrganization
    if(username != null)
    {
        
    }

})

// ***********END HOMEPAGE************//

// ***********PRODUCTS PAGE************//


app.get("/Products",(req,res)=>{
    if(!req.session.currentUserID)
    {
        res.send("<script>window.location.replace('/')</script>")
    }
    else
    {
        res.sendFile(path.join(__dirname,"public","product.html"))
    }
    
})
// ***********END PRODUCTS PAGE************//

app.listen(5000,()=>{
    console.log("Server started")
})