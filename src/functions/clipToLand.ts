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
} from "@seasketch/geoprocessing";
import { bbox } from "@turf/turf";
import project from "../../project/projectClient.js";

/**
 * Preprocessor takes a Polygon feature/sketch and returns the portion that
 * is on land.
 */
export async function clipToLand(feature: Feature | Sketch): Promise<Feature> {
  if (!isPolygonFeature(feature)) {
    throw new ValidationError("Input must be a polygon");
  }
  const featureBox = bbox(feature);

  const ds = project.getInternalVectorDatasourceById(
    "global-coastline-daylight-v158"
  );
  const url = project.getDatasourceUrl(ds);
  const landFeatures: Feature<Polygon | MultiPolygon>[] = await loadFgb(
    url,
    featureBox
  );

  const keepLand: FeatureClipOperation = {
    operation: "intersection",
    clipFeatures: landFeatures,
  };

  // Execute one or more clip operations in order against feature
  return clipToPolygonFeatures(feature, [keepLand], {
    ensurePolygon: true,
  });
}

export default new PreprocessingHandler(clipToLand, {
  title: "clipToLand",
  description: "Clips portion of feature or sketch not overlapping land",
  timeout: 40,
  memory: 1024,
});
