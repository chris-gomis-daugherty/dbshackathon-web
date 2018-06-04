let User = (function() {
  let userProto = {
    login: function(password) {
      //let payload = "{ \"email\":\"" + email +"\", \"password\":\"" + password + "\" }";
      let payload = JSON.stringify({ "email": this.email, "password": password });
      callServer("POST","login","", payload, this.clbkLogin);
    },
    clbkLogin: function(response,status) {
      if (status == 200 && typeof response.id == 'number') {
        storeUser(response);
        window.location.href = "listing.html";
      } else {
        let elem = document.getElementById("dv-form");
        showError("User not found", elem);
        return false;
      }
    },
    logout: function() {
      let headers = { "USER_ID": this.id };
      callServer("GET","logout",headers,"", this.clbkLogout);
    },
    clbkLogout: function(response) {
      console.log(response);
    },
    registerUser: function(password) {
      let loadObj = {"email": this.email, "password": password, "first_name": this.firstName,	"last_name": this.lastName };
      let payload = JSON.stringify(loadObj);
      callServer("POST","register","", payload, this.clbkRegisterUser);
    },
    clbkRegisterUser: function(response) {
      if (response.name == "error") {
        let elem = document.getElementById("dv-form");
        let msg = "Error registering user.  error code " + response.code + ": " + response.detail;
        showError(msg, elem);
        return false;
      } else if (typeof response.id == 'number') {
        storeUser(response);
        window.location.href = "listing.html";
      }
    },
    getUserInfo: function(userId, callback, passValue) {
      let headers = { "USER_ID": g_loggedInUserId };
      callServer("GET","users/"+userId, headers, "", callback, passValue);
    },
    updateUserInfo: function(data) {
      let headers = { "USER_ID": g_loggedInUserId };
      let loadObj = { "id": data.id, "email": data.email, "first_name": data.firstName, "last_name": data.lastName }
      let payload = JSON.stringify(loadObj);
      callServer("PUT","users/"+data.id, headers, payload, clbkUpdateUserInfo);
    }
  };

  function theUser(email, firstName, lastName, id) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.id = id;
  };

  theUser.prototype = userProto;

  Object.defineProperty(theUser.prototype, "fullName", {
    get: function() {
      return this.firstName + " " + this.lastName;
    }
  });

  return theUser;
})();

let storeUser = function(response) {
  sessionStorage.setItem("userId", response.id);
  sessionStorage.setItem("userEmail", response.email);
  sessionStorage.setItem("userFirstName", response.first_name);
  sessionStorage.setItem("userLastName", response.last_name);
  let fullName = response.first_name + " " + response.last_name
  sessionStorage.setItem("userFullName", fullName);
};

function doLogin() {
  console.log("doing login");
  let name = document.getElementById("username").value;
  let pass = document.getElementById("password").value;
  let loginUser = new User(name);
  loginUser.login(pass);
}

function doRegister() {
  console.log("doing register");
  let elem = document.getElementById("dv-form");

  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let email = document.getElementById("username").value;
  let pass = document.getElementById("password").value;
  let pass2 = document.getElementById("rpt-password").value;

  if (firstName.length == 0 || firstName == "") {
    showError("First name cannot be blank.", elem); return false;
  }
  if (lastName.length == 0 || lastName == "") {
    showError("Last name cannot be blank.", elem); return false;
  }

  let resultPass = validatePassword(pass,pass2);
  if (resultPass != 'success') {
    showError(resultPass, elem); return false;
  }
  let resultEmail = validateEmail(email);
  if (!resultEmail) {
    showError("Invalid email address.", elem); return false;
  }

  let regUser = new User(email, firstName, lastName);
  regUser.registerUser(pass);
}

/* user page code */
let startUserPage = function () {
  let url = new URL(window.location.href);
  let userId = url.searchParams.get("userid");
  User.prototype.getUserInfo(userId, clbkGetUserInfo);
  let updateLink = document.getElementById("a-user-update");
  updateLink.addEventListener("click", updateLinkClick);
  let submitBtn = document.getElementById("frm-user-submit");
  submitBtn.addEventListener("click", prepUpdateUserInfo);
}

let clbkGetUserInfo = function(response,status) {
  if (status == 200 && typeof response.id == "number") {
    let user = new User(response.email, response.first_name, response.last_name, response.id);
    let userId = user.id;
    fillUserInfo(user);
    if (userId == g_loggedInUserId) {
      let elemUserUpdate = document.getElementById("dv-user-update");
      elemUserUpdate.style.visibility = 'visible';
    }
  } else {
    let elem = document.getElementById("div-error-message");
    let errorMsg = "Error getting user: " + respone;
    showError(errorMsg, elem); return false;
  }
}

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
  dvUserForm.style.display = "block";
  let dvUserInfo = document.getElementById("dv-user-info");
  dvUserInfo.style.display = "none";

  event.preventDefault();
  return false;
}

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
}

let cancelUserForm = function() {
  let dvUserForm = document.getElementById("dv-user-form");
  let dvUserInfo = document.getElementById("dv-user-info");
  let userForm = document.getElementById("frm-user-update");
  userForm.reset();
  dvUserForm.style.display = "none";
  dvUserInfo.style.display = "block";
}

let fillUserInfo = function(user) {
  let elemUserId = document.getElementById("dv-user-id");
  let elemUserEmail = document.getElementById("dv-user-email");
  let elemUserFirstName = document.getElementById("dv-user-firstName");
  let elemUserLastName = document.getElementById("dv-user-lastName");
  elemUserId.innerHTML = user.id;
  elemUserEmail.innerHTML = user.email;
  elemUserFirstName.innerHTML = user.firstName;
  elemUserLastName.innerHTML = user.lastName;
}

let clbkUpdateUserInfo = function(response,status) {
  if (status == 200 && typeof response.id == "number") {
    let updatedUser = new User(response.email, response.first_name, response.last_name. response.id);
    fillUserInfo(updatedUser);
  } else {
    let errorMsg = "Error updating user: " + respone;
    showError(errorMsg); return false;
  }
}
