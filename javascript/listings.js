let fillListings = function(data) {
  console.log("made callback");
  let loopLen = data.length;
  let i;
  let divList = document.createElement('div');

  let createSpan = function(data,appendTo) {
    let lSpan = document.createElement('span',);
    lSpan.className ="listSpan";
    lSpan.innerHTML = data;
    appendTo.appendChild(lSpan);
  };

  for(i = 0; i < loopLen; i++) {
    let lDiv = document.createElement('div');
    createSpan(data[i].id, lDiv);
    createSpan(data[i].name, lDiv);
    createSpan(data[i].votes, lDiv);
    createSpan(data[i].description, lDiv);
    divList.append(lDiv);
  }
  document.getElementById('div-listings').appendChild(divList);
};

let Listing = (function() {
  let listingProto = {
    getListings: function(userID) {
      //action, url, payload, callback
      console.log("calling get list");
      let header = { "USER_ID": userID };
      callServer("GET","topics",header,"",fillListings);
    },
    authenticate: function() {
      return "Goodbye, " + this.firstName;
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

let theList = new Listing();

function startListingPage() {
  let userID = sessionStorage.getItem("userId");
  console.log("starting listpage, user: "+ userID);
  theList.getListings(userID);
}
