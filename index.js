const layerUrl = "https://script.google.com/macros/s/AKfycbwMj3p--L1h57PB_b1TUF1h-fYgMZGRYaHaSBmQ6_3ZyzL2jT8lqCwhB-b-obgRFwgZbg/exec"
let hoveredStateId = null;
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

function addSourceAndLayer(geojson){
    map.addSource('companies', {
        'type': 'geojson',
        'data': geojson
    });
    map.addLayer({
        'id': 'companies',
        'type': 'circle',
        'source': 'companies',
        'layout': {},
        'paint': {
            // Make circles larger as the user zooms from z12 to z22.
            'circle-radius': 5,
            'circle-stroke-color':'#39d1d3',
            'circle-stroke-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0
                ],
            'circle-stroke-width':1.5,
            // Color circles by ethnicity, using a `match` expression.
            'circle-color': [
            'match',
            ['get', 'Category'],
            'Digital Farming',
            '#74ae36',
            'Earth Observation',
            '#ff5252',
            'GIS / Spatial Analysis',
            '#ffe900',
            'Satellite Operator',
            '#757575',
            'UAV / Aerial',
            '#048ad1',
            'Webmap / Cartography',
            '#f57801',
            /* other */ '#ccc'
            ]
            }
        });
    addEvents()
}
function addEvents(){
    
    map.on('mousemove', 'companies', (e) => {
        if (e.features.length > 0) {
        if (hoveredStateId !== null) {
        map.setFeatureState(
        { source: 'companies', id: hoveredStateId },
        { hover: false }
        );
        }
        hoveredStateId = e.features[0].id;
        map.setFeatureState(
        { source: 'companies', id: hoveredStateId },
        { hover: true }
        );
        }
    });
    map.on('mouseenter', 'companies', () => {
        map.getCanvas().style.cursor = 'pointer'
    })
         
        // When the mouse leaves the state-fill layer, update the feature state of the
        // previously hovered feature.
    map.on('mouseleave', 'companies', () => {
        map.getCanvas().style.cursor = ''
        if (hoveredStateId !== null) {
        map.setFeatureState(
        { source: 'companies', id: hoveredStateId },
        { hover: false }
        );
        }
        hoveredStateId = null;
    });

    map.on('click', 'companies', (e) => {
        const feature = e.features[0]
        const coordinates = feature.geometry.coordinates.slice();
        console.log(feature)
        let description = '';
        description += (feature.properties.Name && feature.properties.Name.length >0) ? `<h2>${feature.properties.Name}</h2>` :'';
        description += (feature.properties.Notes__ex_name_ && feature.properties.Notes__ex_name_.length >0) ? `<b>Notes (ex-name):</b> ${feature.properties.Notes__ex_name_}<br>` :'';
        description += (feature.properties.Office_Size && feature.properties.Office_Size.length >0) ? `<b>Office Size:</b> ${feature.properties.Office_Size}<br>` :'';
        description += (feature.properties.Country && feature.properties.Country.length >0) ? `<b>Country:</b> ${feature.properties.Country}<br>` :'';
        description += (feature.properties.Category && feature.properties.Category.length >0) ? `<b>Category:</b> ${feature.properties.Category}<br>` :'';
        description += (feature.properties.Focus && feature.properties.Focus.length >0) ? `<b>Focus:</b> ${feature.properties.Focus}<br>` :'';
        description += (feature.properties.Website && feature.properties.Website.length >0) ? `<b>Website:</b> <a href="${feature.properties.Website}">${feature.properties.Website}</a><br>` :'';
        description += (feature.properties.City && feature.properties.City.length >0) ? `<b>City:</b> ${feature.properties.City}<br>` :'';
        description += (feature.properties.Address && feature.properties.Address.length >0) ? `<b>Address:</b> ${feature.properties.Address}<br>` :'';

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
         
    new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });
        
}

let currentParameters ={
    user:'',
    lng:0.0,
    lat:0.0,
    ITM_x:0.0,
    ITM_y:0.0,
    merhav_k:0,
    merhav_t:'',
    n_trees:0,
    hakshata_k:0,
    hakshata_t:'',
    address_t:'',
    earot:'',
    type_k:'',
    type_t:''
}
const fieldNames = {
    user:'משתמש',
    lng:'קו אורך',
    lat:'קו רוחב',
    ITM_x:'X רשת ישראל',
    ITM_y:'Y רשת ישראל',
    merhav_k:'קוד מרחב',
    merhav_t:'תיאור מרחב',
    n_trees:"מס' עצים",
    hakshata_k:'קוד הקשתה',
    hakshata_t:'תיאור הקשתה',
    address_t:'כתובת',
    earot:'הערות',
    type_k:'קוד סוג',
    type_t:'תיאור סוג'
}

function addPointLocation(){

}

function buildForm(){

}

function submitForm(){

}

class LegendControl {
    onAdd(map){
      this.map = map;
      this.container = document.createElement('div');
      this.container.className = 'legend-control mapboxgl-ctrl-group maplibregl-ctrl mapboxgl-ctrl';
      let legend = document.createElement('div');
      legend.className = 'legend';

      let title = document.createElement('h4');
      title.innerText = 'Company Category';
      legend.append(title)

      let li1 = document.createElement('div');
      li1.innerHTML = `<span style="background-color: #723122"></span>Digital Farming`

      let li2 = document.createElement('div');
      li2.innerHTML = `<span style="background-color: #ff5252"></span>Earth Observation`

      let li3 = document.createElement('div');
      li3.innerHTML = `<span style="background-color: #ffe900"></span>GIS / Spatial Analysis`

      let li4 = document.createElement('div');
      li4.innerHTML = `<span style="background-color: #757575"></span>Satellite Operator`

      let li5 = document.createElement('div');
      li5.innerHTML = `<span style="background-color: #048ad1"></span>UAV / Aerial`

      let li6 = document.createElement('div');
      li6.innerHTML = `<span style="background-color: #f57801"></span>Webmap / Cartography`
      
      legend.append(li1,li2,li3,li4,li5,li6)

      this.container.append(legend)
      return this.container;
    }
    onRemove(){
      this.container.parentNode.removeChild(this.container);
      this.map = undefined;
    }
  }

class AddCompanyButton {
    onAdd(map){
      this.map = map;
      this.container = document.createElement('div');
      this.container.className = 'add-button maplibregl-ctrl maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group';
      this.container.innerHTML = '<button><b>+</b></button>';
      this.container.title = "Add a Company"
      this.container.value = 0;
      this.container.onclick = addPointLocation
      return this.container;
    }
    onRemove(){
      this.container.parentNode.removeChild(this.container);
      this.map = undefined;
    }
  }

class AddCompanyControl {

    onAdd(map){
        this.map = map;
        this.container = document.createElement('div');
        this.container.className = 'add-control mapboxgl-ctrl-group maplibregl-ctrl mapboxgl-ctrl';
    
        let form = buildForm()
        this.container.append(form)
        return this.container;
    }
  onRemove(){
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}

let legendControl = new LegendControl();
let addCompanyButton = new AddCompanyButton();

map.addControl(legendControl,'top-left');
map.addControl(addCompanyButton,'top-right');