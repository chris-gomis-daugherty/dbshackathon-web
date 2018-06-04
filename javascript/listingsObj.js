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
