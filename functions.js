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

    map.on('click', getMapclick)

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

function refreshData(){
    fetch(layerUrl)
    .then(res => res.json())
    .then(data => {
        map.getSource('companies').setData(data)
    })
}

let currentParameters ={
    name:'',
    lat:0.0,
    lon:0.0,
    description:'',
    ex_name:'',
    office_Size:'',
    country:'',
    category:'',
    focus:'',
    website:'',
    city:'',
    address:''
}
const fieldNames = {
    name:'Name',
    lat:'Latitude',
    lon:'Longitude',
    description:'Description',
    ex_name:'Notes - ex_name',
    office_Size:'Office_Size',
    country:'Country',
    category:'Category',
    focus:'Focus',
    website:'Website',
    city:'City',
    address:'Address'
}

function ToggleForm(){
    if(map.hasControl(addCompanyControl)){
        map.removeControl(addCompanyControl)
    }else{
        map.addControl(addCompanyControl)
    }
}

function getMapclick(e){
    // if after use of add point button, then get coords and open form
    if(waitForClick===1){
        waitForClick=0;
        currentLngLat = e.lngLat;
        currentParameters.lat = currentLngLat.lat
        inputlat.value = currentParameters.lat
        currentParameters.lon = currentLngLat.lng
        inputlon.value = currentParameters.lon
        let inputClick = document.querySelector('.fg-pushpin')
        inputClick.style.color = '#800'

        
    };
};

function addPointLocation(){
    // tell map to wait for next click
    waitForClick=1
}

function buildForm(){
    
    let form = document.createElement('form')

    let spanName = document.createElement('span');
    spanName.classList.add('form-span')
    let labelName = document.createElement('label');
    labelName.innerHTML = `<b>${fieldNames['name']}:</b>`;
    let inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.id = 'inputName';
    spanName.append(labelName,document.createElement('br'),inputName)

    form.append(spanName,document.createElement('br'))

    let spanClick = document.createElement('center');
    spanClick.classList.add('form-span')
    let labelClick = document.createElement('label');
    labelClick.innerHTML = `<b>${fieldNames['name']}:</b>`;
    let inputClick = document.createElement('button');
    inputClick.type = 'button';
    inputClick.id = 'inputClick';
    inputClick.innerHTML = '<i class="fg-pushpin fg-rotate20 fg-2x" style="color:#666;"></i> ';
    inputClick.onclick = addPointLocation
    spanClick.append(labelClick,document.createElement('br'),inputClick)

    form.append(spanClick,document.createElement('br'))

    let spanlat = document.createElement('span');
    spanlat.classList.add('form-span')
    let labellat = document.createElement('label');
    labellat.innerHTML = `<b>${fieldNames['lat']}:</b>`;
    let inputlat = document.createElement('input');
    inputlat.type = 'text';
    inputlat.id = 'inputlat';
    inputlat.disabled = true;
    spanlat.append(labellat,document.createElement('br'),inputlat,document.createElement('br'))

    form.append(spanlat,document.createElement('br'))

    let spanlon = document.createElement('span');
    spanlon.classList.add('form-span')
    let labellon = document.createElement('label');
    labellon.innerHTML = `<b>${fieldNames['lon']}:</b>`;
    let inputlon = document.createElement('input');
    inputlon.type = 'text';
    inputlon.id = 'inputlon';
    inputlon.disabled = true;
    spanlat.append(labellon,document.createElement('br'),inputlon,document.createElement('br'))

    form.append(spanlon,document.createElement('br'))


    let spanSubmit = document.createElement('center');
    spanSubmit.classList.add('form-span')
    let inputSubmit = document.createElement('input');
    inputSubmit.type = 'button';
    inputSubmit.id = 'inputSubmit';
    inputSubmit.value = 'Submit';
    inputSubmit.onclick = submitForm
    spanSubmit.append(inputSubmit)

    form.append(spanSubmit)

    return form

}

function submitForm(){
    currentParameters.name = document.getElementById('inputName').value 
    currentParameters.lon = currentLngLat.lng ? currentLngLat.lng : 0.0;
    currentParameters.lat = currentLngLat.lat ?  currentLngLat.lat : 0.0;
    
    
    let urlParams = "?";
    for (var key in currentParameters) {
        if (urlParams != "") {
            urlParams += "&";
        }
        urlParams += (key + "=" + encodeURIComponent(currentParameters[key]));
    }

    let url = layerUrl + urlParams
    
    fetch(url, {
        method: 'POST',
        redirect: 'follow'
        })

    if(map.hasControl(addCompanyControl)){
        map.removeControl(addCompanyControl);
        refreshData()
        }
}