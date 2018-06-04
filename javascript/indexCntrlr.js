let startLoginPage = function() {
  let submitBtn = document.getElementById("frm-login-submit");
  submitBtn.addEventListener("click", doLogin);
};

let doLogin = function(event) {
  let name = document.getElementById("npt-username").value;
  let pass = document.getElementById("npt-password").value;
  let loginUser = new User(name);
  loginUser.login(pass);
  event.preventDefault();
  return false;
};
