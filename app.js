// app.js
import express from "express";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = __dirname + "/data.json";

app.use(cors());
app.use(express.json());

app.get("/orarend", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath));
  res.json(data);
});

app.post("/orarend/:nap", (req, res) => {
  const nap = req.params.nap; 
  const { ora, tantargy } = req.body;
  const data = JSON.parse(fs.readFileSync(dataPath));
  if (!data[nap]) data[nap] = [];
  const letezo = data[nap].find(o => o.ora === ora);
  if (letezo) {
    return res.status(400).json({ message: "Ez az óra már létezik." });
  }
  data[nap].push({ ora, tantargy });
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.json({ message: "Óra hozzáadva", data: data[nap] });
});

app.put("/orarend/:nap/:ora", (req, res) => {
  const { nap, ora } = req.params;
  const { tantargy } = req.body;
  const data = JSON.parse(fs.readFileSync(dataPath));
  if (!data[nap]) {
    return res.status(404).json({ message: "Nincs ilyen nap az órarendben." });
  }
  const oraSzam = parseInt(ora);
  const oraElem = data[nap].find(o => o.ora === oraSzam);

  if (oraElem) {
    oraElem.tantargy = tantargy;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.json(oraElem);
  } else {
    res.status(404).json({ message: "Nem található a megadott óra." });
  }
});

app.delete("/orarend/:nap/:ora", (req, res) => {
  const { nap, ora } = req.params;
  const data = JSON.parse(fs.readFileSync(dataPath));
  
  if (!data[nap]) {
    return res.status(404).json({ message: "Nincs ilyen nap az órarendben." });
  }
  const oraSzam = parseInt(ora);
  const eredetiHossz = data[nap].length;
  data[nap] = data[nap].filter(o => o.ora !== oraSzam);
  if (data[nap].length === eredetiHossz) {
    return res.status(404).json({ message: "Nem található a megadott óra." });
  }
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.json({ message: "Óra törölve", data: data[nap] });
});
app.listen(PORT, () => {
  console.log(`API fut: http://localhost:${PORT}`);
});
