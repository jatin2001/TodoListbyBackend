const express = require('express');
const bodyParser = require('body-parser');
const Date = require(__dirname +'/Date');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin-jatin:9873804639@cluster0.ktbyq.mongodb.net/todoListDB', {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false});
const ItemSchema = new mongoose.Schema({
    name:String,
});
const Item = mongoose.model('Item',ItemSchema);

const item1 = new Item({
    name: "Welcome to your TodoList!"
})
const item2 = new Item({
    name: "Click + button to add new item"
})
const item3 = new Item({
    name: "<-- Hit this to delete an item"
})
const defaultItem = [item1,item2,item3];

const listSchema =new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    items:[ItemSchema],
})

const List = mongoose.model('List',listSchema);


app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.get('/',(req,res)=>{
    let day = Date.getDate();
    Item.find((err,result)=>
    {
        if(err) console.log(err);
        else{
            if(result.length===0)
            {
                Item.insertMany(defaultItem,(err)=>{
                    err?console.log(err):'';
                })
                res.redirect('/');
            }
            else{
                res.render("list",{listTitle:day,items:result})
            }
        }
    })
})

app.post('/',(req,res)=>{
    const itemName = req.body.task;
    const listName =req.body.button;
    if(itemName!=='')
    {
        let newItem = new Item({
            name:itemName
        })
        if(listName==='Sunday,')
        {
            newItem.save();
            res.redirect('/');
        }
        else{
            List.findOne({name:listName},(err,foundList)=>{
                foundList.items.push(newItem);
                foundList.save();
                res.redirect('/'+ listName);
            });
        }
    }
})

app.post('/delete',(req,res)=>{
    const removeID = req.body.checkbox;
    const listName = req.body.ListName;
    if(listName==='Sunday,'){
        Item.findByIdAndRemove(removeID,(err)=>{
            err?console.log(err):'';
        })
        res.redirect('/');
    }
    else{
        console.log(listName);
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: removeID}}}, function(err,foundList) {
                if(!err)
                {
                    res.redirect("/" + listName);
                }
        });
    }

})

app.get("/:paramName",(req,res)=>{
    const title = req.params.paramName;

    List.findOne({name: title},(err,foundList)=>{
        if(!foundList)
        {
            const list = new List({
                name:title,
                items:defaultItem,
            })
            list.save();
            res.redirect('/'+ title);  
        }
        else
        {
            res.render('list',{listTitle:foundList.name,items:foundList.items});
        }

    })
})



app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})