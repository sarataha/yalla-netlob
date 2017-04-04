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