let loggedInUserId = sessionStorage.getItem("userId");
if (loggedInUserId == null || loggedInUserId == "") {
  window.location.href = "index.html";
}
