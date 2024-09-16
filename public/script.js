// Gestion du téléchargement du fichier
document.getElementById('downloadButton').addEventListener('click', function() {
  // Rediriger vers la route de téléchargement
  window.location.href = '/telecharger-le-fichier';
});



// Gestion de la disponibilité du bouton
document.addEventListener("DOMContentLoaded", function () {
  const dispoButton = document.getElementById("dispo-button");

  // Par défaut, le bouton est disponible
  let isAvailable = true;

  dispoButton.addEventListener("click", function () {
    if (isAvailable) {
      dispoButton.textContent = "Indisponible";
      dispoButton.classList.remove("btn-disponible");
      dispoButton.classList.add("btn-indisponible");
    } else {
      dispoButton.textContent = "Disponible";
      dispoButton.classList.remove("btn-indisponible");
      dispoButton.classList.add("btn-disponible");
    }
    isAvailable = !isAvailable; // Inverser l'état
  });
});
