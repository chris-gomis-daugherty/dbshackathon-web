var g_loggedInUserId = sessionStorage.getItem("userId");
if (g_loggedInUserId == null || g_loggedInUserId == "" || g_loggedInUserId == NaN) {
  window.location.href = "index.html";
}
