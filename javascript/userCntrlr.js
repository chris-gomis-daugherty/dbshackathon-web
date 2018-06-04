/* user page code */
let startUserPage = function () {
  let url = new URL(window.location.href);
  let userId = url.searchParams.get("userid");
  User.prototype.getUserInfo(userId, clbkGetUserInfo);
  let updateLink = document.getElementById("a-user-update");
  updateLink.addEventListener("click", updateLinkClick);
  let submitBtn = document.getElementById("frm-user-submit");
  submitBtn.addEventListener("click", prepUpdateUserInfo);
};

let clbkGetUserInfo = function(response,status) {
  if (status == 200 && typeof response.id == "number") {
    let user = new User(response.email, response.first_name, response.last_name, response.id);
    let userId = user.id;
    fillUserInfo(user);
    if (userId == g_loggedInUserId) {
      let elemUserUpdate = document.getElementById("a-user-update");
      elemUserUpdate.style.visibility = 'visible';
    }
  } else {
    let elem = document.getElementById("div-error-message");
    let errorMsg = "Error getting user: " + respone;
    showError(errorMsg, elem); return false;
  }
};

let updateLinkClick = function(event) {
  let elemUserEmail = document.getElementById("dv-user-email");
  let elemUserFirstName = document.getElementById("dv-user-firstName");
  let elemUserLastName = document.getElementById("dv-user-lastName");
  let nptUserEmail = document.getElementById("npt-user-email");
  let nptUserFirstName = document.getElementById("npt-user-firstName");
  let nptUserLastName = document.getElementById("npt-user-lastName");

  nptUserEmail.value = elemUserEmail.innerHTML;
  nptUserFirstName.value = elemUserFirstName.innerHTML;
  nptUserLastName.value = elemUserLastName.innerHTML;

  let dvUserForm = document.getElementById("dv-user-form");
  dvUserForm.style.display = "grid";
  let dvUserInfo = document.getElementById("dv-user-info");
  dvUserInfo.style.display = "none";
  let aUpdateLink = document.getElementById("a-user-update");
  aUpdateLink.style.display = "none";
  event.preventDefault();
  return false;
};

let prepUpdateUserInfo = function(event) {
  let elemUserId = document.getElementById("dv-user-id");
  let nptUserEmail = document.getElementById("npt-user-email");
  let nptUserFirstName = document.getElementById("npt-user-firstName");
  let nptUserLastName = document.getElementById("npt-user-lastName")
  let data = [];
  data.id = elemUserId.innerHTML;
  data.email = nptUserEmail.value;
  data.firstName =  nptUserFirstName.value;
  data.lastName = nptUserLastName.value;
  User.prototype.updateUserInfo(data);
  event.preventDefault();
  return false;
};

let cancelUserForm = function() {
  let dvUserForm = document.getElementById("dv-user-form");
  let dvUserInfo = document.getElementById("dv-user-info");
  let userForm = document.getElementById("frm-user-update");
  userForm.reset();
  dvUserForm.style.display = "none";
  dvUserInfo.style.display = "grid";
  let aUpdateLink = document.getElementById("a-user-update");
  aUpdateLink.style.display = "grid";
};

let fillUserInfo = function(user) {
  let elemUserId = document.getElementById("dv-user-id");
  let elemUserEmail = document.getElementById("dv-user-email");
  let elemUserFirstName = document.getElementById("dv-user-firstName");
  let elemUserLastName = document.getElementById("dv-user-lastName");
  elemUserId.innerHTML = user.id;
  elemUserEmail.innerHTML = user.email;
  elemUserFirstName.innerHTML = user.firstName;
  elemUserLastName.innerHTML = user.lastName;
};

let clbkUpdateUserInfo = function(response,status) {
  if (status == 200 && typeof response.id == "number") {
    let updatedUser = new User(response.email, response.first_name, response.last_name. response.id);
    fillUserInfo(updatedUser);
  } else {
    let errorMsg = "Error updating user: " + respone;
    showError(errorMsg); return false;
  }
};
