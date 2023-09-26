source ../.env

# Publish to s3.  Defaults to dry-run, remove to actually publish

AWS_REGION=us-west-1 npx geoprocessing bundle-features global-land-osm land_osm_final \
   --connection "postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}" \
   --points-limit 25000
   # --dry-run
   # --envelope-max-distance 200