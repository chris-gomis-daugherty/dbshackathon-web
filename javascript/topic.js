/* Topic controller */
let pageTopic;
let submitComment;
var g_commenters = {};
var g_commenter_cnt;
var g_commenter_received = 0;
let commenterIdList = [];

let startTopicPage = function() {
  let userID = sessionStorage.getItem("userId");
  let url = new URL(window.location.href);
  let topicID = url.searchParams.get("topicid");
  pageTopic = new Topic(topicID);
  pageTopic.getTopic(userID);
  let submitBtn = document.getElementById("frm-comment-submit");
  submitBtn.addEventListener("click", doNewComment, false);
  let cancelBtn = document.getElementById("frm-comment-cancel");
  cancelBtn.addEventListener("click", cancelNewCommentForm)
  submitComment = "new";
  //  there is no user id associated with topics
  //  if (pageTopic.userId == g_loggedInUserId) {
    let topicFooter = document.getElementById("dv-topic-footer");
    let attr = { "href": "topiccrud.html", "class": "flatButtons", "id": "a-update-link" };
    let editLink = createElem("update", "a", topicFooter, attr);
    attr = { "href": "", "class": "flatButtons", "id": "a-delete-link" };
    let deleteLink = createElem("delete", "a", topicFooter, attr);
    editLink.addEventListener("click", prepUpdateTopic);
    deleteLink.addEventListener("click", deleteTopic);
    let topicSubmit = document.getElementById("frm-topic-submit");
    topicSubmit.addEventListener("click", updateTopic);
    let topicCancel = document.getElementById("frm-topic-cancel");
    topicCancel.addEventListener("click", cancelUpdateTopic);
  //}
};

let addComment = function(comment,elem, userName) {
  let lDiv = document.createElement('div');
  lDiv.id = "dv-comment-id-"+comment.id;
  lDiv.setAttribute("class", "commmentGrid");

  let attr = { "class": "commenter_name", "data-user-id": comment.userId };
  let tmpName = userName || comment.userId;
  let nameElem = createElem(tmpName, "div", lDiv, attr);
  nameElem.addEventListener("click", goToUserPage);
  let tempUserID = comment.userId.toString();
  commenterIdList = arrayPushIfUnique(commenterIdList, tempUserID );
  attr = { "class": "comment_id" };
  createElem(comment.id, "span", lDiv, attr);
  let comElem = createElem(comment.message, "div", lDiv, {"class":"dv_comment"});
  comElem.id = "comment-id-"+comment.id;

  // update & delete should only display for original creator
  if (comment.userId == g_loggedInUserId) {
    let attr = {"class": "dv_update_delete"};
    let divElem = createElem("", "div", lDiv, attr);
    attr = { "href": "", "class": "spn_update_link flatButtons", "data-id": comment.id };
    let updElem = createElem("update", "a", divElem, attr);
    updElem.addEventListener("click", prepUpdateComment);
    attr = { "href": "", "class": "spn_delete_link flatButtons", "data-id": comment.id };
    let delElem = createElem("delete", "a", divElem, attr);
    delElem.addEventListener("click", deleteComment);
  }
  elem.append(lDiv);
};

let setupTopic = function(topic) {
  let titleDiv = document.getElementById('dv-topic-title');
  let voteDiv = document.getElementById('dv-topic-vote');
  let voteBtn = document.getElementById("a-topic-vote-btn");
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
  supplyUserInfo(commenterIdList);
};

let cancelUpdateTopic = function(event) {
  let editDiv = document.getElementById("dv-edit-topic");
  editDiv.style.display = "none";
  let frmTitle = document.getElementById("npt-topic-name")
  let frmDesc = document.getElementById("ta-topic-description");
  frmTitle.value = "";
  frmDesc.innerHTML = "";
  let topicDiv = document.getElementById("dv-topic");
  topicDiv.style.display = "grid";
  event.preventDefault();
  return false;
};

