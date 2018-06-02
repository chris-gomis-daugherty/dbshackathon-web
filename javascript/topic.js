/* Topic Object */

let Topic = (function() {
  let topicProto = {
    getTopic: function(userID) {
      //action, url, payload, callback
      console.log("calling get comment");
      let header = { "USER_ID": userID };
      callServer("GET","topics/"+this.id,header,"", this.clbkGetTopic);
    },
    clbkGetTopic: function(response) {
      console.log(response);
      // if error...
      // success
      pageTopic.objectLoad(response);
      setupTopic(pageTopic);
    },
    createTopic: function(userID,callback) {
      let header = { "USER_ID": userID };
      let payload = JSON.stringify({ "name": this.name, "description": this.description });
      callServer("POST","topics",header,payload, callback);
    },
    clbkCreateTopic: function(response) {
      console.log(response);
      //on success
      //create new line item and turn off form
    },
    commentStuff: function() {
      return "Goodbye, " + this.firstName;
    },
    objectLoad: function(data) {
      this.id = data.id;
      this.name = data.name;
      this.description = data.description;
      this.votes = data.votes;
      let loadComments = data.comments;
      let theComments = [];
      for (details in loadComments) {
        let aComment = new Comment();
        aComment.objectLoad(loadComments[details]);
        theComments.push(aComment);
      }
      this.comments = theComments;
      return (this);
    }
  };

  function theTopic(id, name, description, votes, comments) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.votes = votes;
    this.userId;
    this.comments = [];
  };
  theTopic.prototype = topicProto;

  return theTopic;
})();
/* end Topic Object */

let pageTopic;
let submitEvent;

function startTopicPage() {
  let userID = sessionStorage.getItem("userId");
  console.log("starting topic page, user: "+ userID);
  let url = new URL(window.location.href);
  let topicID = url.searchParams.get("topicid");
  pageTopic = new Topic(topicID);
  pageTopic.getTopic(userID);
  let submitBtn = document.getElementById("frm-submit");
  submitBtn.addEventListener("click", doNewComment);
  submitEvent = "new";

  let loggedInUserID = sessionStorage.getItem("userId");
  if (pageTopic.userId == loggedInUserID) {
    let topicFooter = document.getElementById("dv-topic-footer");
    let attr = { "href": "topiccrud.html", "class": "edit_link" };
    createElem("Edit Topic", "a", topicFooter, attr);
    attr = { "href": "", "class": "delete_link" };
    createElem("Delete Topic", "a", topicFooter, attr);
  }
}


let addComment = function(comment,elem) {
  let lDiv = document.createElement('div');
  lDiv.id = "dv-comment-id-"+comment.id;
  createElem(comment.id, "span", lDiv);
  createElem(comment.userId, "span", lDiv);
  let comElem = createElem(comment.message, "span", lDiv, {"class":"spn_comment"});
  comElem.id = "comment-id-"+comment.id;

  // update & delete should only display for original creator
  let loggedInUserID = sessionStorage.getItem("userId");
  if (comment.userId == loggedInUserID) {
    let attr = { "href": "", "class": "spn_update_link", "data-id": comment.id };
    let updElem = createElem("update", "a", lDiv, attr);
    updElem.addEventListener("click", prepUpdateComment);
    attr = { "href": "", "class": "spn_delete_link", "data-id": comment.id };
    let delElem = createElem("delete", "a", lDiv, attr);
    delElem.addEventListener("click", deleteComment);
  }
  elem.append(lDiv);
};

let setupTopic = function(topic) {
  console.log("made callback");
  let titleDiv = document.getElementById('dv-topic-title');
  let voteDiv = document.getElementById('dv-topic-vote');
  let voteBtn = document.getElementById("dv-topic-vote-btn");
  voteBtn.setAttribute("data-topicId",pageTopic.id);
  voteBtn.addEventListener("click",submitVote);
  let descDiv = document.getElementById('dv-topic-desc');
  let commentsDiv = document.getElementById('dv-comment-box');

  titleDiv.innerHTML = topic.name;
  voteDiv.innerHTML = topic.votes;
  descDiv.innerHTML = topic.description;

  for (comment in topic.comments) {
      addComment(topic.comments[comment],commentsDiv);
  }
};

