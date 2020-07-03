const express = require('express');
const bodyParser = require('body-parser');
const Date = require(__dirname +'/Date');
const items =  ['Coding','Debugging','Meeting'];
const worksItem = [];
const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.get('/',(req,res)=>{
    let day = Date.getDate();
    res.render("list",{listTitle:day,items})
})

app.post('/',(req,res)=>{
    const item = req.body.task;
    if(req.body.button ==='Work')
    {
        worksItem.push(item);
        res.redirect('/work');
    }
    item!==''?items.push(item):'';

    res.redirect('/');
})

app.get('/work',(req,res)=>{
    res.render("list",{listTitle:'Work List',items:worksItem})
})


app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})