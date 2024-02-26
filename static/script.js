let infoData; 
let score = 0;
let total = 0;

function fetchData() {
    if (!infoData) {
        // Fetch the data only if it hasn't been fetched yet
        infoData = fetch('/info')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // console.log('Received data:', data); // Log received data to console
                return data; // Return the fetched data for further processing if needed
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                throw error; // Re-throw the error to propagate it to the caller
            });
    }
    return infoData; // Return the promise for fetched data
}


function initMap() {
    fetchData()
    .then(data => {
        coords = data.coords
        var lat = coords.lat;
        var lng = coords.lng;

        // Create a LatLng object
        var latLng = {
            lat: lat,
            lng: lng
        };

        // Initialize StreetViewService
        var streetViewService = new google.maps.StreetViewService();

        // Search for the nearest panorama from the random coordinates
        streetViewService.getPanorama({
            location: latLng,
            radius: 50 // Search radius in meters
        }, function(data, status) {
            if (status === "OK") {
                // Display the panorama if found
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById("map"), {
                        position: data.location.latLng,
                        pov: {
                            heading: 0,
                            pitch: 0
                        },
                        disableDefaultUI: true,
                        showRoadLabels: false,
                        visible: true
                    }
                );
                map.setStreetView(panorama);
            } else {
                // Display a message if no panorama found
                console.error("No panorama found at this location ("+lat+", "+lng+")");
                infoData = null;
                initMap();
            }
        });
        })
    .catch(error => console.error('Error fetching random coordinates:', error));
}


function getPartyName(button) {
    var partyName = button.innerText;

    const buttons = document.querySelectorAll('.rounded-button');
    
    // Disable all buttons
    buttons.forEach(btn => {
        btn.disabled = true;
    });

    // Now you can use partyName as needed, for example, log it to the console
    fetchData()
    .then(data => {
        var correctParty = data.winner
        var constName = data.const_name

        total = total + 1

        // Compare the selected party with the correct party
        if (partyName === correctParty) {
            score = score + 1
            // Party guess is correct
            if (correctParty === "Liberal Democrats" | correctParty === "SNP" | correctParty === "DUP" | correctParty === "SDLP"){
                displayMessage("Correct! This streetview is from "+constName+" which was won by the " + correctParty+". Your total score is now "+score+"/"+total+".");
            } else if (correctParty === "Labour" | correctParty === "Sinn Fein" | "Plaid Cymru" | correctParty === "Alliance") {
                displayMessage("Correct! This streetview is from "+constName+" which was won by " + correctParty+". Your total score is now "+score+"/"+total+".");
            } else if (correctParty === "Conservative" | correctParty == "Green"){
                displayMessage("Correct! This streetview is from "+constName+" which was won by the " + correctParty+"s. Your total score is now "+score+"/"+total+".");   
            } else if (correctParty === "Other") {
                displayMessage("Correct This streetview is from "+constName+" which was won by Lindsay Hoyle (Speaker). Your total score is now "+score+"/"+total+".")
            }
            
        } else {
            // Party guess is incorrect
            if (correctParty === "Liberal Democrats" | correctParty === "SNP" | correctParty === "DUP" | correctParty === "SDLP"){
                displayMessage("Sorry that's not right. This streetview is from "+constName+" which was won by the " + correctParty+". Your total score is now "+score+"/"+total+".");
            } else if (correctParty === "Labour" | correctParty === "Sinn Fein" | "Plaid Cymru" | correctParty === "Alliance") {
                displayMessage("Sorry that's not right. This streetview is from "+constName+" which was won by " + correctParty+". Your total score is now "+score+"/"+total+".");
            } else if (correctParty === "Conservative" | correctParty == "Green"){
                displayMessage("Sorry that's not right. This streetview is from "+constName+" which was won by the " + correctParty+"s. Your total score is now "+score+"/"+total+".");   
            } else if (correctParty === "Other") {
                displayMessage("Sorry that's not right. This streetview is from "+constName+" which was won by Lindsay Hoyle (Speaker). Your total score is now "+score+"/"+total+".")
            }
        }
        displayTryAnotherButton();
    })
    .catch(error => {
        console.error('Error fetching correct party:', error);
    });

}

