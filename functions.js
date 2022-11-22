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