import User from "../models/User";
import bycript from "bcrypt";

export const getJoin = (req, res) =>{
res.render("join", {pageTitle : "Join"});
} 

export const postJoin =async(req, res)=>{
    const {name,username, email,password,password2,location} = req.body;
    const pageTitle ="Join";

    if(password!=password2){
        return res.status(400).render("join", {pageTitle,errorMessage:"Password was not match"});
    }

    const exist = await User.exists({$or: [{username},{email}]});
    if(exist){
        return res.status(400).render("join", {pageTitle, errorMessage:"This username/email is already taken"})
    }

    try{
        await User.create({
            email,username,name,
            password,location
        })
        return res.redirect("/login");
    }catch(error){
        res.status(400).render("join", {pageTitle, errorMessage:error._message});
    }
}

export const getLogin = (req, res) => {
    res.render("login", {pageTitle:"Login"});
}


export const postLogin =async(req,res) =>{
    const {username,password} = req.body;
    const user =await User.findOne({username});
    const pageTitle="Login";

    if(!user){
        return res.status(400).render("login", {pageTitle, errorMessage:"Username is not exists"});
    }

    const ok = await bycript.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login", {pageTitle, errorMessage:"Password was not correct"});
    }
    req.session.loggedIn = true;
    req.session.user = user;
    res.redirect("/");
}



export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See profile");
export const edit = (req, res) => res.send("Edit");
export const remove =(req, res) => res.send("Remove");