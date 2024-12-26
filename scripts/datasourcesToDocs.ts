#!/usr/bin/env node
import project from "../project/projectClient.js";
import fs from "fs-extra";
import { isVectorDatasource } from "@seasketch/geoprocessing";

// Generate README.md for project from datasources.json

const outfile = `${import.meta.dirname}/../DATASOURCES.md`;

let out = "";

out += `\n# Datasources\n\n`;

const dsMds = project.datasources.forEach((ds) => {
  out += `\n## ${ds.metadata?.name}\n\n`;
  out += `${ds.metadata?.description}\n\n`;
  out += `- Datasource ID: ${ds.datasourceId}\n`;
  out += `- Version: ${ds.metadata?.version}\n`;
  out += `- Publisher: ${ds.metadata?.publisher}\n`;
  out += `- Publish Date: ${ds.metadata?.publishDate}\n`;
  out += `- Source: [${ds.metadata?.publishLink}](${ds.metadata?.publishLink})\n`;
  out += `- URL: ${ds.formats
    .map(
      (f) =>
        `[${project.getDatasourceUrl(ds, { format: f })}](${project.getDatasourceUrl(ds, { format: f })})`,
    )
    .join(" | ")}\n`;
  if (isVectorDatasource(ds)) {
    out += `- Feature ID property: ${ds.idProperty || ""}\n`;
    out += `- Feature name property: ${ds.nameProperty || "N/A"}\n`;
  }
});

fs.writeFile(outfile, out);
