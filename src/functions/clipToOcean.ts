import {
  PreprocessingHandler,
  Feature,
  Sketch,
  clipToPolygonFeatures,
  FeatureClipOperation,
  VectorDataSource,
  ensureValidPolygon,
  Polygon,
  MultiPolygon,
  loadFgb,
} from "@seasketch/geoprocessing";
import { bbox } from "@turf/turf";
import project from "../../project/projectClient.js";

/**
 * Preprocessor takes a Polygon feature/sketch and returns the portion that
 * is in the ocean (not on land). If results in multiple polygons then returns the largest.
 */
export async function clipToOcean(feature: Feature | Sketch): Promise<Feature> {
  // throws if not valid with specific message
  ensureValidPolygon(feature, {
    minSize: 1,
    enforceMinSize: false,
    maxSize: 500_000 * 1000 ** 2, // Default 500,000 KM
    enforceMaxSize: false,
  });

  const featureBox = bbox(feature);

  // Get land polygons - daylight osm land vector datasource
  const ds = project.getInternalVectorDatasourceById(
    "global-coastline-daylight-v158"
  );
  const url = project.getDatasourceUrl(ds);
  const landFeatures: Feature<Polygon | MultiPolygon>[] = await loadFgb(
    url,
    featureBox
  );

  const eraseLand: FeatureClipOperation = {
    operation: "difference",
    clipFeatures: landFeatures,
  };

  // Execute one or more clip operations in order against feature
  return clipToPolygonFeatures(feature, [eraseLand], {
    ensurePolygon: true,
  });
}

export default new PreprocessingHandler(clipToOcean, {
  title: "clipToOcean",
  description: "Clips feature or sketch to ocean, removing land",
  timeout: 40,
  memory: 1024,
});
