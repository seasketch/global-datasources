source ../.env

# Publish to s3.  Defaults to dry-run, remove to actually publish
npx geoprocessing bundle-features global-eez-with-land eez_with_land_final \
   --connection "postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}" \
   --points-limit 60000
   # --envelope-max-distance 200