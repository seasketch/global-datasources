#!/bin/bash
# Expects that global-eez-mr-v12 has already been imported.  This is a subdivided variation

# This method currently is not used, it doesn't complete, but it's a start. See eez-mr-v12-subdivided.md for the QGIS process that does work.
rm -f data/dist/global-eez-mr-v12-subdivided.fgb
ogr2ogr -f FlatGeobuf -explodecollections -dialect sqlite -sql "select GEONAME, MRGID, ST_buffer(ST_Subdivide(geometry, 512), 0) from eez_v12" data/dist/global-eez-mr-v12-subdivided.fgb data/dist/global-eez-mr-v12.fgb
