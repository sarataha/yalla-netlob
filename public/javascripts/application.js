var invited_modal = document.getElementById('invited-modal');
var joined_modal = document.getElementById('joined-modal');
var invited_friends = document.getElementById("invited-friends");
var joined_friends = document.getElementById('joined-friends');
var span = document.getElementsByClassName("close")[0];

invited_friends.onclick = function() {
	invited_modal.style.display = "block";
}

joined_friends.onclick = function() {
	joined_modal.style.display = "block";
}

span.onclick = function() {
	invited_modal.style.display = "none";
	joined_modal.style.display = "none";
}

window.onclick = function(event) {
	if (event.target == invited_modal) {
		invited_modal.style.display = "none";
	}
	else if (event.target == joined_modal) {
		joined_modal.style.display = "none";
	}
}


/*edit for the notfication bar */
  function myFunction() {
      document.getElementById("mynotification").classList.toggle("show");
  }
  // Close the notification if the user clicks outside of it
  window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
      var mynotification = document.getElementById("mynotification");
        if (mynotification.classList.contains('show')) {
          mynotification.classList.remove('show');
        }
    }
  }
  /*end of notification bar */

// password confirmation
var password = document.getElementById("password")
  , confirm_password = document.getElementById("confirm_password");

function validatePassword(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;