function displayMessage(message) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = message;
}

function displayTryAnotherButton() {
    const buttonContainer = document.getElementById("try-again-button-container");
    buttonContainer.style.paddingTop = "10px";

    const tryAnotherButton = document.createElement("button");
    tryAnotherButton.id = "try-another-button";
    tryAnotherButton.textContent = "Try another constituency";
    tryAnotherButton.classList.add("btn", "btn-primary");
    tryAnotherButton.style.backgroundColor = "#000000";
    tryAnotherButton.style.padding = "15px 30px"; // Increase padding to make the button bigger
    tryAnotherButton.style.fontSize = "16px"; // Increase font size
    tryAnotherButton.style.width = "250px"; 
    tryAnotherButton.style.borderRadius = "20px";
    tryAnotherButton.style.border = "none";
    tryAnotherButton.onclick = resetGame; // Attach click event handler

    const finishGameButton = document.createElement("button");
    finishGameButton.id = "finish-game-button";
    finishGameButton.textContent = "Finish game";
    finishGameButton.classList.add("btn", "btn-primary");
    finishGameButton.style.backgroundColor = "#000000";
    finishGameButton.style.padding = "15px 30px"; // Increase padding to make the button bigger
    finishGameButton.style.fontSize = "16px"; // Increase font size
    finishGameButton.style.width = "250px"; 
    finishGameButton.style.borderRadius = "20px";
    finishGameButton.style.border = "none";
    finishGameButton.onclick = finishGame; // Attach click event handler


    buttonContainer.appendChild(tryAnotherButton);
    buttonContainer.appendChild(finishGameButton);
}


function resetGame() {
    // Reload the page or reset the game state as needed
    const buttons = document.querySelectorAll('.rounded-button');
    buttons.forEach(btn => {
        btn.disabled = false; // Re-enable all buttons
    });

    const messageContainer = document.getElementById("message");
    messageContainer.textContent = ""; // Clear the message

    // Remove the "Try another constituency" button
    const tryAnotherButton = document.getElementById("try-another-button");
    tryAnotherButton.remove(); // Remove the button if it exists

    // Remove the "Try another constituency" button
    const finishGameButton = document.getElementById("finish-game-button");
    finishGameButton.remove(); // Remove the button if it exists


    infoData = null;

    initMap();
}

function finishGame(){
    document.body.innerHTML = '';

    const finishContainer = document.createElement('div');
    finishContainer.style.position = 'absolute';
    finishContainer.style.top = '50%';
    finishContainer.style.left = '50%';
    finishContainer.style.transform = 'translate(-50%, -50%)';


    // Create elements to display the total score
    const scoreContainer = document.createElement('div');
    scoreContainer.textContent = 'Total Score: ' + score + ' out of ' + total + "!";
    scoreContainer.style.fontSize = '72px';
    scoreContainer.style.textAlign = 'center';

    const shareContainer = document.createElement('div');
    const link = document.createElement('a');
    shareContainer.appendChild(link);
    let text = "I just scored " + score + " out of " + total + " playing electionGuessr! Try it yourself at ";
    let url = "google.com";
    link.textContent = "Share your score!"; 
    const twitterUrl = "https://twitter.com/intent/tweet/";
    const twitterQuery = `text=${text}&url=${url}`;
    link.href = `${twitterUrl}?${twitterQuery}&`;
    link.target = "_blank"; 
    shareContainer.style.textAlign = 'center';
    shareContainer.width = '100%';



    // Add the score container to the page
    finishContainer.appendChild(scoreContainer);
    finishContainer.appendChild(shareContainer);

    document.body.appendChild(finishContainer);


}