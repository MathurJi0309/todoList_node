//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema={
    name:String
}

const Item=mongoose.model("Item",itemSchema);

const item1=new Item({
    name:"welcome to you"
})


const item2=new Item({
    name:"hello where are you"
})


const item3=new Item({
    name:"hi i am here "
})


const defaultitems=[item1,item2,item3]

//we create the lists schema 

const listSchema={
    name:String,
    items:[itemSchema]
} 

const List=mongoose.model("List",listSchema);
// Item.insertMany(defaultitems,function(err){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("Successfullly saved item in the DB");
//     }
// })


// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

app.get("/", function(req, res) {
    
    Item.find({},function(err,fonudItems){
        console.log("i am here ")
        if(fonudItems.listen===0){
            Item.insertMany(defaultitems,function(err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("Successfullly saved item in the DB");
                    }
                })
                res.redirect("/")
                
        }else{
        res.render("list", {listTitle: "Today", newListItems: fonudItems});

        }

    })


});

app.post("/", function(req, res){

   const itemName = req.body.newItem;
   const listName=req.body.list;
   const item =new Item({
    name:itemName
   })
   if(listName==="Today"){
    item.save();
    res.redirect("/")
   }else{
    List.findOne({name:listName},function(err,fonudList){
        fonudList.items.push(item);
        fonudList.save();
        res.redirect("/"+listName);
    })
   }


//   if (req.body.list === "Work") {
//     workItems.push(item);
//     res.redirect("/work");
//   } else {
//     items.push(item);
//     res.redirect("/");
//   }
});

app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;
     Item.findByIdAndRemove(checkedItemId,function(err){
        if(err){
            console.log(err)
        }
        else{
            console.log(checkedItemId,"item deleted sussefully")
            res.redirect("/")
        }

     })
})

app.get("/:customListName",function(req,res){
    const customListName=req.params.customListName;
    List.findOne({name:customListName},function(err,fonudList){
        if(!err){
            if(!fonudList){
                const list=new List({
                    name:customListName,
                    items:defaultitems
                });
                list.save();
                res.redirect("/"+customListName)
            }else{
                res.render("list",{listTitle:fonudList.name,newListItems:fonudList.items})
            }
        }
    })  
})

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
