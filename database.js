import sqlite from "sqlite3";

const db = new sqlite.Database("./data/database.sqlite");

export function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

export async function initializeDatabase() {
  await dbRun("DROP TABLE IF EXISTS orarend;");
  await dbRun(`
    CREATE TABLE IF NOT EXISTS orarend (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nap TEXT NOT NULL,
      ora INTEGER NOT NULL,
      tantargy TEXT NOT NULL
    );
  `);

  const orarendiAdatok = [
    { nap: "hetfo", ora: 1, tantargy: "Nyelvtan" },
    { nap: "hetfo", ora: 2, tantargy: "Matek" },
    { nap: "hetfo", ora: 3, tantargy: "Töri" },
    { nap: "hetfo", ora: 4, tantargy: "Matek" },
    { nap: "hetfo", ora: 5, tantargy: "Tesi" },
    { nap: "hetfo", ora: 6, tantargy: "Js" },
  
    { nap: "kedd", ora: 1, tantargy: "Történelem" },
    { nap: "kedd", ora: 2, tantargy: "Német" },
    { nap: "kedd", ora: 3, tantargy: "Angol" },
    { nap: "kedd", ora: 4, tantargy: "IKT" },
    { nap: "kedd", ora: 5, tantargy: "Matek" },
    { nap: "kedd", ora: 6, tantargy: "Irodalom" },
  
    { nap: "szerda", ora: 1, tantargy: "Webprogramozás" },
    { nap: "szerda", ora: 2, tantargy: "Matematika" },
    { nap: "szerda", ora: 3, tantargy: "Angol" },
    { nap: "szerda", ora: 4, tantargy: "Angol" },
    { nap: "szerda", ora: 5, tantargy: "Történelem" },
  
    { nap: "csutortok", ora: 1, tantargy: "Történelem" },
    { nap: "csutortok", ora: 2, tantargy: "Irodalom" },
    { nap: "csutortok", ora: 3, tantargy: "Matek" },
    { nap: "csutortok", ora: 4, tantargy: "Angol" },
    { nap: "csutortok", ora: 5, tantargy: "Német" },
    { nap: "csutortok", ora: 6, tantargy: "Angol" },
  
    { nap: "pentek", ora: 1, tantargy: "Történelem" },
    { nap: "pentek", ora: 2, tantargy: "PHP" },
    { nap: "pentek", ora: 3, tantargy: "Webprogramozás" },
    { nap: "pentek", ora: 4, tantargy: "Tesnevelés" },
    { nap: "pentek", ora: 5, tantargy: "Angol" },
    { nap: "pentek", ora: 6, tantargy: "IKT" }
  ];
  

  for (const ora of orarendiAdatok) {
    await dbRun(
      "INSERT INTO orarend (nap, ora, tantargy) VALUES (?, ?, ?);",
      [ora.nap, ora.ora, ora.tantargy]
    );
  }

  console.log("Adatbázis inicializálva – orarend feltöltve.");
}