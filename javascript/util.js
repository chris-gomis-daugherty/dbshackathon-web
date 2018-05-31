let callServer = function(action, url, headers, payload, callback) {

  let jsonhttp = new XMLHttpRequest();
//let sendurl = "http://192.168.99.100:8080/api/" + url;
  let sendurl = "/api/" + url;
  let response;

  //console.log(action + " " + url + " " + payload )

  jsonhttp.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE) {
      if (this.status == 200 || this.status == 400) {
        response = JSON.parse(this.responseText);
        callback(response);
      } else {
        console.log("status: " + this.status + " error: " + this.responseText);
      }
    }
  };

  jsonhttp.open(action, sendurl, true);
  if (action == ("POST")) {
    jsonhttp.setRequestHeader("Content-Type", "application/json");
  }
  if (headers != "" ) {
    for (let head in headers) {
      let headName = head;
      let headVal = headers[head];
      jsonhttp.setRequestHeader(headName,headVal);
    }
  }
  jsonhttp.send(payload);
};

let showError = function(message,elem) {
  let errormsg = document.getElementById('div-error-message');
  if (!errormsg) {
    let errormsg = document.createElement('div');
    errormsg.id = "div-error-message";
    errormsg.className = 'errorMsg';
    errormsg.innerHTML = message;
    elem.append(errormsg);
  } else {
    errormsg.innerHTML = message;
  }
};

let validatePassword = function(pass,pass2) {
  if (pass.length < 8 ) { return "too_short"; }
  let spaces = new RegExp(/\s/);
  let lower = new RegExp(/[a-z]/);
  let upper = new RegExp(/[A-Z]/);
  let number = new RegExp(/[\d]/);
  if (spaces.test(pass)) { return "Spaces are not allowed"; }
  if (!lower.test(pass)) { return "Password must contain one or more lowercase letters"; }
  if (!upper.test(pass)) { return "Password must contain one or more uppercase letters"; }
  if (!number.test(pass)) { return "Password must contain one or more numbers"; }
  if (pass != pass2) { return "Passwords do not match."; }
  return "success";
};

let validateEmail = function(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

let logout = function() {
  let userID = sessionStorage.getItem("userId");
  let headers = { "USER_ID": userID };
  callServer("GET","logout",headers,"",clbkLogout);
};
let clbkLogout = function(response) {
  console.log(response);
  sessionStorage.clear();
  window.location.href = "/jsathon";
};