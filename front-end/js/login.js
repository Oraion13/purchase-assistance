const username = document.getElementById("username");
const password = document.getElementById("password");
const login_form = document.getElementById("login_form");

function submit_form(e) {
  e.preventDefault();

  const login = {
    admin_name: username.value,
    password: password.value,
  };

  const xhr = new XMLHttpRequest();

  xhr.open("POST", `../api/login/login.php`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const got = JSON.parse(xhr.responseText);

      if (got.error) {
        window.alert(got.error);
      } else {
        window.localStorage.setItem("user", JSON.stringify(got));
        window.location.replace("./form.html");
      }
    }
  };

  xhr.send(JSON.stringify(login));
}

// initially
function initialize() {
  if (JSON.parse(window.localStorage.getItem("user")).admin_name) {
    window.location.replace("./form.html");
  }
}

login_form.addEventListener("submit", submit_form);
window.addEventListener("DOMContentLoaded", initialize);
