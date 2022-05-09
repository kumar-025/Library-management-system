const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var multer = require('multer');
var upload = multer();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(upload.array()); 
var alert=require("alert");
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017";
const dbName = 'libraryManagement';
let db;
app.set('view engine', 'ejs'); 
app.use(express.static(__dirname + '/views'));
MongoClient.connect(url, { useUnifiedTopology: true ,useNewUrlParser: true}, (err, client) => {
    if (err) return console.log(err);
    db = client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
});
//Login
app.get('/login',function(req,res){
        res.render('index');
})
app.post('/login',function(req,res){
    var username =  req.body.username;
    var password = req.body.password;
    var query = {"username":username,"password":password};
  console.log(query);
  if (username && password){

  db.collection('admin_credits').find(query)
    .toArray((err, results) => {
        if(err) throw err;
        console.log(results.length);
        if(results.length<=0)
          res.send('Incorrect Username and/or Password!'); 
        else
          res.redirect('/homepage');  
    });
  }
  else
  res.send('Invalid Username and/or Password!');
});
app.get('/homepage',function(req,res){
  res.render('homepage');
})
//Add book
app.get('/addbook',function(req,res){
  res.render('book_details');
})
app.post('/addbook',function(req,res){
  var b_num =  req.body.b_num;
  var b_name = req.body.b_name;
  var a_name = req.body.author_name;
  var copies = parseInt(req.body.copies);
  
  var query = {"Book_number":b_num,"Book_name":b_name,"Author_name":a_name,"Copies":copies};
console.log(query);
db.collection("book").insertOne(query,(err,res)=>{
  if (err)
      throw err;
  console.log("1 item inserted");   
  
});
});
//Delete book 
app.get('/deletebook',function(req,res){
  res.render('delete_book');
})
app.post('/deletebook',function(req,res){
  var b_num =  req.body.b_num;
 
  var query = {"Book_number":b_num};
console.log(query);
db.collection("book").deleteOne(query,(err,res)=>{
  if (err)
      throw err;
  console.log("1 item deleted");   
  
});
});



//Add Student
app.get('/addstudent',function(req,res){
  res.render('addstudent');
})
app.post('/addstudent',function(req,res){
  var sid =  req.body.sid;
  var fname = req.body.fname;
  var lname = req.body.lname;
  var dept=req.body.dept;
  var year =req.body.year;
  var sec = req.body.sec;
  var query = {"Student Id":sid,"First name":fname,"Last name":lname,"Year":year,"Section":sec};
console.log(query);
db.collection("student").insertOne(query,(err,res)=>{
  if (err)
      throw err;
  
});
});

//Delete Student
app.get('/deletestudent',function(req,res){
  res.render('deletestudent');
})
app.post('/deletestudent',function(req,res){
  var sid=  req.body.sid;
  
  
  var query = {"Student Id":sid};
console.log(query);
db.collection("student").deleteOne(query,(err,res)=>{
  if (err)
      throw err;
  console.log("1 item deleted");   
  
});
});


//Update Books
app.get('/updatebook',function(req,res){
  res.render('updatebook');
})
app.post('/updatebook',function(req,res){
  var b_num=  req.body.b_num;
  var copies = req.body.copies;
 // updateOne({ "name": name }, { $set: { "hid": hId } },
  var query = { "Book_number": b_num };
  var values= { $set: { "Copies": copies } };
console.log(query);
db.collection("book").updateOne(query, values,(err,res)=>{
  if (err)
      throw err;
  console.log("1 item updated");   
  
});
});

//Search a Book
app.get('/search',function(req,res){
  db.collection("book").find().toArray().then(result=> res.render('search',{records:result}));
})
app.post('/search',function(req,res){
  var bnum = req.body.bid;
  var query = {"Book_number":bnum};
console.log(query);
db.collection("book").find(query).toArray().then(result=> res.render('search',{records:result}));
});


//Issue Books
app.get('/issuebook',function(req,res){
  res.render('issuebook');
})
app.post('/issuebook',function(req,res){
  var bnum =  req.body.bnum;
  var bname = req.body.bname;
  var s_name = req.body.s_name;
  var s_id = req.body.s_id;
  var date=req.body.date;
  var query = {"Book_number":bnum,"Book_name":bname,"Student_name":s_name,"Student_Id":s_id,"Date_of_Issue":date};
console.log(query);
db.collection("issued").insertOne(query,(err,res)=>{
  if (err)
      throw err;
  console.log("1 item inserted");   
  
});
});

//Display
app.get('/display',function(req,res){
  db.collection("book").find({}).sort({"Book_number":1}).toArray().then(results => res.render('display',{records:results}));
})

//Issuedbooks

app.get('/issuedbooks',function(req,res){
  db.collection("issued").find({}).sort({"Book_number":1}).toArray().then(results => res.render('issuedbooks',{records:results}));
})
app.listen(8080);