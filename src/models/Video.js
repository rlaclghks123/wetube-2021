import mongoose from "mongoose";


const videoSchema = mongoose.Schema({
    title: { type: String, required: true },
    fileUrl: { type: String, require: true },
    thumbUrl: { type: String, require: true },
    description: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    hashtags: [{ type: String }],
    meta: {
        views: { type: Number, default: 0, required: true },
        rating: { type: Number, default: 0, required: true }
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" }],
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
});

videoSchema.static("formatHashtag", function (hashtag) {
    return hashtag.split(",").map(word => word.startsWith("#") ? word : `#${word}`)
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
