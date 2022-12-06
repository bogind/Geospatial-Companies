const layerUrl = "https://script.google.com/macros/s/AKfycbwMj3p--L1h57PB_b1TUF1h-fYgMZGRYaHaSBmQ6_3ZyzL2jT8lqCwhB-b-obgRFwgZbg/exec"
let hoveredStateId = null;
let waitForClick = 0;
let currentLngLat;
let map = new maplibregl.Map({
    container: 'map', // container id
    style: {
    'version': 8,
        'sources': {
            'OSM': {
            'type': 'raster',
            'tiles': ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            'tileSize': 256,
            'attribution':'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    },
    'layers': [
    {
    'id': 'osm',
    'type': 'raster',
    'source': 'OSM',
    'minzoom': 0,
    'maxzoom': 22
    }
    ]
    },
    center: [0, 40], // starting position
    zoom: 3 // starting zoom
});

map.on('load', () => {
    loadLayer()
})
function loadLayer(){
    fetch(layerUrl)
    .then(res => res.json())
    .then(data => addSourceAndLayer(data))
}


map.addControl(legendControl,'top-left');
map.addControl(addCompanyButton,'top-right');