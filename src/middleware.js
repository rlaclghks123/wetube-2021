

export const localMiddleware= (req, res,next) =>{
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user || {};
    next();
}

export const privateMiddleWare = (req,res,next) =>{
    if(req.session.loggedIn){
        return next();
    }else{
        return res.redirect("/login");
    }
}

export const publicOnlyMiddleWare = (req,res,next)=>{
    if(!req.session.loggedIn){
        return next();
    }else{
        return res.redirect("/");
    }
}