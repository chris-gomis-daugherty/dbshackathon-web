let callServer = function(action, url, headers, payload, callback) {

  let jsonhttp = new XMLHttpRequest();
//let sendurl = "http://192.168.99.100:8080/api/" + url;
  let sendurl = "/api/" + url;
  let response;

  jsonhttp.onreadystatechange = function() {
    if(this.readyState == XMLHttpRequest.DONE) {
      if ( this.status == 200) {
        response = JSON.parse(this.responseText);
        callback(response,this.status);
      } else {
        let errorStr = "status: " + this.status + " error: " + this.statusText;
        console.log(errorStr);
        callback(this.statusText,this.status);
      }
    }
  };
  jsonhttp.onerror = function(e) {
    console.log("internal xhr request error: " + e);
    showError(e);
  };

  jsonhttp.open(action, sendurl, true);

  if (action == ("POST") || action == ("PUT")) {
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

let showError = function(message) {
  let errormsg = document.getElementById('div-error-message');
  if (!errormsg) {
    let attr = { "id": "div-error-message" }
    let errormsg = document.createElem("message","div","body",attr);
  }
  errormsg.classList.remove("runFadeAnimation");
  errormsg.style.opacity = window.getComputedStyle(errormsg).opacity;
  errormsg.innerHTML = message;
  errormsg.style.display = "block";
  errormsg.classList.add("runFadeAnimation");
};

let validatePassword = function(pass,pass2) {
  if (pass.length < 8 ) { return "Password is too short"; }
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

let createElem = function(data, tag, appendTo, attributes) {
  let elem = document.createElement(tag);
  elem.innerHTML = data;
  if (attributes != null || attributes != "") {
    for (let attribute in attributes) {
      let attr = attribute;
      let attrVal = attributes[attr];
      if (attr == "href") {
        elem.href = attrVal;
      } else {
        elem.setAttribute(attr,attrVal);
      }
    }
  }
  appendTo.appendChild(elem);
  return elem;
};

let arrayPushIfUnique = function(theArray, value) {
  if (theArray.length > 0) {
    let idx = theArray.indexOf(value);
    if ( idx == -1 ) {
      theArray.push(value);
    }
  } else {
    theArray.push(value);
  }
  return theArray;
};
