import ApiCalls from "./apiCalls.js";
const api = new ApiCalls();
const bcrypt = dcodeIO.bcrypt;
var role = '0';

const switchInput = document.getElementById("flexSwitchCheckDefault");
switchInput.addEventListener("change", function () {
  if (this.checked) {
    role = '1'
    console.log("Le switch est activé");
  } else {
    role='0'
    console.log("Le switch est désactivé");
  }
  console.log(role)
});

document.addEventListener("DOMContentLoaded", function () {
  const addClubForm = document.getElementById("addClubForm");

  addClubForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Collect form data
    const club_name = document.getElementById("clubName").value;
    const club_adress = document.getElementById("clubAddress").value;
    const club_town = document.getElementById("clubTown").value;
    const sport_type = document.getElementById("clubSport").value;
    const Mail = document.getElementById("clubEmail").value;
    const password = document.getElementById("clubPassword").value;

    // Check if any field is empty
    if (club_name === "") {
      alert('Veuillez remplir le champ "Nom du club"');
      return;
    }
    if (club_adress === "") {
      alert('Veuillez remplir le champ "Adresse"');
      return;
    }
    if (club_town === "") {
      alert('Veuillez remplir le champ "Ville"');
      return;
    }
    if (sport_type === "11") {
      alert("Veuillez choisir un sport");
      return;
    }
    if (Mail === "") {
      alert('Veuillez remplir le champ "Email"');
      return;
    }
    if (password === "") {
      alert('Veuillez remplir le champ "Mot de passe"');
      return;
    }

    // Check if password is strong enough
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[^\da-zA-Z]).{12,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        "Le mot de passe doit contenir au moins 12 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial."
      );
      return;
    }

    // Sanitize input to prevent XSS attacks
    const sanitizeHtml = (string) => {
      const temp = document.createElement("div");
      temp.textContent = string;
      return temp.innerHTML;
    };
    const formData = {
      club_name: sanitizeHtml(club_name),
      club_adress: sanitizeHtml(club_adress),
      club_town: sanitizeHtml(club_town),
      sport_type: sanitizeHtml(sport_type),
      Mail: sanitizeHtml(Mail),
      password_hash: sanitizeHtml(bcrypt.hashSync(password, 10)),
      role: sanitizeHtml(role),
    };
    console.log(formData);

    // Convert data to JSON
    const jsonData = JSON.stringify(formData);
    console.log(jsonData);

    // Make a POST request using Axios
    api.addClub(jsonData);
    alert("Club ajouté avec succès");
    window.location.href = "./clubs.html";
  });
  console.log("JavaScript code loaded successfully!");
});

function updateTownList() {
  api
    .fetchTown()
    .then((towns) => {
      const clubTown = document.getElementById("clubTown");
      // Ajouter une option par défaut
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.text = "Choisir la ville";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      clubTown.appendChild(defaultOption);
      // Ajouter les villes
      towns[0].forEach((town) => {
        const option = document.createElement("option");
        option.value = town.town_name;
        option.text = town.town_name;
        clubTown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de la récupération des données de l'API : ",
        error
      );
    });
}

api.checkAdmin();
updateTownList();
