var g_loggedInUserId = sessionStorage.getItem("userId");
if (g_loggedInUserId == null || g_loggedInUserId == "" || g_loggedInUserId == NaN) {
  sessionStorage.clear();
  window.location.href = "index.html";
}

let logout = function() {
  let userID = sessionStorage.getItem("userId");
  let headers = { "USER_ID": userID };
  callServer("GET","logout",headers,"",clbkLogout);
};
let clbkLogout = function(response) {
  sessionStorage.clear();
  window.location.href = "/jsathon";
};
