$("#headerText").click(function () {
  window.location.replace("/");
})

$("#home").click(function () {
  window.location.replace("/");
})

$("#projects").click(function () {
  window.location.replace("/projects");
})

$("#playground").click(function () {
  window.location.replace("/playground");
})

$("#contact").click(function () {
  window.location.replace("/contact");
})

$('#chatSignUp').click(function () {
	window.location.replace("/chat_sign_up");
})

$('#chatLogIn').click(function () {
  window.location.replace("/chat_log_in");
})

$('#signUpSubmitCan').click(function (event) {

  var userName = $('#signUpUserNameInput').val();
  createCookie('userName', userName, 1)

})

$('#signUpSubmitCan').keypress(function (event) {

  if (event.which == 13) {
    var userName = $('#signUpUserNameInput').val();
    createCookie('userName', userName, 1)
  }

})

$('#logInSubmitCan').click(function (event) {

  var userName = $('#logInUserNameInput').val();
  createCookie('userName', userName, 1)

})

$('#logInSubmitCan').click(function (event) {

  if (event.which == 13) {
    var userName = $('#logInUserNameInput').val();
    createCookie('userName', userName, 1)
  }

})

//COOKIE HANDLERS
function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name,"",-1);
}