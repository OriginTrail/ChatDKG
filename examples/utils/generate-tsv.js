// This file generates a simple tsv file from the input graph, used to produce vector embeddings

import fs from "fs";

const yewmakerol = JSON.parse(fs.readFileSync("./yewmakerol.json"));

const tsvData = [];

const ual = process.argv[2];
const id = yewmakerol["@id"];
for (const section of yewmakerol.sections) {
  const sectionTitle = section.title;
  for (const subsection of section.subsections) {
    const subsectionTitle = subsection.title;
    // Sanitize the body text here
    let sanitizedBody = subsection.body
      .replace(/\n/g, "\\n")
      .replace(/\t/g, "\\t");

    if (subsectionTitle) {
      sanitizedBody = `${subsectionTitle} ${sanitizedBody}`;
    }

    if (sectionTitle) {
      sanitizedBody = `${sectionTitle} ${sanitizedBody}`;
    }
    tsvData.push({
      ual,
      id,
      sectionTitle: sectionTitle ?? "undefined",
      subsectionTitle: subsectionTitle ?? "undefined",
      body: sanitizedBody,
    });
  }
}

// Convert JSON objects to TSV
const tsv = tsvData
  .map((row) => {
    return Object.values(row).join("\t");
  })
  .join("\n");

// Add headers
const header = Object.keys(tsvData[0]).join("\t");
const tsvWithHeader = `${header}\n${tsv}`;

fs.writeFileSync("output.tsv", tsvWithHeader);
