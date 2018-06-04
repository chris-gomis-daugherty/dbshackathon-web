/* Listing Object */
let Listing = (function() {
  let listingProto = {
    getListings: function(userID) {
      let header = { "USER_ID": userID };
      callServer("GET","topics",header,"",this.clbkGetListings);
    },
    clbkGetListings: function(data) {
      let i; let loopLen = data.length;
      let divList = document.getElementById('dv-listings');
      for(i = 0; i < loopLen; i++) { addListing(data[i],divList); }
    },
    prepNewListing: function() {
      // create blank boxes to fill with save button
      console.log("making empty topic boxes");
    },
    createNewListing: function() {
      // validate topic values
      // if error display interval
      // send ajax create request
      return "Goodbye, " + this.name;
    },
    clbkCreateListing: function() {
      // if successful replace entry boxes with topic standard topic row
    }
  };

  function theListing(id, name, description, votes) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.votes = votes;
  };
  theListing.prototype = listingProto;

  return theListing;
})();
/* end listing object */

let theList = new Listing();

/* view controller related js */
function startListingPage() {
  console.log("starting listpage, user: " + g_loggedInUserId);
  theList.getListings(g_loggedInUserId);
  let cancelBtn = document.getElementById("frm-listing-cancel");
  cancelBtn.addEventListener("click",  cancelNewListingForm);
  let submitBtn = document.getElementById("frm-listing-submit");
  submitBtn.addEventListener("click", doNewListing);
}

function addListing(data,elem) {
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

function doNewListing(event) {
  let topicName = document.getElementById('npt-topic-name').value;
  let topicDesc = document.getElementById('npt-topic-desc').value;
  let newTopic = new Topic(0, topicName, topicDesc, 0);
  let userID = sessionStorage.getItem("userId");
  newTopic.createTopic(userID, finishCreateListing);
  event.preventDefault();
  return false;
}

function finishCreateListing(response,resCode) {
  if (resCode == 200 && typeof response.id == 'number') {
    let returnedTopic = new Topic().objectLoad(response);
    let divList = document.getElementById('dv-listings');
    addListing(returnedTopic,divList);
    cancelNewListingForm();
  } else {
    let elem = document.getElementById("dv-new-listing");
    showError("Error creating topic.", elem);
    console.log(response);
    return false;
  }
}

function showNewListingForm() {
  let newListingDiv = document.getElementById('dv-new-listing');
  let createLink = document.getElementById('dv-listing-create');
  createLink.style.visibility = "hidden";
  newListingDiv.style.visibility = "visible";
}

function cancelNewListingForm() {
  let newListingDiv = document.getElementById('dv-new-listing');
  let createLink = document.getElementById('dv-listing-create');
  let newTopicForm = document.getElementById('frm-new-listing');
  newTopicForm.reset();
  createLink.style.visibility = "visible";
  newListingDiv.style.visibility = "hidden";
}
