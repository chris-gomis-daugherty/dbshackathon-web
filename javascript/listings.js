/* Listing Object */
let Listing = (function() {
  let listingProto = {
    getListings: function(userID) {
      console.log("calling get list");
      let header = { "USER_ID": userID };
      callServer("GET","topics",header,"",this.clbkGetListings);
    },
    clbkGetListings: function(data) {
      console.log("made callback");
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
  console.log("starting listpage, user: "+ loggedInUserId);
  theList.getListings(loggedInUserId);
}

function addListing(data,elem) {
  let lDiv = document.createElement('div');
  createElem(data.id, "span", lDiv);
  let attr = { "href": "topic.html?topicid=" + data.id}
  createElem(data.name, "a", lDiv, attr);
  attr = { "id": "listing-vote-topic-"+ data.id };
  createElem(data.votes, "span", lDiv, attr);
  // vote button
  attr = { "href": "", "data-topicId": data.id, "class": "voteBtn"};
  let voteElem = createElem("+", "a", lDiv, attr);
  voteElem.addEventListener("click",submitVote);

  createElem(data.description, "div", lDiv);
  elem.append(lDiv);
}

function doNewListing() {
  let topicName = document.getElementById('npt-topic-name').value;
  let topicDesc = document.getElementById('npt-topic-desc').value;
  let newTopic = new Topic(0, topicName, topicDesc, 0);
  let userID = sessionStorage.getItem("userId");
  newTopic.createTopic(userID, finishCreateListing);
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
