#!/bin/bash

psql -t <<SQL
  DROP TABLE eez_mr_v11;
  DROP TABLE eez_mr_v11_final;
  DROP TABLE eez_mr_v11_final_bundles;
SQL

# Import, keeping column name casing intact, and setting the SRID field to 4326
shp2pgsql -D -k -s 4326 src/World_EEZ_v11_20191118/eez_v11.shp eez_mr_v11 | psql

# Create spatial index
psql -t <<SQL
  CREATE INDEX ON eez_mr_v11 USING gist(geom);
SQL

# Subdivide into new table land_subdivided
psql -f eez-mr-v11.sql
