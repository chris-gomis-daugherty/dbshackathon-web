/* User Controller */
let doRegister = function() {
  let elem = document.getElementById("dv-reg-form");

  let firstName = document.getElementById("npt-reg-firstName").value;
  let lastName = document.getElementById("npt-reg-lastName").value;
  let email = document.getElementById("npt-reg-username").value;
  let pass = document.getElementById("npt-reg-password").value;
  let pass2 = document.getElementById("rpt-reg-password").value;

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
};