let prepUpdateTopic = function(event) {
  let topicDiv = document.getElementById("dv-topic");
  topicDiv.style.display = "none";
  let title = document.getElementById("dv-topic-title");
  let description = document.getElementById("dv-topic-desc");
  let frmTitle = document.getElementById("npt-topic-name")
  let frmDesc = document.getElementById("ta-topic-description");
  frmTitle.value = title.innerHTML;
  frmDesc.innerHTML = description.innerHTML;
  let editDiv = document.getElementById("dv-edit-topic");
  editDiv.style.display = "grid";
  event.preventDefault();
  return false;
};

let updateTopic = function(event) {
  let id = pageTopic.id;
  let name = document.getElementById("npt-topic-name").value;
  let descTextArea = document.getElementById("ta-topic-description");
  let description = descTextArea.value;
  Topic.prototype.staticUpdateTopic(id, g_loggedInUserId, name, description, clbkUpdateTopic);
  event.preventDefault();
  return false;
};
let clbkUpdateTopic = function(response, status) {
  if (status == 200 && typeof response.id == "number") {
    let titleDiv = document.getElementById("dv-topic-title");
    let descDiv = document.getElementById("dv-topic-desc");
    let voteDiv = document.getElementById("dv-topic-vote");
    titleDiv.innerHTML = response.name;
    descDiv.innerHTML = response.description;
    voteDiv.innerHTML = response.votes;
    let topicDiv = document.getElementById("dv-topic");
    topicDiv.style.display = "grid";
    let editDiv = document.getElementById("dv-edit-topic");
    editDiv.style.display = "none";
  } else {
    showError("Error updating topic: "+ response);
  }
};

let deleteTopic = function(event) {
  let id = pageTopic.id;
  Topic.prototype.staticDeleteTopic(id, g_loggedInUserId, clbkDeleteTopic);
  event.preventDefault()
  return false;
};
let clbkDeleteTopic = function(response, status) {
  if (status == 200 && response.message == "Topic Successfully Deleted") {
    window.location.href="listing.html";
  } else {
    showError("Error deleting topic: "+ response);
  }
};

/* comment functions */
let showNewCommentForm = function() {
  let newCommentBox = document.getElementById('dv-new-comment');
  let createLink = document.getElementById('dv-comment-create');
  createLink.style.visibility = "hidden";
  newCommentBox.style.display = "grid";
};

let cancelNewCommentForm = function(event) {
  let newCommentBox = document.getElementById('dv-new-comment');
  let createLink = document.getElementById('dv-comment-create');
  let newCommentForm = document.getElementById('frm-new-comment');
  newCommentForm.reset();
  let commentMessage = document.getElementById('npt-comment');
  let submitBtn = document.getElementById("frm-comment-submit");
  submitBtn.value = "create";
  commentMessage.innerHTML = "";
  createLink.style.visibility = "visible";
  newCommentBox.style.display = "none";

  if (submitComment !== "new") {
    let hiddenCommentId = sessionStorage.getItem("hiddenCommentForUpdate");
    let updateCommentElem = document.getElementById(hiddenCommentId);
    updateCommentElem.style.display = "grid";
    submitBtn.removeEventListener("click", updateComment, false);
    submitBtn.addEventListener("click", doNewComment, false);
    let commentFooterElem = document.getElementById("dv-comments-footer");    
    commentFooterElem.parentNode.insertBefore(newCommentBox, commentFooterElem);
    submitComment = "new";
  }
  if(event) { event.preventDefault(); }
  return false;
};

let doNewComment = function(event) {
  let commentMessage = document.getElementById('npt-comment').value;
  let userID = sessionStorage.getItem("userId");
  let newComment = new Comment(0, pageTopic.id, userID ,commentMessage);
  newComment.createComment(clbkCreateComment);
  event.preventDefault();
  return false;
};

let clbkCreateComment = function(response,status) {
  if (status == 200 && typeof response.id == 'number') {
    let returnedComment = new Comment();
    returnedComment.objectLoad(response);
    let divComment = document.getElementById('dv-comment-box');
    let fullName = sessionStorage.getItem("userFullName");
    addComment(returnedComment,divComment,fullName);
    cancelNewCommentForm();
  } else {
    let elem = document.getElementById("dv-new-comment");
    showError("Error creating comment." + response);
    return false;
  }
};

