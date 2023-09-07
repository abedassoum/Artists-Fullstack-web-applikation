import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/artists", async (req, res) => {
  const data = await fs.readFile("data.json");
  const artists = JSON.parse(data);
  console.log("artists");
  res.json(artists);
});

app.put("/artists/:artistId", async (req, res) => {
  const artistId = parseInt(req.params.artistId);
  //get data
  const data = await fs.readFile("data.json");
  const artists = JSON.parse(data);
  //get artist
  const artistToUpdate = artists.find((artist) => artist.id === artistId);

  const body = req.body;
  console.log(artistToUpdate);
  artistToUpdate.name = body.name;
  artistToUpdate.birth = body.birth;
  artistToUpdate.image = body.image;
  artistToUpdate.genres = body.genres;
  artistToUpdate.labels = body.labels;
  artistToUpdate.website = body.website;
  artistToUpdate.shortDescription = body.shortDescription;
  await fs.writeFile("data.json", JSON.stringify(artists, null, 2));

  console.log(artistToUpdate);
  res.json(artistToUpdate);
});

app.put("/favouriteArtists/:artistId", async (req, res) => {
  const artistId = parseInt(req.params.artistId);
  //get data
  try {
    const data = await fs.readFile("data.json");
    const artists = JSON.parse(data);
    //get artist
    const artistToUpdate = artists.find((artist) => artist.id === artistId);
    if (!artistToUpdate) {
      return res.status(404).json({ message: "Artist not found" });
    }
    artistToUpdate.isFavorite = req.body.isFavorite;

    // Write the updated data back to the JSON file
    await fs.writeFile("data.json", JSON.stringify(artists, null, 2));

    // Send the updated artist as the response
    res.json(artistToUpdate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// app.post("/artists", (req, res) => {
//   res.json("is it json?");
// });

app.post("/artists", async (req, res) => {
  const body = req.body;

  // Read the existing data
  const data = await fs.readFile("data.json");
  const artists = JSON.parse(data);

  // Generate a new artist ID (assuming you have an array of artists)
  const newArtistId =
    artists.length > 0 ? artists[artists.length - 1].id + 1 : 1;

  // Create a new artist object
  const newArtist = {
    id: newArtistId,
    name: body.name,
    birth: body.birth,
    genres: body.genres,
    labels: body.labels,
    image: body.image,
    website: body.website,
    shortDescription: body.shortDescription,
  };

  // Add the new artist to the array
  artists.push(newArtist);

  // Write the updated data back to the file
  await fs.writeFile("data.json", JSON.stringify(artists));

  // Respond with the newly created artist
  res.json(newArtist);
});

app.delete("/artists/:id", async (req, res) => {
  const artistId = req.params.id;
  const id = parseInt(artistId);

  const data = await fs.readFile("data.json");
  const artists = JSON.parse(data);

  const artistToDelete = artists.find((artist) => artist.id === id);
  const index = artists.indexOf(artistToDelete);
  artists.splice(index, 1);

  fs.writeFile("data.json", JSON.stringify(artists));
  res.json(artists);
});

app.listen(port, () => {
  console.log(`Server started on localhost:${port}`);
});
