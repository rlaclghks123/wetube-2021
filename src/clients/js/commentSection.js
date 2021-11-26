const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.getElementById("deleteBtn");



const handleDelete = async (event) => {
    const li = e.target.parentElement;
    li.remove();
    const id = li.dataset.id;
    await Comment.findByIdAndDelete(id);


}

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments  ul");
    const newComment = document.createElement("li");
    newComment.className = "video__comment";
    newComment.dataset.id = id;
    const icon = document.createElement("i");
    icon.className = "fas fa-comment"
    const span = document.createElement("span");
    const span2 = document.createElement("span");
    span2.innerText = "❌";
    span.innerText = ` ${text}`;
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
    span2.addEventListener("click", function (e) {
        const li = e.target.parentElement;
        li.remove();
        const id = li.dataset.id;

        return await Comment.findByIdAndDelete(id);
    });
}

const handleSubmit = async (event) => {
    event.preventDefault();
    const textInput = form.querySelector("#video__comment-text");
    const text = textInput.value;
    const videoId = videoContainer.dataset.id;
    if (text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    textInput.value = "";
    if (response.status === 201) {
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
    }
}



if (form) {
    form.addEventListener("submit", handleSubmit);
}
if (deleteBtn) {
    deleteBtn.addEventListener("click", handleDelete);
}
