let Comment = (function() {
  let CommentProto = {
    objectLoad: function(data) {
      this.id = data.id;
      this.topicId = data.topic_id;
      this.userId = data.user_id;
      this.message = data.message;
    },
    createComment: function(callback) {
      let header = { "USER_ID": this.userId };
      let payload = JSON.stringify({ "topic_id": this.topicId, "message": this.message });
      callServer("POST","comments",header,payload, callback);
    },
    updateComment: function(callback) {
      let header = { "USER_ID": this.userId };
      let payload = JSON.stringify({"id":this.id,"topic_id":this.topicId,"message":this.message});
      callServer("PUT","comments/"+this.id,header,payload, callback);
    },
    staticUpdateComment: function(id, userId, topicId, message, callback) {
      let header = { "USER_ID": userId };
      let payload = JSON.stringify({"id":id,"topic_id":topicId,"message":message});
      callServer("PUT","comments/"+id,header,payload, callback);
    },
    deleteComment: function(callback) {
      let header = { "USER_ID": this.userId };
      callServer("DELETE","comments/"+this.id,header,"", callback);
    },
    staticDeleteComment: function(id, userId, callback) {
      let header = { "USER_ID": userId };
      callServer("DELETE","comments/"+id,header,"", callback);
    }
  };

  function theComment(id, topicId, userId, message) {
      this.id = id;
      this.topicId = topicId;
      this.userId = userId;
      this.message = message;
  };
  theComment.prototype = CommentProto;

  return theComment;
})();
