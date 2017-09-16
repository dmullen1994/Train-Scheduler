$(document).ready(function() {
	var config = {
	    apiKey: "AIzaSyBD55E4aWS_5gzNgU2lR_GWQ-lyJ__pHi0",
	    authDomain: "first-project-79413.firebaseapp.com",
	    databaseURL: "https://first-project-79413.firebaseio.com",
	    projectId: "first-project-79413",
	    storageBucket: "first-project-79413.appspot.com",
	    messagingSenderId: "380889283140"
 	};
  
  	firebase.initializeApp(config);

  	var database = firebase.database();

  	database.ref().on("value",function(snapshot) {

  	});

  	//add new train to firebase when submit button is clicked
	$(document).on("click","#submitButton",function(event){
		event.preventDefault();
		var myTrain = $("#trainNameInput").val().trim();
		var myDestination = $("#destinationInput").val().trim();
		var myTime = moment($("#trainTimeInput").val().trim(),"HH:mm").format("X");
		var myFrequency = $("#frequencyInput").val().trim();

		//make sure they filled out all the fields
		if (myTrain!="" && myDestination!="" && myTime!="" && myFrequency!="") {
			database.ref().child("myTrains").push({
				trainName: myTrain,
				trainDestination: myDestination,
				trainTime: myTime,
				trainFrequency: myFrequency,
			})
		}

		// $(".table").append("<tr><td>" + myTrain + "</td><td>" + myDestination + "</td><td>" + myTime + "</td><td>" + myFrequency + "</td></tr")
	});

	//call firebase to update schedule when a new train gets added or upon page loading
	database.ref().child("myTrains").on("value", function(snapshot) {
		$("#scheduleHolder").empty();

		var arrivalTime;
		var timeToArrival;

		snapshot.forEach(function(currentTrain) {
			var thisTrain = currentTrain.val();
			var unixArrivalTime = moment.unix(thisTrain.trainTime);
			var timeDifference = moment().diff(unixArrivalTime,"minutes");

			if(timeDifference <= 0) {
				arrivalTime = unixArrivalTime.format("hh:mm A");
				timeToArrival = Math.abs(timeDifference) + 1;
			}

			else {
				timeToArrival = thisTrain.trainFrequency - (timeDifference % thisTrain.trainFrequency);
				arrivalTime = moment().add(timeToArrival,"minutes").format("hh:mm A");
				console.log("first time " + moment.unix(thisTrain.trainTime).format("h:mm a") + " difference " + timeDifference + " timeToArrival " + timeToArrival);
			}

			$("#scheduleHolder").append("<tr><td>" + thisTrain.trainName + "</td><td>" + thisTrain.trainDestination + "</td><td>" + thisTrain.trainFrequency + "</td><td>" + arrivalTime + "</td><td>" + timeToArrival + "</td></tr>");

		})

	})

	setInterval(function() {
		$("#currentTime").text(moment().format("h:mm A"))
	},1000);
})