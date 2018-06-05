/* Listing Object */
let Listing = (function() {
  let listingProto = {
    getListings: function(userID, callback) {
      let header = { "USER_ID": userID };
      callServer("GET","topics",header,"",callback);
    },
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
