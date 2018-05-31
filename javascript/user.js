let User = (function() {
  let userProto = {
    login: function(password) {
      //let payload = "{ \"email\":\"" + email +"\", \"password\":\"" + password + "\" }";
      let payload = JSON.stringify({ "email": this.email, "password": password });
      callServer("POST","login","", payload, this.clbkLogin);
    },
    clbkLogin: function(response) {
      if (!(response.userNotFound in window)) {
        let elem = document.getElementById("dv-form");
        showError("User not found", elem);
        return false;
      } else if (typeof response.id == 'number') {
        storeUser(response);
        window.location.href = "listing.html";
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
    }
  };

  function theUser(email, firstName, lastName) {
    this.id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
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
