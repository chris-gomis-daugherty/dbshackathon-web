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
        showError("Error logging in: status " + status + " " + response);
        return false;
      }
    },
    logout: function() {
      let headers = { "USER_ID": this.id };
      callServer("GET","logout",headers,"", this.clbkLogout);
    },
    clbkLogout: function(response) {
      if (status == 200) {
        sessionStorage.clear();
        window.location.href = "/jsathon";
      } else {
        showError("Error logging out: " + response);
      }
    },
    registerUser: function(password) {
      let loadObj = {"email": this.email, "password": password, "first_name": this.firstName,	"last_name": this.lastName };
      let payload = JSON.stringify(loadObj);
      callServer("POST","register","", payload, this.clbkRegisterUser);
    },
    clbkRegisterUser: function(response) {
      if (response.name == "error") {
        let msg = "Error registering user.  error code " + response.code + ": " + response.detail;
        showError(msg);
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
