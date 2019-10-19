//Get JSON list of hotels
var requestHotelList = new XMLHttpRequest()

requestHotelList.open('GET', '../api/hotels/', true)
requestHotelList.onload = function () {
	if (requestHotelList.status >= 200 && requestHotelList.status < 400) {
		var jsonData = JSON.parse(this.response);

		// Alphabetize list of hotels
		var hotels = jsonData.list;

		hotels.sort(function (a, b) {
			a = a.name.toLowerCase();
			b = b.name.toLowerCase();

			return a < b ? -1 : a > b ? 1 : 0;
		});


		//Remove duplicates.  Loop through and if current name = previous name, remove.
		var prevHotelName = "";
		for (i in hotels) {
			var currentHotelName = jsonData.list[i].name;

			if (currentHotelName == prevHotelName) {
				delete hotels[i];
			} else {
				//Set global var to current name
				prevHotelName = currentHotelName;
			}
		}

		for (x in hotels) {
			// alert('one');
			var listHTML = "<div class='sidebar-item'><div class='sidebar-item_title'>";
			listHTML += hotels[x].name;
			listHTML += "</div><div class='sidebar-item_price'>$";
			listHTML += hotels[x].price.toFixed(2);
			listHTML += "</div></div>";
			document.getElementById("sidebarList").innerHTML += listHTML;
		}
	} else {
		console.log('error.  status is:  '+requestHotelList.status)
	}
}

requestHotelList.send()

// Get Hotel description json
var requestHotelDetails = new XMLHttpRequest()
requestHotelDetails.open('GET', '../api/hotels/venetian', true)
requestHotelDetails.onload = function () {
	if (requestHotelDetails.status >= 200 && requestHotelDetails.status < 400) {
		var jsonData = JSON.parse(this.response);
		var name = jsonData.name;
		var price = jsonData.price;
		var address = jsonData.location.address;
		address += ", " + jsonData.location.city;
		address += ", " + jsonData.location.state;
		address += " " + jsonData.location.postalCode;
		var description = jsonData.description;
		var locationArea = jsonData.location.areaName;
		var medias = jsonData.media;
		var hotelThumbnailUrl = medias[0].href;
		var hotelMapUrl = medias[1].href;
	console.log(description);
		description = description.replace(/\r\n\r\n/g, "</p><p>");
			//get phone number and put into page and <a tel: attribute
		var phoneNum = jsonData.phoneNumber;
		var phoneNumNoHyphens = phoneNum.replace(/-/g, "");
		
		var starRating = jsonData.starRating;
			//round to next 1/4 star because smaller partial stars look bad or broken.
		var howManyFullStars = Math.floor(starRating);
			//get remaining decimal value  
		var decimalRemainder = (starRating - Math.floor(starRating)).toFixed(2);
			//round decimal  to nearest 1/4 star
		var closestQuarter = Math.round(decimalRemainder * 4) / 4;
		var finalStarNum = howManyFullStars + closestQuarter;
			//convert finalStarNum into % of div to block
		var roundedStarPercent = finalStarNum * 20;


		// Data into page
		document.getElementById('phoneNumber').setAttribute('href', "tel:+" + phoneNumNoHyphens);
		document.getElementById("phoneNumberSpan").innerHTML = phoneNum;
		document.getElementById("starBlocker").setAttribute('style', "left:" + roundedStarPercent + "%;");

		document.getElementById("headerTitle").innerHTML = name;
		document.getElementById("contentPriceNumber").innerHTML = "$" + price;
		document.getElementById("descriptionText-p").innerHTML = description;
		document.getElementById("hotelAddress").innerHTML = address;
		document.getElementById("locationArea").innerHTML = locationArea;
		document.getElementById("hotelThumbnailUrl").setAttribute('src', hotelThumbnailUrl);
		document.getElementById("hotelMapUrl").setAttribute('src', hotelMapUrl);


		// alert();
		var x = "";
		for (i in jsonData.details) {
			x += "<h2>" + jsonData.details[i].label + "</h2>";
			x += "<p>" + jsonData.details[i].value + "</p>";
		}

		document.getElementById("detailsText").innerHTML = x;

	} else {
		console.log('error. Status is: '+requestHotelDetails.status)
	}
}
requestHotelDetails.send()


//If a tab is clicked, change it's state and show it's related content:
var currentTab = "";

function myFunction(clickEvent) {
	var clickedId = clickEvent.target.id;
	var clickedIdPrefix = clickedId.substring(0, 3);

	// If it was a .tab that was clicked:
	if (clickedIdPrefix == 'tab') {
		var idNum = clickedId.split('-')[1];
		if (idNum != currentTab) {

			//Remove 'selected' from all tabs
			document.querySelectorAll(".tab").forEach(function (element) {
				element.classList.remove("tab--selected");
			});
			//add 'selected' state to current tab		
			var el = document.getElementById(clickedId);
			el.classList.add('tab--selected');

			// Get the tab number and hide all the other content divs IF
			var divToShow = "contentContainer-" + (idNum);
			var containerList = document.getElementsByClassName("content-container");
			var length = containerList !== null ? containerList.length : 0,

				i = 0;
			for (i; i < length; i++) {
				//remove hidden and then add it so there's never an extra one.
				containerList[i].classList.remove("hidden");
				containerList[i].className += " hidden";
			}

			//show the related content div
			var element = document.getElementById(divToShow);

			element.classList.remove("hidden");
		}
		currentTab = idNum;

	};

	var showDescriptionDiv = document.getElementById("showDescription");
	var hideDescriptionDiv = document.getElementById("hideDescription");
	var descriptionText = document.getElementById("descriptionText");
	var showDetailsDiv = document.getElementById("showDetails");
	var hideDetailsDiv = document.getElementById("hideDetails");
	var detailsText = document.getElementById("detailsText");

	switch (clickedId) {
		case "showDescription":
			showDescriptionDiv.classList.add("hidden");
			hideDescriptionDiv.classList.remove("hidden");
			descriptionText.style.height = "auto";
			break;
		case "hideDescription":
			hideDescriptionDiv.classList.add("hidden");
			showDescriptionDiv.classList.remove("hidden");
			descriptionText.style.height = "200px";
			break;
		case "showDetails":
			showDetailsDiv.classList.add("hidden");
			hideDetailsDiv.classList.remove("hidden");
			detailsText.style.height = "auto";
			break;
		case "hideDetails":
			hideDetailsDiv.classList.add("hidden");
			showDetailsDiv.classList.remove("hidden");
			detailsText.style.height = "200px";
			break;
		case "contentMetricsLocation":
			// Send them to the Map tab
			// Remove 'selected' from all tabs
			document.querySelectorAll(".tab").forEach(function (element) {
				element.classList.remove("tab--selected");
			});
			//add 'selected' state to Map tab		
			var el = document.getElementById("tab-3");
			el.classList.add('tab--selected');

			// show container & hide all the other content div
			var divToShow = "hotel-details";
			var containerList = document.getElementsByClassName("content-container");
			var length = containerList !== null ? containerList.length : 0,

				i = 0;
			for (i; i < length; i++) {
				//remove hidden and then add it so there's never an extra one.
				containerList[i].classList.remove("hidden");
				containerList[i].className += " hidden";
			}
			// Show map div
			var mapDiv = document.getElementById("contentContainer-3");
			mapDiv.classList.remove("hidden");

			//show map div
			// show spacer before scrolling into view ?  
			// Video shows no scrolling but instruction say to croll into view

			currentTab = idNum;
			break;
	}


}