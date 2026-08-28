const layerUrl = "https://script.google.com/macros/s/AKfycbxL_qgoaKAKLQqWNwT1QI9_CSe-GR7oT3x_wUD66rxsPtgevP1CBcHoqPj9LAWpNFc/exec"
let hoveredStateId = null;
let waitForClick = 0;
let currentLngLat;
const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
let map = new maplibregl.Map({
    container: 'map', // container id
    style: {
    'version': 8,
        "glyphs":"https://bogind.com/glfonts/{fontstack}/{range}.pbf",
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
    zoom: 3, // starting zoom
    attributionControl: false
})
.addControl(new maplibregl.AttributionControl({
    compact: true
    }));

map.on('load', () => {
    loadLayer()
})
function loadLayer(){
    fetch(layerUrl)
    .then(res => res.json())
    .then(data => addSourceAndLayer(data))
}


map.addControl(legendControl,'top-left');
map.addControl(toggleFilterControl,'top-left');
map.addControl(addCompanyButton,'top-right');
map.addControl(shareButton,'bottom-left')
//feather.replace({width:"14px", height:"14px"})