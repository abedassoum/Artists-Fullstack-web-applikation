import {
  getArtists,
  createArtist,
  updateArtist,
  deleteArtist,
  markFavourite,
} from "./rest-service.js";
import { searchByName } from "./helpers.js";
const endpoint = "http://localhost:3000";

window.addEventListener("load", initApp);

let artists;

async function initApp() {
  artists = await getArtists();
  updateArtistsGrid();
  document
    .querySelector("#btn-create-artist")
    .addEventListener("click", (event) => showCreateArtistDialog(event));
  document
    .querySelector("#form-create-artist")
    .addEventListener("submit", (event) => createArtistClicked(event));

  document
    .querySelector("#form-update-artist .btn-cancel")
    .addEventListener("click", (event) => cancelUpdate(event));

  document
    .querySelector("#form-create-artist .btn-cancel")
    .addEventListener("click", (event) => cancelCreate(event));

  document
    .querySelector("#form-update-artist")
    .addEventListener("submit", (event) => updateArtistClicked(event));

  document
    .querySelector("#form-update-artist")
    .addEventListener("click", (event) => markFavouriteClicked(event));

  document
    .querySelector("#sortbyselect")
    .addEventListener("change", (event) => searchByName(event));
  document
    .querySelector("#input-search")
    .addEventListener("input", (event) => searchByName(event));
  document
    .querySelector("#filter-bar")
    .addEventListener("change", (event) => searchByName(event));
}

function cancelCreate(event) {
  event.preventDefault();
  document.querySelector("#dialog-create-artist").close();
}

function cancelUpdate(event) {
  event.preventDefault();
  console.log("Cancel update button clicked!");
  document.querySelector("#dialog-update-artist").close();
}

function updateClicked(artistObject) {
  const updateForm = document.querySelector("#form-update-artist");

  updateForm.name.value = artistObject.name;
  updateForm.image.value = artistObject.image;
  updateForm.birth.value = artistObject.birth;
   updateForm.activeSince.value = artistObject.activeSince;
  updateForm.genres.value = artistObject.genres;
  updateForm.labels.value = artistObject.labels;
  updateForm.website.value = artistObject.website;
  updateForm.shortDescription.value = artistObject.shortDescription;

  updateForm.setAttribute("data-id", artistObject.id);

  document.querySelector("#dialog-update-artist").showModal();

  console.log("Update button clicked!");
}

async function createArtistClicked(event) {
  console.log("createArtistClicked");
  event.preventDefault();
  const form = document.querySelector("#form-create-artist");
  const name = form.artistName.value;
  const image = form.artistImage.value;
  const birth = form.artistBirth.value;
  const activeSince = form.activeSince.value;
  const genres = form.genres.value;
  const labels = form.labels.value;
  const website = form.website.value;
  const shortDescription = form.shortDescription.value;
  console.log("name" + name);
  console.log(image, birth, genres, labels, website, shortDescription);

  const response = await createArtist(
    name,
    image,
    birth,
    activeSince,
    genres,
    labels,
    website,
    shortDescription
  );
  console.log("response" + response);
  if (response == 200) {
    document.querySelector("#dialog-create-artist").close();
    updateArtistsGrid();
    form.reset();
    await getArtists();
  } else {
    console.log(response.status, response.statusText);
    showErrorMessage("Something went wrong. Please try again");
  }
}

async function updateArtistClicked(event) {
  event.preventDefault();
  const form = document.querySelector("#form-update-artist");
  const name = form.name.value;
  const image = form.image.value;
  const birth = form.birth.value;
  const activeSince = form.activeSince.value;
  const genres = form.genres.value;
  const labels = form.labels.value;
  const website = form.website.value;
  const shortDescription = form.shortDescription.value;

  const id = form.getAttribute("data-id");

  const response = await updateArtist(
    id,
    name,
    image,
    birth,
    activeSince,
    genres,
    labels,
    website,
    shortDescription
  );

  if (response == 200) {
    document.querySelector("#dialog-update-artist").close();
    updateArtistsGrid();
    // alert("ARTIST UPDATED!");
    await getArtists();
    console.log("Update Artist button clicked!");
  } else {
    console.log(response.status, response.statusText);
    showErrorMessage("Something went wrong. Please try again");
    event.target.parentNode.close();
  }
}

