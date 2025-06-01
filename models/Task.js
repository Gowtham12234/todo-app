const mongoose=require("mongoose");
const taskSchema=new mongoose.Schema({
    username:String,
    task:String,
    date:String,
    time:String,
    completed:Boolean
});
module.exports=mongoose.model("Task",taskSchema);