/*var geddy;
window.geddy = geddy || {};
geddy.io = require('socket.io-client');
geddy.socket = geddy.io.connect('/');*/

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

})

$('#chatLogIn').click(function () {
  window.location.replace("/chat");
})