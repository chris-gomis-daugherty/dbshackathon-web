let User = (function() {
  let userProto = {
    login: function(email,password) {
      //callServer("GET")
      let payload = JSON.stringify({ "email":email, "password":password })
      callServer("POST","login",payload,this.checkLogin);
    },
    logout: function() {

    },
    authenticate: function() {
      return "Goodbye, " + this.firstName;
    },
    checkLogin: function(response) {
      console.log("check login");
      console.log(response);
    }
  };

  function theUser(email, firstName, lastName) {
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

function doLogin() {
  console.log("doing login");
  //let name = document.getElementById("username");
  //let pass = document.getElementById("password");

  let loginUser = new User();

  //loginUser.login(name.value,pass.value);
  loginUser.login("test@email.com","password");
}
/*
let user1 = new User("test@test.com", "One", "Tester");
let user2 = new User("qaer@test.com", "Two", "Qaer");

console.log(user1.greet === user2.greet);
console.log(user2.authenticate());
console.log(user1.fullName);
*/
