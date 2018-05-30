let callServer = function(action, url, payload, callback) {

  let jsonhttp = new XMLHttpRequest();
  let sendurl = "http://192.168.99.100:8080/api/" + url;
  let response;

  console.log(action + " " + url + " " + payload )

  jsonhttp.onreadystatechange = function() {
    if (jsonhttp.readyState == XMLHttpRequest.DONE && jsonhttp.status == 200) {
      response = JSON.parse(this.responseText);
      callback(response);
    } else {
      console.log("status: " + jsonhttp.status + " - readyState: " + jsonhttp.readyState);
      if (jsonhttp.readyState == XMLHttpRequest.DONE) {
        console.log("error: " + jsonhttp.responseText);
      }
    }
  };

  jsonhttp.open(action, sendurl, true);
  if (action == ("POST")) {
    jsonhttp.setRequestHeader("Content-Type","application/json");
  }
  //jsonhttp.setRequestHeader("USER_ID","1");
  jsonhttp.send(payload);
};
