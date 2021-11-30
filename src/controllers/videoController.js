
import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";



export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" }).populate("owner").populate("comments");
  return res.render("home", { pageTitle: "Home", videos });
}


export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  const comment = await Comment.findById(id).populate("owner");
  dayjs.extend(relativeTime);
  const createdAtFromNow = dayjs(video.createdAt).fromNow();
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video is not Found" });
  }
  return res.render("watch", { pageTitle: video.title, video, comment, createdAtFromNow });
};


export const getEdit = async (req, res) => {
  const { id } = req.params;
  const { user: { _id } } = req.session;

  const video = await Video.findById(id).populate("owner");

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video is not Found" });
  }
  if (String(video.owner.id) !== _id) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Editing `, video });
}

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { user: { _id } } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id }).populate("owner");
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video is not Found" });
  }

  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title, description,
    hashtags: Video.formatHashtag(hashtags)
  });

  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
}


export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload" });
}


export const postUpload = async (req, res) => {
  const { user: { _id }, } = req.session
  const { title, description, hashtags } = req.body;
  const { video, thumb } = req.files;
  try {
    const newVideo = await Video.create({
      owner: _id,
      fileUrl: video[0].location,
      thumbUrl: thumb[0].location,
      title,
      description,
      hashtags: Video.formatHashtag(hashtags)
    })
    const user = await User.findById(_id);
    user.videos.push(newVideo);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", { pageerrorMessage: error._message });
  }
}


export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const { user: { _id } } = req.session;
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not Found" });
  }

  if (String(video.owner) !== _id) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);


  res.redirect("/");
}

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i")
      },
    }).populate("owner");
  }
  res.render("search", { pageTitle: "Search", videos });
}


export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.statusSend(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.res.sendStatus(200);
}


export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id).populate("comments");
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
}



export const deleteComment = async (req, res) => {
  const commentId = req.body.commentId;
  const { session: { user } } = req;
  const comment = await Comment.findById(commentId).populate("owner");

  if (user._id === comment.owner.id) {
    await Comment.findByIdAndDelete(commentId);
  }
}



