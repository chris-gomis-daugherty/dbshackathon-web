/* Topic Object */
let Topic = (function() {
  let topicProto = {
    getTopic: function(userID) {
      let header = { "USER_ID": userID };
      callServer("GET","topics/"+this.id,header,"", this.clbkGetTopic);
    },
    clbkGetTopic: function(response,status) {
      if (status == 200 && typeof response.id == "number") {
        pageTopic.objectLoad(response);
        setupTopic(pageTopic);
      } else {
        showError("Error deleting comment: " + response);
      }
    },
    createTopic: function(userId, callback) {
      let header = { "USER_ID": userId };
      let payload = JSON.stringify({ "name": this.name, "description": this.description });
      callServer("POST","topics",header, payload, callback);
    },
    clbkCreateTopic: function(response) {
      if (status == 200 && typeof response.id == "number") {
        
      } else {
        showError("Error creating topic: " + response);
      }
    },
    staticUpdateTopic: function(id, userId, name, description, callback) {
      let header = { "USER_ID": userId };
      let payload =  JSON.stringify({ "name": name, "description": description });
      callServer("PUT","topics/"+id,header,payload, callback);
    },
    staticDeleteTopic: function(id, userId, callback) {
      let header = { "USER_ID": userId };
      callServer("DELETE", "topics/"+id, header,"", callback);
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
