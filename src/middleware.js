import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const isHeroku = process.env.NODE_ENV === "production";

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_APIKEY,
        secretAccessKey: process.env.AWS_SECTET,
    }
});

const s3ImageUploader = multerS3({
    s3: s3,
    bucket: "wetubechimanbutket/images",
    acl: "public-read",
})


const s3VideoUploader = multerS3({
    s3: s3,
    bucket: "wetubechimanbutket/video",
    acl: "public-read",
})

export const localMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user || {};
    res.locals.Heroku = isHeroku;
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
        storage: isHeroku ? s3ImageUploader : undefined,
    }
});

export const videoUpload = multer({
    dest: "uploads/videos/",
    limit: {
        fileSize: 10000000,
        storage: isHeroku ? s3VideoUploader : undefined,
    }
})