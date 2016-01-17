$(document).ready(function() {
    $("body").show("fade", 2000);
});

function init_tutor() {
    $("#maintext").html("");
    
    $("#maintext").append("<p>Login with Facebook please!</p><br>");
    $("#maintext").append('<fb:login-button data-size="xlarge" scope="public_profile,email" onlogin="checkLoginState();" id="login_button"></fb:login-button><div id="status"></div>');
    init_fb();
}

function init_choose_class(username) {
    $("#maintext").html("");
    
    $("#maintext").append("<p>What classes can you help with?</p><select id='helpselect'><option value='COMP140'>COMP 140</option><option value='ELEC220'>ELEC 220</option><option value='PHYS101'>PHYS 101</option><option value='MATH211'>MATH 211</option><option value='CHEM121'>CHEM 121</option></select> <br><br>");
    
    $("#maintext").append("<button class='button' onclick='init_choose_availability(" + username + ")'>Next</button>");
    
    $("#maintext").append("<br><br><p>Your previously indicated availability:</p>");
    $.ajax({
        url: "php/retrieve-data-given-user.php?user_id=" + username,
        success: function (data) {
            $("#maintext").append("<table id='availability-table'><tr><td>Course</td><td>Date</td><td>Time</td></tr></table>");
            
            var str_available = data;
            str_available = str_available.slice(0,-1);
            listing = str_available.split(";")
            for (var r = 0; r < listing.length; r++) {
                $("#availability-table").append("<tr id=" +r+ "></tr>")
                $("#" + r).append("<td>"+listing[r].split(",")[0]+"</td>" + "<td>"+listing[r].split(",")[1]+"</td>" + "<td>"+listing[r].split(",")[2]+"</td>" + "<td><a href='#' id=" +listing[r].split(",")[3]+ " class='remove-link' onclick='javascript:remove_availability(" +listing[r].split(",")[3]+ ",&#34;" +username+ "&#34;);'>Remove</a></td>");
            }
            
        }
    })   
}

function remove_availability(unique_id, username) {
    $.ajax({
        url: "php/remove-availability.php?unique_id=" + unique_id,
        success: function(data) {
            init_choose_class(username);
        }
    })
}

function init_choose_availability(username) {
    var indicated_class = $("#helpselect").val();
    
    $("#maintext").html("");
    $("#maintext").append("<p>When are you available?</p><br><br>")

    $("#maintext").append('I can help on <input type="text" id="datepicker" value="Click to pick a date"><br>I can help from <input type="text" id="timepicker1" placeholder="e.g. 3PM"> to <input type="text" id="timepicker2" placeholder="e.g. 5PM"><br><br><button class ="button" onclick="add_availability('+username+',&#39;' +indicated_class+ '&#39;);">Submit Availability</button>');
    
    
    $("#datepicker").datepicker();
}

function add_availability(username, indicated_class) {
    var date = $("#datepicker").val();
    var time1 = $("#timepicker1").val();
    var time2 = $("#timepicker2").val();
    
    $.ajax({
        url: "php/add-availability-data.php?user_id=" + username + "&" + "subject_code=" + indicated_class + "&date_available=" + date + "&timeslot_available=" + time1 + "-" + time2,
        success: function (data) {
            if (data = "success") {
                $("#status").css("display", "none");
                $("#status").html("<br>Added " + indicated_class + " on " + date + " from " + time1 + "-" + time2 + ". Submit another one!");
                $("#status").show("fade");
            }
        }
    });
}

// --------------------------------

function init_student() {
    $("#maintext").html("");
    
    $("#maintext").append("<p>What do you need help with?</p><select id='subject'><option value='COMP140'>COMP 140</option><option value='ELEC220'>ELEC 220</option><option value='PHYS101'>PHYS 101</option><option value='MATH211'>MATH 211</option><option value='CHEM121'>CHEM 121</option></select><br><br>");
    $("#maintext").append("<button class='button' onclick='show_results();'>Get Help!</button><div id='results'></div>");
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
            
            
            $("#results").html("");
            $("#results").append("<br><table id='resultstable'></table>")
            
            
            
            for (var key in tutor_dict) {
                $("#resultstable").append("<tr id='" +key+ "'></tr>");
                var largestr = "<td><a href='http://facebook.com/" +key+ "'><img class='fbsmall' src='http://graph.facebook.com/" +key+"/picture'></img></a></td><td id='user-" +key+ "'></td><td>";
                
                for (var i=0; i<tutor_dict[key].length; i++) {
                    largestr += tutor_dict[key][i] + "<br>";
                }
                
                largestr += "</td>";
                
                $("#" + key).append(largestr);
                populate_name(key);
            }
            
            if (data == "") {
                $("#results").html("<br>Sorry, no results found.");
            }
                
                
        }
    })
}

function populate_name(user) {
    $.ajax({
        url: "php/retrieve-name.php?user=" + user,
        success: function(data) {
            $("#user-"+user).html(data);
        }
    });
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
	FB.api('/me', function(response) {
        document.getElementById("login_button").innerHTML = "";
        $("#login_button").append("<img id='fbprof' src='http://graph.facebook.com/" +response.id+ "/picture?type=large'></img><br><br>"+"Continue as " + response.name + "? ");
        $("#login_button").append("<br><br><button class='button' onclick='init_choose_class(" +response.id+ ")'>Continue</button>");
        check_user_in_database(response.id, response.name);
        
        
	});    
}





function check_user_in_database(id, name) {
    $.ajax({
        url: "php/is-unique-user.php?user_id=" + id,
        success: function (data) {
            if (data == "True") {
                create_new_user(id, name);
            }
            else {
                // handle a returning user
            }
        }
    });
}

function create_new_user(id, name) {
    $.ajax({
        url: "php/create-new-user.php?user_id=" + id + "&name=" + name,
        success: function (data) {
            console.log("Created new user: " + data);
        }
    });
}



function askForLogin() {
    document.getElementById('mainarea').innerHTML = '<fb:login-button data-size="xlarge" scope="public_profile,email" onlogin="checkLoginState();" id="login_button"></fb:login-button><div id="status"></div>';
    
    init_fb();
}