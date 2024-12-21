
QGIS-based process for creating subdivided flatgeobuf dataset

Startin with data/dist/global-eez-mr-v12.fgb, in QGIS:
- Run `subdivide` tool with 256 nodes
- Run `Multipart to single part` tool on the subdivided result to explode multipolygons in polygons.
- Run `validity` test on that result, will output two layers, a set of valid polygon and a set of invalid polygons
  - Run `buffer` with a value of 0 on the invalid polygons
  - Run `validity` tool on it to verify no more errors
- Run `merge` with your now valid polygons, and the valid polygons from the previous stop
- Look at attribute table and verify the total number of polygons in your merged set is the same as the result of running the multipart-to-single-part