function deleteArtistClicked(artistObject) {
  console.log(artistObject);
  document.querySelector("#dialog-delete-artist-title").textContent =
    artistObject.name;
  document.querySelector("#dialog-delete-artist").showModal();
  document
    .querySelector("#form-delete-artist")
    .addEventListener("submit", () => deleteArtistConfirm(artistObject.id));
  document
    .querySelector("#cancelDelete")
    .addEventListener("click", (event) => cancelDeleteArtist(event));
}

function cancelDeleteArtist(event) {
  event.preventDefault();
  document.querySelector("#dialog-delete-artist").close();
}

async function deleteArtistConfirm(artistObject) {
  const response = await deleteArtist(artistObject);

  if (response == 200) {
    updateArtistsGrid();
  } else {
    document.querySelector("#dialog-failed-to-update").showModal();
  }
}



function showCreateArtistDialog() {
  document.querySelector("#dialog-create-artist").showModal();
  console.log("Create New Artist button clicked!");
}

async function updateArtistsGrid() {
  artists = await getArtists();
  searchByName(artists);
}

async function markFavouriteClicked(artistObject, Event) {
  Event.preventDefault;
  const form = document.querySelector("#form-update-artist");
  const id = form.getAttribute("data-id");

  console.log("artistObject" + artistObject.id);
  const response = await markFavourite(artistObject.id);
  if (response == 200) {
    alert("ARTIST MARKED AS FAVOURITE!");
    await getArtists();
  } else {
    alert("Failed to mark the Artist as Favourite");
  }
}

function showArtists(artistList) {
  document.querySelector("#artists").innerHTML = "";
  if (artistList.length !== 0) {
    for (const artist of artistList) {
      showArtist(artist);
    }
  } else {
    document.querySelector("#artists").insertAdjacentHTML(
      "beforeend",
      /*html*/ `
    <h2 id="search-error-msg"> No Artists were found. Please try again.</h2>
    `
    );
  }
}

function createStarSVG() {
  return /*html*/ `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  `;
}

function showArtist(artistObject) {
  const html = /*html*/ `
        <article class="grid-item">
        <div class="clickable">
        <div class="image-container">    
            <img src="${artistObject.image}" />
            
            ${artistObject.isFavorite ? createStarSVG() : ""}
  </div>
            <h3></h3><b>${artistObject.name}</b></h3>
            <p>Birth: ${artistObject.birth}</p>
            <p>Genres: ${artistObject.genres}</p>
           </div>
        
            <div class="btns">
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>
                <button class="btn-favourite">Mark as Favourite</button>
            </div>
        </article>
    `;
  document.querySelector("#artists").insertAdjacentHTML("beforeend", html);

  const gridItem = document.querySelector(
    "#artists article:last-child .clickable"
  );

  gridItem.addEventListener("click", () => {
    showArtistModal(artistObject);
  });

  document
    .querySelector("#artists article:last-child .btn-delete")
    .addEventListener("click", () => deleteArtistClicked(artistObject));
  document
    .querySelector("#artists article:last-child .btn-update")
    .addEventListener("click", () => updateClicked(artistObject));
  document
    .querySelector("#artists article:last-child .btn-favourite")
    .addEventListener("click", () => markFavouriteClicked(artistObject, Event));
}

function showArtistModal(artistObject) {
  const modal = document.querySelector("#artist-modal");
  modal.querySelector("#artist-image").src = artistObject.image;
  modal.querySelector("#artist-name").textContent = artistObject.name;
  modal.querySelector("#artist-birth").textContent = artistObject.birth;
  modal.querySelector("#artist-active-since").textContent = artistObject.activeSince;
  modal.querySelector("#artist-genres").textContent = artistObject.genres;
  modal.querySelector("#artist-labels").textContent = artistObject.labels;
  modal.querySelector("#artist-website").textContent = artistObject.website;
  modal.querySelector("#artist-shortDescription").textContent =
    artistObject.shortDescription;

  modal.showModal();
  modal.querySelector("button").addEventListener("click", () => {
    modal.close();
  });
}

export { showArtists, artists };
