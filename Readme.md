# Beholder Detection
This is the marker detection component of Beholder. Current Version 1.1.8

## Installation
```
npm install beholder-detection
```
or you can use UNPKG
```
<script src="https://unpkg.com/beholder-detection@{VERSION_NUM}/dist/beholder-detection.js"></script>
```

## Usage
Basic Example
```
// with require
const Beholder = require('beholder-detection');

// with UNPKG
const Beholder = window['beholder-detection'];
```



### General Functions
A '*' indicates an optional parameter.

| syntax | usage |
| --- | --- |
| `init('dom-selector', config*, markerList*)` | Initializes Beholder and appeneds needed elements to the DOM (video and webgl canvas). Requires you to pass a root dom element to append objects to. See details on config below. MarkerList is an array of integer marker ids you wish to track (defaults to [0-99]) |
| `update()` | Runs detection code and updates all marker objects |
| `show()` | Reveals detection overlay |
| `hide()` | Hides detection overlay |

#### Custom Config
The config passed in on the initialize function can be used to set various parameters of the Beholder popup in default states. To change these parameters you must pass and object that mirrors the following structure.
```
{
    camera_params: {
        videoSize: 1, // The video size values map to the following [320 x 240, 640 x 480, 1280 x 720, 1920 x 1080]
        rearCamera: false, // Boolean value for defaulting to the rear facing camera. Only works on mobile
        torch: false, // Boolean value for if torch/flashlight is on. Only works for rear facing mobile cameras. Can only be set from init
    },
    detection_params: {
        minMarkerDistance: 10,
        minMarkerPerimeter: 0.2,
        maxMarkerPerimeter: 0.8,
        sizeAfterPerspectiveRemoval: 49,
   },
   feed_params: {
        contrast: 0,
        brightness: 0,
        grayscale: 0,
        flip: false,
   },
}
```

### Individual Marker
| syntax | usage |
| --- | --- |
| `getMarker(ID)` | returns Marker object with corresponding ID.<br>`ID` should be an integer between `0` to `99`. |
| `getMarker(ID).present` | returns Marker presence as either `true` or `false`. |
| `getMarker(ID).timeout` | returns Marker timeout in milliseconds. If a marker is not detected again within the timeout window, its presence is set to `false`.<br>Set timeout value with the following statement:<br>e.g. `getMarker(ID).timeout = 100` |
| `getMarker(ID).center` | returns Marker center as an object in the form<br>`{ x: val, y: val }`. |
| `getMarker(ID).corners` | returns Marker corners as an array of 4 objects corresponding to the corners of the marker, starting with the top-left corner. Each corner in the form<br>`{ x: val, y: val }`.<br>Individual corners can be accessed via their index, e.g. `.corners[0]` |
| `getMarker(ID).rotation` | returns Marker rotation in radians as a float between `-pi` to `pi`. |

![Individual Marker](./docs/img/marker_annotation.png)

**Example Usage**

    var demoMarker = Beholder.getMarker(0);
    
    if( demoMarker.present ) {
        var demoCenter = demoMarker.center;
        var demoRotation = demoMarker.rotation;
        
        console.log(demoCenter.x, demoCenter.y, demoRotation);
    }

### Marker Pairs
| syntax | usage |
| --- | --- |
| `getMarkerPair(ID_A, ID_B)` | returns MarkerPair object with corresponding pair of IDs.<br>`ID_A` and `ID_B` should be an integer between `0` to `99`. |
| `getMarkerPair(ID_A, ID_B).distance` | returns distance in pixels between marker pair. |
| `getMarkerPair(ID_A, ID_B).angleBetween` | returns angle between marker pair in radians as a float between `-pi` to `pi`. |
| `getMarkerPair(ID_A, ID_B).getRelativePosition(size)` | returns estimate of real world position of marker B relative to marker A. `size` is the width of marker A.<br> This method returns an object with three properties: `distance`, `heading`, and `rotation` (see figure below). |

![Marker Pair](./docs/img/marker_pair.png)

**Example Usage**
```
var demoMarkerPair = Beholder.getMarkerPair(0, 1);
var realWorldPosition = demoMarkerPair.getRelativePosition(25);

console.log(realWorldPosition.distance, realWorldPosition.heading, realWorldPosition.rotation);
```
