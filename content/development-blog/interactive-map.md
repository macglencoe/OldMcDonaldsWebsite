# Interactive Map

Lots of features have been added since the last blog post. The addition of an interactive map is the biggest game-changer.

The map is based on the [Leaflet](https://leafletjs.com) module, which is entirely open-source and free. It can pull imagery from any source, so I chose [OpenStreetMap](https://www.openstreetmap.org), since it is also free.

## Geo Features
In order to give visitors a true-to-scale overview of the farm's layout, I overlayed markers, zones, and paths on the map based on real coordinates.

![Map overview](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/j7lgwu8xa8njf5srnard.png)

### Icons
Most icons are stored on the server as SVGs, and then processed through a custom "icon factory" when they are needed. This makes it easy to add new icons, and reuse existing ones.

### Popups
The map has been made interactive by allowing certain elements to be clicked on, which will reveal a 'popup' with more content.

![Image popup](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/arcfcvm38jz5xw9o72dq.png)


![Link Popup](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ecw7va2rvykyyaeh5pb0.png)



## Geolocation
Utilizing the JS `navigator.geolocation` API, I implemented a simple geolocation feature that refreshes every 8 seconds. Users can click the GPS button to center the map on their location.

![Geolocation](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uk3d4uj72dfwfqxb3nfc.gif)

## Zoom Visibility Control and Limits
In order to reduce crowding and maintain the aesthetic appeal of the map, some icons and tooltips will disappear when zoomed out to certain levels.

Additionally, zooming has been limited to level 16, and capped at level 19, since that is the maximum level OpenStreetMap will provide tiles for.

![Zoom Visibility Control](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/54d5a0wz4jw15h7429ob.gif)

## Fly Links
This feature fully incorporates the map with the rest of the website. I've made a lightweight system that allows linking to specific coordinates via the URL query.

This will enable visitors to be pointed directly to the location they're looking for without pouring over the map.


![Fly Link](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/sh8lbj96paydi2e4465m.gif)




