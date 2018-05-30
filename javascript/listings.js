let fillListings = function(data) {
  console.log("made callback");
  let loopLen = data.length;
  let i;
  let divList = document.createElement('div');

  for(i = 0; i < loopLen; i++) {
    let lspan = document.createElement('span');
    lspan.innerHTML = data[i].name;
    divList.appendElement(lspan);
  }
  document.getElementById('div-listings').appendElement(divList);
};

let Listing = (function() {
  let listingProto = {
    getListings: function() {
      //action, url, payload, callback
      console.log("calling get list");
      callServer("GET","topics","",fillListings);
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
  console.log("starting listpage");
  theList.getListings();
}
