import ApiCalls from "./apiCalls.js";
const api = new ApiCalls();

api.fetchClub().then(clubsArray => {
    if (Array.isArray(clubsArray) && clubsArray.length > 0) {
        const clubs = clubsArray[0];
        const numberOfClubs = clubs.length;
        document.querySelector('.card-title-users').textContent = numberOfClubs;
    } else {
        console.error('La réponse de l\'API n\'est pas conforme:', clubsArray);
    }
}).catch(error => {
    console.error('Une erreur s\'est produite lors de la récupération des clubs:', error);
});

api.fetchTournament().then(tournamentsArray => {
    if (Array.isArray(tournamentsArray) && tournamentsArray.length > 0) {
        const tournaments = tournamentsArray[0];
        const numberOfTournament = tournaments.length;
        document.querySelector('.card-title-tournament').textContent = numberOfTournament;
    } else {
        console.error('La réponse de l\'API n\'est pas conforme:', tournamentsArray);
    }
}).catch(error => {
    console.error('Une erreur s\'est produite lors de la récupération des tournois:', error);
});

