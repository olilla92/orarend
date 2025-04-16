import express from "express";
import cors from "cors";
import { initializeDatabase, dbAll, dbGet, dbRun } from "./util/database.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/orarend", async (req, res) => {
  try {
    const adatok = await dbAll("SELECT * FROM orarend ORDER BY nap, ora;");
    res.status(200).json(adatok);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/orarend/:id", async (req, res) => {
  try {
    const entry = await dbGet("SELECT * FROM orarend WHERE id = ?;", [req.params.id]);
    if (!entry) {
      return res.status(404).json({ message: "Órarendi bejegyzés nem található" });
    }
    res.status(200).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/orarend", async (req, res) => {
  try {
    const { nap, ora, tantargy } = req.body;
    if (!nap || !ora || !tantargy) {
      return res.status(400).json({ message: "Hiányzó adat(ok): nap, óra vagy tantárgy" });
    }

    const result = await dbRun(
      "INSERT INTO orarend (nap, ora, tantargy) VALUES (?, ?, ?);",
      [nap, ora, tantargy]
    );
    res.status(201).json({ id: result.lastID, nap, ora, tantargy });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/orarend/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const entry = await dbGet("SELECT * FROM orarend WHERE id = ?;", [id]);
    if (!entry) {
      return res.status(404).json({ message: "Órarendi bejegyzés nem található" });
    }

    const { nap, ora, tantargy } = req.body;
    if (!nap || !ora || !tantargy) {
      return res.status(400).json({ message: "Hiányzó adat(ok)" });
    }

    await dbRun(
      "UPDATE orarend SET nap = ?, ora = ?, tantargy = ? WHERE id = ?;",
      [nap, ora, tantargy, id]
    );
    res.status(200).json({ id, nap, ora, tantargy });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/orarend/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const entry = await dbGet("SELECT * FROM orarend WHERE id = ?;", [id]);
    if (!entry) {
      return res.status(404).json({ message: "Órarendi bejegyzés nem található" });
    }

    await dbRun("DELETE FROM orarend WHERE id = ?;", [id]);
    res.status(200).json({ message: "Órarendi bejegyzés törölve" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint nem található" });
});

async function startServer() {
  await initializeDatabase();
  app.listen(3000, () => {
    console.log(`API fut: http://localhost:3000`);
  });
}

startServer();
