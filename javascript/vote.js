let submitVote = function(event) {
  let mainURL = new URL(window.location.href);
  let page = mainURL.pathname.substr(9,5);
  let callback;
  if (page == "listi") {
    callback = clbkVoteListPage;
  } else if (page == "topic" ) {
    callback = clbkVoteTopicPage;
  }
  let elem = event.target;
  let topicId = elem.getAttribute("data-topicId");
  sessionStorage.setItem("voteId", topicId);
  let header = { "USER_ID": g_loggedInUserId };
  let url = "topics/"+topicId+"/vote";
  callServer("GET",url,header,"",callback);
  event.preventDefault();
  return false;
};

let clbkVoteListPage = function(response, status) {
  if (status == 200 &&  typeof response.votes == "number") {
    let topicId = sessionStorage.getItem("voteId");
    let elemToUpdate = document.getElementById("listing-vote-topic-"+topicId);
    elemToUpdate.innerHTML = response.votes;
  } else {
    showError("Error casting vote: " + response);
  }
  sessionStorage.removeItem("voteId");
};

let clbkVoteTopicPage = function(response, status) {
  if (status == 200 &&  typeof response.votes == "number") {
    if (pageTopic.id == response.id) {
      let topicId = sessionStorage.getItem("voteId");
      let voteDiv = document.getElementById('dv-topic-vote');
      voteDiv.innerHTML = response.votes;
    }
  } else {
    showError("Error casting vote: " + response);
  }
  sessionStorage.removeItem("voteId");
}
