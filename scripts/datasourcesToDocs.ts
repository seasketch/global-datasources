#!/usr/bin/env node
import project from "../project";
import fs from "fs-extra";
import projectClient from "../project/projectClient";

// Generate README.md for project from datasources.json

const outfile = `${__dirname}/../README.md`;

let out = "";

out += `\n# Global Datasources\n\n`;
out += `Listing of global datasource for use in SeaSketch projects\n\n`;

const dsMds = project.datasources.forEach((ds) => {
  out += `\n## ${ds.metadata?.name}\n\n`;
  out += `${ds.metadata?.description}\n`;
  out += `- Version: ${ds.metadata?.version}\n`;
  out += `- Publisher: ${ds.metadata?.publisher}\n`;
  out += `- Publish Date: ${ds.metadata?.publishDate}\n`;
  out += `- Source: [${ds.metadata?.publishLink}](${ds.metadata?.publishLink})\n`;
  out += `- Formats: ${ds.formats
    .map((f) => `[${f}](${projectClient.getDatasourceUrl(ds, { format: f })})`)
    .join(" | ")}\n`;
});

fs.writeFile(outfile, out);
