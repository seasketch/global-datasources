#!/bin/bash

psql -t <<SQL
  DROP TABLE eez_with_land;
  DROP TABLE eez_with_land_final;
  DROP TABLE eez_with_land_final_bundles;
SQL

# Import, keeping column name casing intact, and setting the SRID field to 4326
shp2pgsql -D -k -s 4326 src/EEZ_land_union_v3_202003/EEZ_Land_v3_202030.shp eez_with_land | psql

# Create spatial index
psql -t <<SQL
  CREATE INDEX ON eez_with_land USING gist(geom);
SQL

# Subdivide into new table land_subdivided
psql -f eez-with-land.sql
