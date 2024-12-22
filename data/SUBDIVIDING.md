
A QGIS-based process is used subdividing vector datasource that are not already.

Start with your vector datasource loaded in QGIS:
- Run `validity` tool to make sure it's polygons are all valid
  - If invalid polygons, run `buffer` tool with distance of `0`.
  - Run validity tool again to check.
  - Remove all intermediate layer outputs from your map to prevent confusion.
- Run `subdivide` tool with 256 nodes on your original dataset, or your buffered dataset if correction was needed.
- Run `Multipart to single part` tool on the subdivided result to explode multipolygons in polygons.
- Run `validity` test on that result, will output two layers, a set of valid polygon and a set of invalid polygons
  - If invalid polygons, run `buffer` tool with distance of `0` on the invalid polygons layer output by the validity tool only.
  - Run `validity` tool on the result to verify no more errors.
  - Remove all intermediate layer outputs from your map to prevent confusion.  You only need the 
- Run `merge` with your now valid polygons, and the valid polygons from the previous stop
- Look at attribute table and verify the total number of polygons in your merged set is the same as the result of running the multipart-to-single-part

There is potential to further automate this process.