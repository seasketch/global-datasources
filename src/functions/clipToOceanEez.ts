import {
  PreprocessingHandler,
  Feature,
  Sketch,
  ensureValidPolygon,
  FeatureClipOperation,
  VectorDataSource,
  clipToPolygonFeatures,
  Polygon,
  MultiPolygon,
  loadFgb,
} from "@seasketch/geoprocessing";
import { bbox } from "@turf/turf";
import project from "../../project/projectClient.js";

/**
 * Preprocessor takes a Polygon feature/sketch and returns the portion that
 * is in the ocean (not on land) and within one or more EEZ boundaries.
 */
export async function clipToOceanEez(
  feature: Feature | Sketch
): Promise<Feature> {
  // throws if not valid with specific message
  ensureValidPolygon(feature, {
    minSize: 1,
    enforceMinSize: false,
    maxSize: 500_000 * 1000 ** 2, // Default 500,000 KM
    enforceMaxSize: false,
  });

  const featureBox = bbox(feature);

  // Erase portion of sketch over land

  const landDs = project.getInternalVectorDatasourceById(
    "global-coastline-daylight-v158"
  );
  const landUrl = project.getDatasourceUrl(landDs);
  const landFeatures: Feature<Polygon | MultiPolygon>[] = await loadFgb(
    landUrl,
    featureBox
  );
  const eraseLand: FeatureClipOperation = {
    operation: "difference",
    clipFeatures: landFeatures,
  };

  // Keep portion of sketch within EEZ

  const eezDs = project.getInternalVectorDatasourceById(
    "global-eez-land-union-mr-v4"
  );
  const eezUrl = project.getDatasourceUrl(eezDs);
  const eezFeatures: Feature<Polygon | MultiPolygon>[] = await loadFgb(
    eezUrl,
    featureBox
  );
  // Optionally filter to single EEZ polygon by UNION name
  const keepInsideEez: FeatureClipOperation = {
    operation: "intersection",
    clipFeatures: eezFeatures,
  };

  return clipToPolygonFeatures(feature, [eraseLand, keepInsideEez], {
    ensurePolygon: true,
  });
}

export default new PreprocessingHandler(clipToOceanEez, {
  title: "clipToOceanEez",
  description: "Example-description",
  timeout: 40,
  requiresProperties: [],
  memory: 1024,
});
