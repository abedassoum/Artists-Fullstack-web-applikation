const endpoint = "http://localhost:3000";

async function getArtists() {
  const res = await fetch(`${endpoint}/artists`);
  const data = await res.json();
  console.log(data);
  return data;
}

async function createArtist(
  name,
  image,
  birth,
  activeSince,
  genres,
  labels,
  website,
  shortDescription
) {
  console.log("createArtist");
  console.log(name, birth, genres, website);

  const newArtist = {
    name: name,
    birth: birth,
    activeSince: activeSince,
    genres: genres,
    labels: labels,
    image: image,
    website: website,
    shortDescription: shortDescription,
  };
  console.log(newArtist);
  const artistJson = JSON.stringify(newArtist);

  const response = await fetch(`${endpoint}/artists`, {
    method: "POST",
    body: artistJson,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status == 200) {
    alert("ARTIST CREATED!");
    return 200;
  } else {
    throw new Error("Failed to create artist"); // Handle the error
  }
}

async function updateArtist(
  id,
  name,
  image,
  birth,
  activeSince,
  genres,
  labels,
  website,
  shortDescription
) {
  const updatedArtist = {
    name: name,
    birth: birth,
    activeSince: activeSince,
    genres: genres,
    labels: labels,
    image: image,
    website: website,
    shortDescription: shortDescription,
  };
  const upArtistJson = JSON.stringify(updatedArtist);

  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "PUT",
    body: upArtistJson,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status == 200) {
    getArtists();
    alert("ARTIST UPDATED!");
    return 200;
  } else {
    throw new Error("Failed to Update artist"); // Handle the error
  }
}

async function deleteArtist(id) {
  const response = await fetch(`${endpoint}/artists/${id}`, {
    method: "DELETE",
  });

  if (response.status == 200) {
    alert("ARTIST DELETED!");
    return 200;
  } else {
    throw new Error("Failed to delete artist"); // Handle the error
  }
}

async function markFavourite(id) {
  const updatedArtist = {
    isFavorite: true,
  };

  const upArtistJson = JSON.stringify(updatedArtist);

  const response = await fetch(`${endpoint}/favouriteArtists/${id}`, {
    method: "PUT",
    body: upArtistJson,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status == 200) {
    return 200;
  } else {
    throw new Error("Failed to mark the Artist as Favourite"); // Handle the error
  }
}

export { getArtists, createArtist, updateArtist, deleteArtist, markFavourite };
