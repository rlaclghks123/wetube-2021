import multer from "multer";

export const localMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user || {};
    next();
}

export const privateMiddleWare = (req, res, next) => {
    if (req.session.loggedIn) {
        return next();
    } else {
        req.flash("error", "Log in first.");
        return res.redirect("/login");
    }
}

export const publicOnlyMiddleWare = (req, res, next) => {
    if (!req.session.loggedIn) {
        return next();
    } else {
        req.flash("error", "Not authorized");
        return res.redirect("/");
    }
}
export const avatarUpload = multer({
    dest: "uploads/avatar/",
    limit: {
        fileSize: 3000000,
    }
});

export const videoUpload = multer({
    dest: "uploads/videos/",
    limit: {
        fileSize: 10000000,
    }
})