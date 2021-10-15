
import Video from "../models/Video";



  

export const home = async(req, res) => {
  const videos = await Video.find({});
  return res.render("home", {pageTitle:"Home",videos});
}


export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if(!video){
    return res.status(404).render("404",{pageTitle : "Video is not Found"});
  }
  return res.render("watch", { pageTitle: video.title, video });
};
// 

export const getEdit = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video){
      return res.status(404).render("404",{pageTitle : "Video is not Found"});
    }
    return res.render("edit",{pageTitle : `Editing `,video});
}

export const postEdit = async(req, res) => {
  const {id} = req.params;
  const {title,description,hashtags} = req.body;
  const video = await Video.exists({_id:id});
  if(!video){
    return res.status(404).render("404",{pageTitle : "Video is not Found"});
  }

  await Video.findByIdAndUpdate(id,{
    title,description,
    hashtags:Video.formatHashtag(hashtags)
  });


  return res.redirect(`/videos/${id}`);
}




export const getUpload =(req, res) => {
  return res.render("upload");
}
export const postUpload =async(req, res) => {
  const {title,description,hashtags}=req.body;

  try{
    await Video.create({
      title,
      description,
      hashtags:Video.formatHashtag(hashtags)
    })
    return res.redirect("/");
  } catch(error){
    return res.status(400).render("upload",{padeTitle : `Upload `,pageerrorMessage : error._message});
  }
}


export const deleteVideo =async(req, res) => {
  const {id} = req.params;
  await Video.findByIdAndDelete(id);
  res.redirect("/");
}

export const search = async(req, res) =>{
  const {keyword} = req.query;
  let videos=[];
  if(keyword){
     videos = await Video.find({
      title:{
        $regex:new RegExp(keyword,"i")
      },
    });
  }
  res.render("search", {pageTitle:"Search",videos});
  }