let prepUpdateComment = function(event) {
  let obj = event.target || event.srcElement;
  let id = obj.getAttribute("data-id");
  let dvCommentGrid = document.getElementById("dv-comment-id-"+id);
  sessionStorage.setItem("hiddenCommentForUpdate", "dv-comment-id-"+id)
  let commentEditGrid = document.getElementById("dv-new-comment");
  let commentElem = document.getElementById("comment-id-"+id);
  let commentBox = document.getElementById("npt-comment");
  commentBox.innerHTML = commentElem.innerHTML;
  let submitBtn = document.getElementById("frm-comment-submit");
  submitBtn.value = "update";
  if (submitComment === "new") {
    submitBtn.removeEventListener("click", doNewComment, false);
    submitBtn.addEventListener("click", updateComment, false);
    submitComment = "update";
  }
  dvCommentGrid.parentNode.insertBefore(commentEditGrid,dvCommentGrid);
  dvCommentGrid.style.display = "none";
  commentEditGrid.style.display = "grid";
  sessionStorage.setItem("commentUpdateId",id);
  showNewCommentForm();
  event.preventDefault();
  return false;
};
let updateComment = function(event) {
  let id = sessionStorage.getItem("commentUpdateId")
  let userId = sessionStorage.getItem("userId");
  let topicId = pageTopic.id;
  let message = document.getElementById('npt-comment').value;
  Comment.prototype.staticUpdateComment(id, userId, topicId, message, clbkUpdateComment)
  event.preventDefault();
  return false;
};
let clbkUpdateComment = function(response, status) {
  if (status == 200 && typeof response.id == 'number') {
    let commentId = sessionStorage.getItem("commentUpdateId");
    let elem = document.getElementById("comment-id-"+commentId);
    elem.innerHTML = response.message;
    sessionStorage.removeItem("commentUpdateId");
    cancelNewCommentForm();
  } else {
    showError("Error updating comment: " + response);
  }
  event.preventDefault();
  return false;
};

let deleteComment = function(event) {
  let obj = event.target || event.srcElement;
  let id = obj.getAttribute("data-id");
  let userId = sessionStorage.getItem("userId");
  sessionStorage.setItem("commentDeleteId",id);
  Comment.prototype.staticDeleteComment(id, userId, clbkDeleteComment)
  event.preventDefault();
  return false;
};
let clbkDeleteComment = function(response, status) {
  if (status == 200) {
    if (response.message == "Comment Successfully Deleted") {
      let commentId = sessionStorage.getItem("commentDeleteId");
      let elem = document.getElementById("dv-comment-id-"+commentId);
      elem.parentNode.removeChild(elem);
      sessionStorage.removeItem("commentDeleteId");
    }
  } else {
    showError("Error deleting comment: " + response);
  }
};
/* for user comments */
let supplyUserInfo = function(userIdList) {
  g_commenter_cnt = userIdList.length;
  let i;
  for (i=g_commenter_cnt; i == 0, i--; ) {
    userId = userIdList[i];
    if (i == 1) { aryLen = true; }
    User.prototype.getUserInfo(userId, clbksupplyUserInfo);
  }
};

let clbksupplyUserInfo = function(response, status) {
  if (status == 200 && typeof response.id == "number" ) {
    let userId = response.id.toString();
    let name = response.first_name + " " + response.last_name;
    g_commenters[userId] = name;
    g_commenter_received++;
    if ( g_commenter_received === g_commenter_cnt ) { finishedUserList(); }
  } else {
    showError("Error getting commenters information: " + response);
  }
};

let finishedUserList = function() {
  let commentDiv = document.getElementById("dv-comment-box");
  let commentDivList = commentDiv.querySelectorAll("div.commenter_name");
  let loopLen = commentDivList.length;
  for (let i=0; i < loopLen; i++) {
    let elem = commentDivList[i];
    let userId = elem.getAttribute("data-user-id").toString();
    elem.innerHTML = g_commenters[userId];
  }
};

let goToUserPage = function(event) {
  let elem = event.target;
  let userId = elem.getAttribute("data-user-id");
  window.location.href = "user.html?userid=" +  userId;
};
