import { Database } from "../database.js";
import { stringify } from "csv-stringify";
import fs from "node:fs";

const database = new Database();

export async function generateCsv(req, res) {
  try {
    const tasks = database.select("tasks");

    const writeStream = fs.createWriteStream("./src/challenge/task.csv");

    const csvStream = stringify({ header: true });

    csvStream.pipe(writeStream);

    for (const task of tasks) {
      csvStream.write({ id: task.id, title: task.title });
    }

    csvStream.end();

    // Aguarda o término da gravação no arquivo
    writeStream.on("finish", () => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("CSV gerado com sucesso!");
    });

    writeStream.on("error", (error) => {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Erro ao gerar CSV - " + error.message);
    });
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Erro ao gerar CSV - " + error.message);
  }
}
