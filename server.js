const express = require('express')
const mysql = require('mysql')

const app = express();
app.use(express.json());



// Mysql Connection
const Connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password :'',
    database : "restapi"
})

Connection.connect((err) => {
    if(err){
        console.log('Error connection to Mysql database = ',err)
        return;
    }
    console.log('Mysql successfully connected');
})

// Create Routes
app.post("/create",async(req ,res) => {
    const { email ,name,password } = req.body;

    try{
        Connection.query(
            "INSERT INTO user(email, fullname, password) VALUES(?,?,?)",
            [email ,name,password],
            (err ,results ,fields) => {
                if(err){
                    console.log("Error while inserting a user into the database",err);
                    return res.status(400).send();
                }
                return res.status(201).json({message: "New user successfully created"});
            }
        )
    }catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

//Read
// app.get("/read/single/:email",async(req,res)=>{
app.get("/read",async(req,res)=>{

    const email = req.params.email;

    try {
        // Connection.query("SELECT * FROM user WHERE email = ?",[email],(err ,results,fields)=>{
        Connection.query("SELECT * FROM categories",(err ,results,fields)=>{

            if (err){
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json(results)
        })
    } catch (error) {
        console.log(err);
        return res.status(500).send();
    }
})

//Update data
app.patch("/update/:email",async(req, res)=>{
    const email = req.params.email;
    const newPassword = req.body.newPassword;
    try {
        Connection.query("UPDATE user SET password = ? WHERE email = ?",[newPassword,email],(err ,results,fields)=>{
            if (err){
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json({message: "User password update successfully"})
        })
    } catch (error) {
        console.log(err);
        return res.status(500).send();
    }
})

//Delete
app.delete("/delete/:email",async (req,res)=>{
    const email = req.params.email;
    try {
        Connection.query("DELETE FROM user WHERE email = ?",[email],(err ,results,fields)=>{
            if (err){
                console.log(err);
                return res.status(400).send();
            }
            if(results.affectedRows === 0 ){
               return res.status(404).json({message:"No user with that email"});
            }
            return res.status(200).json({message:"User deleteed successfully"});

        })
    } catch (error) {
        console.log(err);
        return res.status(500).send();
    }
})
app.listen(3000, () => console.log('Server is running on port 3000'));
