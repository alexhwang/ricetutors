function init_tutor() {
    $("#maintext").html("");
    
    $("#maintext").append("<p>Login with Facebook please!</p><br>");
    $("#maintext").append('<fb:login-button data-size="xlarge" scope="public_profile,email" onlogin="checkLoginState();" id="login_button"></fb:login-button><div id="status"></div>');
    init_fb();
}

function init_choose_class(username) {
    $("#maintext").html("");
    
    $("#maintext").append("<p>What classes can you help with?</p> <select id='helpselect'><option value='COMP140'>COMP 140</option><option value='ELEC220'>ELEC 220</option></select> <br><br>");
    
    $("#maintext").append("<button onclick='init_choose_availability(" + username + ")'>Next</button>");
    
    $("#maintext").append("<br><br><p>Your indicated availability:</p>");
    $.ajax({
        url: "php/retrieve-data-given-user.php?user_id=" + username,
        success: function (data) {
            $("#maintext").append(data);
        }
    })   
}

function init_choose_availability(username) {
    var indicated_class = $("#helpselect").val();
    console.log(indicated_class);
    
    $("#maintext").html("");
    $("#maintext").append("<p>When are you available?</p><br><br>")

    $("#maintext").append('Choose a date: <input type="text" id="datepicker" value="Click to pick a date"><br>Enter what times you are free: <input type="text" id="timepicker" placeholder="e.g. 3PM-5PM"><br><button onclick="add_availability('+username+',&#39;' +indicated_class+ '&#39;);">Submit Availability</button>');
    
    
    $("#datepicker").datepicker();
}

function add_availability(username, indicated_class) {
    var date = $("#datepicker").val();
    var time = $("#timepicker").val();
    
    $.ajax({
        url: "php/add-availability-data.php?user_id=" + username + "&" + "subject_code=" + indicated_class + "&date_available=" + date + "&timeslot_available=" + time,
        success: function (data) {
            if (data = "success") {
                $("#maintext").html("Success! Thanks!")
            }
        }
    });
}

// --------------------------------

function init_student() {
    $("#maintext").html("");
    
    $("#maintext").append("<p>What do you need help with?</p> <select id='subject'><option value='COMP140'>COMP 140</option><option value='ELEC220'>ELEC 220</option></select><br><br>");
    $("#maintext").append("<button onclick='show_results();'>Get Help!</button><div id='results'></div>");
}

function show_results() {
    $.ajax({
        url: "php/retrieve-availability-data.php?subject_code=" + $("#subject").val(),
        success: function(data) {     
            var str_tutorlist = data;
            str_tutorlist = str_tutorlist.slice(0,-1);
            
            var tutor = str_tutorlist.split(";");
            var tutor_dict = {};
            for (var j = 0; j< tutor.length; j++) {
                var newname = tutor[j].split(",")[0];
                var date_and_time = (tutor[j].split(",")[1] + ", " + tutor[j].split(",")[2]);
                if (newname in tutor_dict) {
                    tutor_dict[newname].push(date_and_time);
                } else {
                    tutor_dict[newname] = [date_and_time];
                }
            }
            console.log(tutor_dict);
            
            for (var key in tutor_dict) {
                $("#results").append("<a href='http://facebook.com/" +key+ "'><img class='fbsmall' src='http://graph.facebook.com/" +key+"/picture'></img></a>" + " can help you at: ");
                for (var i=0; i<tutor_dict[key].length; i++) {
                    $("#results").append(tutor_dict[key][i] + "<br>");
                }
                $("#results").append("<br>");
            }
        }
    })
}



// ================================


// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
	console.log('statusChangeCallback');
	console.log(response);
	// The response object is returned with a status field that lets the
	// app know the current login status of the person.
	// Full docs on the response object can be found in the documentation
	// for FB.getLoginStatus().
	if (response.status === 'connected') {
		// Logged into your app and Facebook.
		welcome();
	} else if (response.status === 'not_authorized') {
		// The person is logged into Facebook, but not your app.
		document.getElementById('status').innerHTML = 'Please log ' +
			'into this app.';
	} else {
		// The person is not logged into Facebook, so we're not sure if
		// they are logged into this app or not.
		// document.getElementById('status').innerHTML = 'Please log ' +
			// 'into Facebook.';
	}
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
}

window.fbAsyncInit = function() {};
    
function init_fb() {
	FB.init({
		appId: '1091573117549208',
		cookie: true, // enable cookies to allow the server to access 
		// the session
		xfbml: true, // parse social plugins on this page
		version: 'v2.2' // use version 2.2
	});

	// Now that we've initialized the JavaScript SDK, we call 
	// FB.getLoginStatus().  This function gets the state of the
	// person visiting this page and can return one of three states to
	// the callback you provide.  They can be:
	//
	// 1. Logged into your app ('connected')
	// 2. Logged into Facebook, but not your app ('not_authorized')
	// 3. Not logged into Facebook and can't tell if they are logged into
	//    your app or not.
	//
	// These three cases are handled in the callback function.

	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});

};

// Load the SDK asynchronously
(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s);
	js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.


function welcome() {
	console.log('Welcome!  Fetching your information.... ');
    
    
	FB.api('/me', function(response) {
        document.getElementById("login_button").innerHTML = "";
        $("#login_button").append("<img id='fbprof' src='http://graph.facebook.com/" +response.id+ "/picture?type=large'></img><br>"+"Continue as " + response.name + "? ");
        $("#login_button").append("<button onclick='init_choose_class(" +response.id+ ")'>Continue</button>");
        
		console.log('Successful login for: ' + response.name);
        // init_choose_class(response.id);
		/* document.getElementById('status').innerHTML =
			'Welcome, ' + response.name + '! ' + response.id; */
        
        // check_user_in_database(response.id);
	});    
}





function check_user_in_database(id) {
    $.ajax({
        url: "php/is-unique-user.php?user_id=" + id,
        success: function (data) {
            if (data == "True") {
                create_new_user(id);
            }
            else {
                // handle a returning user
            }
        }
    });
}

function create_new_user(id) {
    $.ajax({
        url: "php/create-new-user.php?user_id=" + id,
        success: function (data) {
            console.log(data);
        }
    });
}



function askForLogin() {
    document.getElementById('mainarea').innerHTML = '<fb:login-button data-size="xlarge" scope="public_profile,email" onlogin="checkLoginState();" id="login_button"></fb:login-button><div id="status"></div>';
    
    init_fb();
}