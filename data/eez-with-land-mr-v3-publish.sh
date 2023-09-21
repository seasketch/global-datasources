source ../.env

# Publish to s3.  Defaults to dry-run, remove to actually publish
AWS_REGION=us-west-1 npx geoprocessing bundle-features global-eez-with-land-mr-v3 eez_with_land_mr_v3_final \
   --connection "postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}" \
   --points-limit 50000
   # --dry-run
   # --envelope-max-distance 200