#!/bin/bash

# Install postgis with shp2pgsql and raster2pgsql
# https://www.paulshapley.com/2022/12/install-postresql-14-and-postgis-3-on.html
sudo apt -y install gnupg2
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list
sudo apt update
sudo apt install postgis postgresql-14-postgis-3
