import { getFeatures } from "@seasketch/geoprocessing/dataproviders";
import { chunk, clip, roundDecimal } from "@seasketch/geoprocessing";
import fs from "fs-extra";
import area from "@turf/area";
import bbox from "@turf/bbox";
import { $ } from "zx";
import { featureCollection as fc } from "@turf/helpers";
import project from "../project/projectClient";

// Calculates stats using Marine Regions EEZ v11
// Which metadata says is based on ESRI World Countries 2014 with some differences, possibly amendments using GEBCO or other bathymetry data

const inEez = "src/World_EEZ_v11_20191118/eez_v11.shp";
const outEez = "src/EEZ_land_union_v3_202003/EEZ_Land_v3_202030.geojson";
const inEezWithLand = "src/EEZ_land_union_v3_202003/EEZ_Land_v3_202030.shp";
const outEezWithLand =
  "src/EEZ_land_union_v3_202003/EEZ_Land_v3_202030.geojson";

(async () => {
  // start fresh
  await $`rm -f ${outEez}`;
  await $`rm -f ${outEezWithLand}`;

  // calculate equal area 6933 using sqlite, and strip unneeded properties
  //const query = `SELECT "GEONAME", GEOMETRY, round(ST_Area(ST_Transform(GEOMETRY, 6933)), 0) as area_6933 FROM EEZ_Land_v3_202030 ORDER BY "GEONAME"`;

  // OPTION 1
  // https://gis.stackexchange.com/questions/237980/ogr2ogr-sql-returning-points-from-one-sqlite-dataset-that-intersect-with-anoth
  // combine shapefiles into one sqlite with two tables
  // write query that for each eez-with-land feature, query matching eez feature using MRGID_EEZ, calculate geom difference

  // OPTION 2
  // Convert to geojson and pare down attributes (450MB!!!!!!!!!!!!!!!!)
  // const query = `SELECT "GEONAME", "MRGID", GEOMETRY FROM eez_v11 ORDER BY "GEONAME"`;
  // await $`ogr2ogr -f GeoJSON -dialect sqlite -sql ${query} ${outEez} ${inEez}`;

  // For each eez-with-land feature, fetch matching eez feature using MRGID_EEZ
  // Calculate

  // // Calculate turf area and bbox, strip geometry to save space
  // let eezFeatures = fs.readJSONSync(outfile);

  // for (const eezFeat of eezFeatures.features) {
  //   console.log(eezFeat.properties.GEONAME);
  //   eezFeat.area_turf = area(eezFeat);
  //   eezFeat.bbox = bbox(eezFeat);
  //   eezFeat.geometry = null; // remove geometry to save space
  // }
  // fs.writeJsonSync(outfile, eezFeatures);
})();
