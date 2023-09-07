import { artists } from "./script.js";
import { showArtists } from "./script.js";

function searchByName(event) {
  const searchValue = document.querySelector("#input-search").value;
  const searchedArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  const filterValue = document.querySelector("#filter-bar").value;

  if (filterValue !== "none") {
    console.log("FILTER");
    filterArtists(searchedArtists);
  } else {
    console.log("SORT");
    sortArtists(searchedArtists);
  }
}

function filterArtists(artistArr) {
  const filterValue = document.querySelector("#filter-bar").value;

  const filteredAndSearchedArtists = artistArr.filter(filter);

  console.log(filteredAndSearchedArtists);

  function filter(artist) {
    const artistGenre = artist.genres;
    for (const genre of artistGenre) {
      if (genre.toLowerCase() === filterValue.toLowerCase()) {
        return artist;
      }
    }
  }

  sortArtists(filteredAndSearchedArtists);
}

function sortArtists(artistsArr) {
  const sortValue = document.querySelector("#sortbyselect").value;
  let result = [];
  if (sortValue === "name") {
    result = artistsArr.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === "name-reverse") {
    result = artistsArr.sort((a, b) => b.name.localeCompare(a.name));
  }

  showArtists(result);
}

function sortByOption(sortValue) {
  if (sortValue === "name") {
    return artistList.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name);
      }
      // Handle the case where either a.name or b.name is undefined
      return 0; // You can return 0 or any other value based on your preference
    });
  } else if (sortValue === "knownSong") {
    return artistList.sort((a, b) => {
      if (a.knownSong && b.knownSong) {
        return a.knownSong.localeCompare(b.knownSong);
      }
      // Handle the case where either a.knownSong or b.knownSong is undefined
      return 0; // You can return 0 or any other value based on your preference
    });
  }
}

function filterByType(inputValue) {
  inputValue = inputValue.toLowerCase();
  if (inputValue !== "filterall") {
    let filteredList = artists.filter((artist) =>
      artist.genres.toLowerCase().includes(inputValue)
    );
    if (filteredList.length !== 0) {
      return filteredList;
    } else {
      return (filteredList = []);
    }
  } else {
    return artists;
  }
}

function prepareData(dataObject) {
  const artistArray = [];
  for (const key in dataObject) {
    const artistObject = dataObject[key];
    artistObject.id = key;
    artistArray.push(artistObject);
  }
  console.log(artistArray);
  return artistArray;
}

export { searchByName, filterArtists, sortByOption, filterByType, prepareData };
