import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
import bycript from "bcrypt";

export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
}

export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";

    if (password != password2) {
        return res.status(400).render("join", { pageTitle, errorMessage: "Password was not match" });
    }

    const exist = await User.exists({ $or: [{ username }, { email }] });
    if (exist) {
        return res.status(400).render("join", { pageTitle, errorMessage: "This username/email is already taken" })
    }

    try {
        await User.create({
            email, username, name,
            password, location
        })
        return res.redirect("/login");
    } catch (error) {
        res.status(400).render("join", { pageTitle, errorMessage: error._message });
    }
}

export const getLogin = (req, res) => {
    res.render("login", { pageTitle: "Login" });
}


export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, socialOnly: false },);
    const pageTitle = "Login";

    if (!user) {
        return res.status(400).render("login", { pageTitle, errorMessage: "Username is not exists" });
    }

    const ok = await bycript.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login", { pageTitle, errorMessage: "Password was not correct" });
    }
    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/");
}

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GITHUB_ID,
        allow_signup: true,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    res.redirect(finalUrl);
}

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GITHUB_ID,
        client_secret: process.env.GITHUB_SECRET,
        code: req.query.code,
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    const tokenRequest = await (await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    })).json();
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const baseUrl = "https://api.github.com";
        const userData = await (await fetch(`${baseUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`,
            }
        })).json();
        const userEmail = await (await fetch(`${baseUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`,
            }
        })).json();
        const emailObj = userEmail.find((email) => email.primary === true && email.verified === true);
        let user = await User.findOne({ email: emailObj.email });
        if (!user) {
            user = await User.create({
                name: userData.name,
                username: userData.login,
                avatar_url: userData.avatar_url,
                email: emailObj.email,
                password: "",
                socialOnly: true,
                location: userData.location,
            });
        }
        req.session.loggedIn = true,
            req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("/");
    }
};



export const logout = (req, res) => {
    req.session.destroy();
    // req.flash("info", "Bye Bye");
    return res.redirect("/");
};

export const getEdit = (req, res) => {
    res.render("edit-profile", { pageTitle: "Edit Profile" });
}

export const postEdit = async (req, res) => {
    const {
        session: {
            user: { _id, avatar_url }
        },
        body: { name, username, email, location },
        file,
    } = req;


    const exixts = await User.exists({
        $and: [{ _id: { $ne: _id } }, { $or: [{ username }, { email }] }],
    });


    if (exixts) {
        return res.status(400).render("edit-profile",
            {
                pageTitle: "Edit Profile",
                errorMessage: "username/email is already taken"
            });
    }
    const isHeroku = process.env.NODE_ENV === "production";


    const updateUser = await User.findByIdAndUpdate(_id, {
        avatar_url: file ? (isHeroku ? file.location : file.path) : avatar_url,
        name, username, email, location
    },
        { new: true });
    req.session.user = updateUser;

    return res.redirect("/");
}

export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
        req.flash("error", "Can't change password.");
        return res.redirect("/");
    }
    return res.render("change-password", { pageTitle: "Change Password" });
}

export const postChangePassword = async (req, res) => {
    const { session: {
        user: { _id }
    },
        body: { oldpassword, newpassword, newpassword1 },
    } = req;
    const user = await User.findById({ _id });
    const ok = await bycript.compare(oldpassword, user.password);
    if (!ok) {
        return res.status(400).render("change-password", { pageTitle: "Change Password", errorMessage: "Old password was not correct" })
    }

    if (newpassword !== newpassword1) {
        return res.status(400).render("change-password", { pageTitle: "Change Password", errorMessage: "New password was not correct" })
    }
    user.password = newpassword;
    await user.save();
    req.flash("info", "Password updated");
    return res.redirect("/users/logout");
}

export const see = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
            path: "owner",
            model: "User",
        },
    });
    if (!user) {
        return res.status(404).render("404", { pagetitle: "User not Found" });
    }

    return res.render("profile", { pageTitle: user.name, user });
}
