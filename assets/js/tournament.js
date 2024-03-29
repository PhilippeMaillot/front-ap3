import ApiCalls from "./apiCalls.js";

const api = new ApiCalls();
var selectedSport;
var selectedTown;

function updateTownList() {
  api.fetchTown()
    .then((towns) => {
      const townSelect = document.getElementById("villeSelect");
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.text = "Choisir la ville";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      townSelect.appendChild(defaultOption);

      towns[0].forEach((town) => {
        const option = document.createElement("option");
        option.value = town.town_name;
        option.text = town.town_name;
        townSelect.appendChild(option);
      });
      $("#villeSelect").on("select2:select", function (e) {
        selectedTown = e.params.data.id;
        console.log("Ville choisie : " + selectedTown);
        updateFieldList();
      });
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de la récupération des données de l'API : ",
        error
      );
    });
}

const sportSelect = document.querySelector(".form-select");

// Utiliser Select2 pour gérer les événements de sélection
$("#sportSelect").on("select2:select", function (e) {
  selectedSport = e.params.data.id; // ou e.params.data.text selon ce que vous voulez
  console.log("Sport choisi : " + selectedSport);
  updateFieldList();
});

sportSelect.addEventListener("change", function () {
  selectedSport = this.value;
  console.log("Sport choisi : " + selectedSport);
  updateFieldList();
});

const townSelect = document.querySelector("#villeSelect");
townSelect.addEventListener("change", function () {
  selectedTown = this.value;
  console.log("Ville choisie : " + selectedTown);
  updateFieldList();
});

const fieldSelect = document.querySelector("#fieldSelect");

function updateFieldList() {
  if (selectedSport && selectedTown) {
    api.fetchField()
      .then((fields) => {
        while (fieldSelect.firstChild) {
          fieldSelect.removeChild(fieldSelect.firstChild);
        }

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.text = "Choisir un terrain";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        fieldSelect.appendChild(defaultOption);

        fields[0].forEach((field) => {
          if (
            field.field_town === selectedTown &&
            field.sport_type === selectedSport
          ) {
            const option = document.createElement("option");
            option.value = field.id_field;
            option.text = field.field_adress;
            fieldSelect.appendChild(option);
          }
        });
        $("#fieldSelect").on("select2:select", function (e) {
          selectedField = e.params.data.id;
          console.log("Terrain choisi : " + selectedField);
          updateFieldList();
        });
      })
      .catch((error) => {
        console.error(
          "Une erreur s'est produite lors de la récupération des données de l'API : ",
          error
        );
      });
  }
}

updateTownList();
villeSelect.addEventListener("change", updateFieldList);
sportSelect.addEventListener("change", updateFieldList);

document.addEventListener("DOMContentLoaded", function () {
  const addTournamentForm = document.getElementById("addTournamentForm");

  addTournamentForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Collect form data
    const tournament_name = document.getElementById("tournament_name").value;
    const tournament_date = document.getElementById("tournament_date").value;
    const tournament_field = document.getElementById("fieldSelect").value;

    // Check if any field is empty
    if (tournament_name === "") {
      var message = "Veuillez remplir le champ 'Nom du tournoi'.";
      afficherPopup(message);
      return;
    }
    if (tournament_date === "") {
      var message = "Veuillez remplir le champ 'Date du tournoi'.";
      afficherPopup(message);
      return;
    }
    console.log(selectedSport);
    if (selectedSport === "" || selectedSport === "Choix du sport") {
      var message = "Veuillez choisir un sport.";
      afficherPopup(message);
      return;
    }

    if (tournament_field === "" || tournament_field === "Choisir un terrain") {
      var message = "Veuillez choisir un terrain.";
      afficherPopup(message);
      return;
    }

    // Sanitize input to prevent XSS attacks
    const sanitizeHtml = (string) => {
      const temp = document.createElement("div");
      temp.textContent = string;
      return temp.innerHTML;
    };
    const formData = {
      tournament_name: sanitizeHtml(tournament_name),
      tournament_date: sanitizeHtml(tournament_date),
      id_field: sanitizeHtml(tournament_field),
    };

    console.log("Form data:", formData);

    // Convert data to JSON
    const jsonData = JSON.stringify(formData);
    console.log("JSON data:", jsonData);

    // Make a POST request using Axios
    if (api.isAdmin()) {
    api.addTournament(jsonData)
    alert("Tournoi ajouté avec succès");
    window.location.href = "calendar.html";
    } else {
      alert("Vous n'avez pas les droits pour ajouter un tournoi");
      window.location.href = "login.html";
    }
  });

  console.log("JavaScript code loaded successfully!");
});

// Fonction pour afficher le popup avec un message spécifique
function afficherPopup(message) {
  var popup = document.getElementById("popup");
  var popupMessage = document.getElementById("popup-message");
  popupMessage.innerHTML = message;
  popup.style.display = "block"; // Afficher le popup
  setTimeout(fermerPopup, 2000);
}

// Fonction pour fermer le popup
function fermerPopup() {
  var popup = document.getElementById("popup");
  popup.style.display = "none"; // Cacher le popup
}

api.checkAdmin();
