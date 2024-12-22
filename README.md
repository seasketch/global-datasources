# Global Datasources

A set of global datasources published for use in SeaSketch geoprocessing projects.

[See full datasource list](./DATASOURCES.md)

![cover image](./img/multi-layer-view.png)
Vector datasources are subdivided into smaller pieces and published in flatgeobuf format for efficient fetching of subsets of the data.

![cover image](./img/raster-view.png)
Raster datasources are published as cloud-optimized GeoTIFF files format for efficient fetching of subsets of the data.

The easiest way to explore these datasources is to load them in QGIS using the provided URL.  It is important that you zoom in to your area of interest before loading each layer, to avoid it needing to download the entire datasource.  The use of cloud-optimized formats makes this possible.