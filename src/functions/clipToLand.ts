import {
  PreprocessingHandler,
  Feature,
  Sketch,
  isPolygonFeature,
  ValidationError,
  VectorDataSource,
  FeatureClipOperation,
  clipToPolygonFeatures,
  Polygon,
  MultiPolygon,
  loadFgb,
  clipMultiMerge,
  ensureValidPolygon,
  biggestPolygon,
} from "@seasketch/geoprocessing";
import { area, bbox, featureCollection } from "@turf/turf";
import project from "../../project/projectClient.js";

/**
 * Preprocessor takes a Polygon feature/sketch and returns the portion that
 * is on land.
 */
export async function clipToLand(feature: Feature | Sketch): Promise<Feature> {
  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }

  // throws if not valid with specific message
  ensureValidPolygon(feature, {
    minSize: 1,
    enforceMinSize: false,
    maxSize: 500_000 * 1000 ** 2, // Default 500,000 KM
    enforceMaxSize: false,
  });

  const featureBox = bbox(feature);

  // Get features from land datasource

  const ds = project.getInternalVectorDatasourceById(
    "global-coastline-daylight-v158"
  );
  const url = project.getDatasourceUrl(ds);
  const landFeatures: Feature<Polygon | MultiPolygon>[] = await loadFgb(
    url,
    featureBox
  );

  // Keep portion of sketch over land

  let clipped: Feature<Polygon | MultiPolygon> | null = feature;

  if (landFeatures.length === 0) {
    clipped = null; // No land to clip to, intersection is empty
  }

  if (clipped !== null) {
    clipped = clipMultiMerge(
      clipped,
      featureCollection(landFeatures),
      "intersection"
    );
  }

  if (!clipped || area(clipped) === 0) {
    throw new ValidationError("Feature is outside of land boundary");
  }

  // Assume user wants the largest polygon if multiple remain
  return biggestPolygon(clipped);
}

export default new PreprocessingHandler(clipToLand, {
  title: "clipToLand",
  description: "Clips portion of feature or sketch not overlapping land",
  timeout: 40,
  memory: 1024,
});
