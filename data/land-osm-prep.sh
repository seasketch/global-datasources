#!/bin/bash

psql -t <<SQL
  DROP TABLE land_osm;
  DROP TABLE land_osm_final;
  DROP TABLE land_osm_final_bundles;
SQL

# Import, keeping column name casing intact, and setting the SRID field to 4326
shp2pgsql -D -k -s 4326 src/land-polygons-complete-4326/land_polygons.shp land_osm | psql

# Create spatial index
psql -t <<SQL
  CREATE INDEX ON land_osm USING gist(geom);
SQL

# Subdivide into new table land_subdivided
psql -f land-osm.sql