function showNewCommentForm() {
  let newCommentBox = document.getElementById('dv-new-comment');
  let createLink = document.getElementById('dv-comment-create');
  createLink.style.visibility = "hidden";
  newCommentBox.style.visibility = "visible";
}

function cancelNewCommentForm() {
  let newCommentBox = document.getElementById('dv-new-comment');
  let createLink = document.getElementById('dv-comment-create');
  let newCommentForm = document.getElementById('frm-new-comment');
  newCommentForm.reset();
  let commentMessage = document.getElementById('npt-comment');
  let submitBtn = document.getElementById("frm-submit");
  submitBtn.value = "create";
  commentMessage.innerHTML = "";
  createLink.style.visibility = "visible";
  newCommentBox.style.visibility = "hidden";
  if (submitEvent !== "new") {
    submitBtn.addEventListener("click", doNewComment);
    submitBtn.removeEventListener("click", updateComment);
    submitEvent = "new";
  }
}

function doNewComment(event) {
  let commentMessage = document.getElementById('npt-comment').value;
  let userID = sessionStorage.getItem("userId");
  let newComment = new Comment(0, pageTopic.id, userID ,commentMessage);
  newComment.createComment(clbkCreateComment);
  event.preventDefault();
  return false;
}

function clbkCreateComment(response,status) {
  if (status == 200 && typeof response.id == 'number') {
    let returnedComment = new Comment();
    returnedComment.objectLoad(response);
    let divComment = document.getElementById('dv-comment-box');
    addComment(returnedComment,divComment);
    cancelNewCommentForm();
  } else {
    let elem = document.getElementById("dv-new-comment");
    showError("Error creating comment.", elem);
    console.log(response);
    return false;
  }
}
function prepUpdateComment(event) {
  let obj = event.target || event.srcElement;
  let id = obj.getAttribute("data-id");
  let commentElem = document.getElementById("comment-id-"+id);
  let commentBox = document.getElementById("npt-comment");
  commentBox.innerHTML = commentElem.innerHTML;
  let submitBtn = document.getElementById("frm-submit");
  submitBtn.value = "update";
  if (submitEvent === "new") {
    submitBtn.removeEventListener("click", doNewComment);
    submitBtn.addEventListener("click", updateComment);
    submitEvent = "update";
  }
  sessionStorage.setItem("commentUpdateId",id);
  showNewCommentForm();
  event.preventDefault();
  return false;
}
function updateComment(event) {
  let id = sessionStorage.getItem("commentUpdateId")
  let userId = sessionStorage.getItem("userId");
  let topicId = pageTopic.id;
  let message = document.getElementById('npt-comment').value;
  Comment.prototype.staticUpdateComment(id, userId, topicId, message, clbkUpdateComment)
  event.preventDefault();
  return false;
}
function clbkUpdateComment(response, status) {
  if (status == 200 && typeof response.id == 'number') {
    let commentId = sessionStorage.getItem("commentUpdateId");
    let elem = document.getElementById("comment-id-"+commentId);
    elem.innerHTML = response.message;
    sessionStorage.removeItem("commentUpdateId");
    cancelNewCommentForm();
  } else {
    // show error
    console.log("error in updating.");
  }
  event.preventDefault();
  return false;
}

function deleteComment(event) {
  let obj = event.target || event.srcElement;
  let id = obj.getAttribute("data-id");
  let userId = sessionStorage.getItem("userId");
  sessionStorage.setItem("commentDeleteId",id);
  Comment.prototype.staticDeleteComment(id, userId, clbkDeleteComment)
  event.preventDefault();
  return false;
}
function clbkDeleteComment(response, status) {
  if (status == 200) {
    if (response.message == "Comment Successfully Deleted") {
      let commentId = sessionStorage.getItem("commentDeleteId");
      let elem = document.getElementById("dv-comment-id-"+commentId);
      elem.parentNode.removeChild(elem);
      sessionStorage.removeItem("commentDeleteId");
    }
  } else {
    // show error
    console.log("error in deleting.");
  }
}
