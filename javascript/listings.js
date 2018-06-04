/* listing controller */
let theList = new Listing();

let startListingPage = function() {
  console.log("starting listpage, user: " + g_loggedInUserId);
  theList.getListings(g_loggedInUserId);
  let cancelBtn = document.getElementById("frm-listing-cancel");
  cancelBtn.addEventListener("click",  cancelNewListingForm);
  let submitBtn = document.getElementById("frm-listing-submit");
  submitBtn.addEventListener("click", doNewListing);
}

let addListing = function(data,elem) {
  let lDiv = document.createElement('div');
  lDiv.setAttribute("class", "dv-topic");
  let attr = { "class": "spn_topic_id" };
  createElem(data.id, "span", lDiv, attr);
  attr = { "href": "topic.html?topicid=" + data.id, "class": "a_topic_link" };
  createElem(data.name, "a", lDiv, attr);
  attr = { "id": "listing-vote-topic-"+ data.id, "class": "spn_topic_votes" };
  createElem(data.votes, "span", lDiv, attr);
  // vote button
  attr = { "href": "", "data-topicId": data.id, "class": "voteBtn"};
  let voteElem = createElem("+", "a", lDiv, attr);
  voteElem.addEventListener("click",submitVote);
  attr = { "class": "dv_topic_desc" };
  createElem(data.description, "div", lDiv, attr);
  elem.append(lDiv);
}

let doNewListing = function(event) {
  let topicName = document.getElementById('npt-list-topic-name').value;
  let topicDesc = document.getElementById('npt-topic-desc').value;
  let newTopic = new Topic(0, topicName, topicDesc, 0);
  let userID = sessionStorage.getItem("userId");
  newTopic.createTopic(userID, clbkNewListing);
  event.preventDefault();
  return false;
}

let clbkNewListing = function(response,resCode) {
  if (resCode == 200 && typeof response.id == 'number') {
    let returnedTopic = new Topic().objectLoad(response);
    let divList = document.getElementById('dv-listings');
    addListing(returnedTopic,divList);
    cancelNewListingForm();
  } else {
    let elem = document.getElementById("dv-new-listing");
    showError("Error creating topic.");
    console.log(response);
    return false;
  }
}

let showNewListingForm = function() {
  let newListingDiv = document.getElementById('dv-new-listing');
  let createLink = document.getElementById('dv-listing-create');
  createLink.style.visibility = "hidden";
  newListingDiv.style.visibility = "visible";
}

let cancelNewListingForm = function() {
  let newListingDiv = document.getElementById('dv-new-listing');
  let createLink = document.getElementById('dv-listing-create');
  let newTopicForm = document.getElementById('frm-new-listing');
  newTopicForm.reset();
  createLink.style.visibility = "visible";
  newListingDiv.style.visibility = "hidden";
}
