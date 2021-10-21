import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
    email : {type:String, required : true, unique:true},
    username : {type:String, required : true, unique:true},
    avatar_url:String,
    socialOnly:{type:Boolean, default:false},
    password : {type : String, },
    name : {type : String,required:true }, 
    location : {type : String }
});

userSchema.pre("save",async function(){
    this.password = await bcrypt.hash(this.password,5)
});

const User = mongoose.model("User",userSchema );
export default User