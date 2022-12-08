function addSourceAndLayer(geojson){
    map.addSource('companies', {
        'type': 'geojson',
        'attribution': `Data collected by <u><a href="https://github.com/chrieke/awesome-geospatial-companies">Christoph Reike</a></u>.<br>\
        Contributions and comment are welcome at <u><a href="https://docs.google.com/spreadsheets/d/1pQQfcpPsh2EIJxCamAsL8B4c_GI8BaT-r8LCNckuE5w/edit?usp=sharing">Google Sheets</a></u>.<br>\
        Data available directly as <u><a href="${layerUrl}">GeoJSON</a></u>.`,
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
    map.addLayer({
        "id": "companies-label",
        "type": "symbol",
        "source": "companies",
        "minzoom": 9.5,
        "layout": {
          "text-field": ["get", "Name"],
          "text-font": ["Roboto Regular"],
          "icon-allow-overlap": true,
          "icon-anchor": "center",
          "text-anchor": "bottom",
          "text-size": 16,
          "text-allow-overlap": true,
          "text-line-height": 1.2
        },
        "paint": {
          "text-halo-color": "rgba(255, 255, 255, 0.89)",
          "text-halo-width": 1.5
        }
      })
    addEvents()
    populateSuggestions(geojson)
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
        let description = '';
        console.log(feature)
        description += (feature.properties.Logo && feature.properties.Logo.length >0) ? `<img class='logo-image' src="${feature.properties.Logo}" />` : '';
        description += (feature.properties.Name && feature.properties.Name.length >0) ? `<h2>${feature.properties.Name}</h2>` :'';
        description += (feature.properties.Notes__ex_name_ && feature.properties.Notes__ex_name_.length >0) ? `<b>Notes (ex-name):</b> ${feature.properties.Notes__ex_name_}<br>` :'';
        description += (feature.properties.Office_Size && feature.properties.Office_Size.length >0) ? `<b>Office Size:</b> ${feature.properties.Office_Size}<br>` :'';
        description += (feature.properties.Country && feature.properties.Country.length >0) ? `<b>Country:</b> ${feature.properties.Country}<br>` :'';
        description += (feature.properties.Category && feature.properties.Category.length >0) ? `<b>Category:</b> ${feature.properties.Category}<br>` :'';
        description += (feature.properties.Focus && feature.properties.Focus.length >0) ? `<b>Focus:</b> ${feature.properties.Focus}<br>` :'';
        description += (feature.properties.Website && feature.properties.Website.length >0) ? `<b>Website:</b> <a href="${feature.properties.Website}">${feature.properties.Website}</a><br>` :'';
        description += (feature.properties.City && feature.properties.City.length >0) ? `<b>City:</b> ${feature.properties.City}<br>` :'';
        description += (feature.properties.Address && feature.properties.Address.length >0) ? `<b>Address:</b> ${feature.properties.Address}<br>` :'';
        description += suggestEditButton()

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
         
    new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .on('open', function(){
            attachEditEvent(feature);
            })
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
    type:'add',
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
    ex_name:'Notes - Former name',
    office_Size:'Office Size',
    country:'Country',
    category:'Category',
    focus:'Focus',
    website:'Website',
    city:'City',
    address:'Address'
}

function attachEditEvent(feature){
    let openEditButton = document.getElementById('openEditControl')
    openEditButton.feature = feature;
    openEditButton.onclick = openEditForm
}
function openEditForm(){
    let openEditButton = document.getElementById('openEditControl')
    let feature = openEditButton.feature;
    console.log(feature)
    ToggleForm()
    if(map.hasControl(addCompanyControl)){
        document.getElementById('inputName').value = feature.properties.Name;
        document.getElementById('inputClick').children[0].style.color = '#800';
        document.getElementById('inputlat').value = feature.geometry.coordinates[1];
        document.getElementById('inputlon').value = feature.geometry.coordinates[0];
        currentParameters.lat = feature.geometry.coordinates[1]
        currentParameters.lon = feature.geometry.coordinates[0];
        document.getElementById('inputExName').value = feature.properties.Notes__ex_name_;
        document.getElementById('inputOffice').value = feature.properties.Office_Size;
        document.getElementById('inputCategory').value = feature.properties.Category;
        document.getElementById('inputWebsite').value = feature.properties.Website;
        document.getElementById('inputFocus').value = feature.properties.Focus;
        document.getElementById('inputCountry').value = feature.properties.Country;
        document.getElementById('inputCity').value = feature.properties.City;
        document.getElementById('inputAddress').value = feature.properties.Address;
        document.getElementById('inputImage').value = feature.properties.Logo;
        const e = new Event("change");
        document.getElementById('inputImage').dispatchEvent(e);
        currentParameters.id = feature.properties.id;
        inputSubmit.onclick = submitComment
    }
    

}
function suggestEditButton(){
    let spanClick = document.createElement('center');
    spanClick.classList.add('form-span')
    let labelClick = document.createElement('label');
    labelClick.innerHTML = `</br><b>Suggest edits:</b></br>`;
    let openEditControl = document.createElement('button');
    openEditControl.type = 'button';
    openEditControl.className = 'open-edit-button';
    openEditControl.id = 'openEditControl';
    openEditControl.innerHTML = '<i class="fg-map-edit fg-2x"></i> ';
    spanClick.append(labelClick,document.createElement('br'),openEditControl)

    return spanClick.outerHTML
}

function ToggleForm(){
    if(map.hasControl(addCompanyControl)){
        map.removeControl(addCompanyControl)
    }else{
        map.addControl(addCompanyControl)
    }
}

function getMapclick(e){
    document.getElementsByClassName('share-control')[0].innerHTML = '<i class="fg-map-share fg-2x" style="color:#fff;"></i>';
    // if after use of add point button, then get coords and open form
    if(waitForClick===1){
        waitForClick=0;
        currentLngLat = e.lngLat;
        currentParameters.lat = currentLngLat.lat
        inputlat.value = currentParameters.lat
        currentParameters.lon = currentLngLat.lng
        inputlon.value = currentParameters.lon
        if(isMobile){
            let forms = document.getElementsByClassName('company-form')
            if(forms.length > 0){
                let form = forms[0]
                form.style.display = 'block'
            }
        }
        let inputClick = document.getElementById('inputClick');
        inputClick.classList.remove('fg-spin');
        inputClick.children[0].style.color = '#800';

        
    };
};

function addPointLocation(){
    // tell map to wait for next click
    let inputClick = document.getElementById('inputClick');
    inputClick.classList.add('fg-spin');
    if(isMobile){
        let forms = document.getElementsByClassName('company-form')
        if(forms.length > 0){
            let form = forms[0]
            form.style.display = 'none'
        }
    }
    waitForClick=1
}

function buildForm(){
    
    let form = document.createElement('form');
    form.className = 'company-form'

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
    labelClick.innerHTML = `<b>Location:</b>`;
    let inputClick = document.createElement('button');
    inputClick.type = 'button';
    inputClick.id = 'inputClick';
    inputClick.innerHTML = '<i class="fg-pushpin fg-rotate20 fg-2x"></i> ';
    inputClick.onclick = addPointLocation
    spanClick.append(labelClick,document.createElement('br'),inputClick)

    form.append(document.createElement('br'),spanClick,document.createElement('br'))

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
    spanlat.append(labellon,document.createElement('br'),inputlon)

    form.append(spanlon,document.createElement('br'))

    let spanExName = document.createElement('span');
    spanExName.classList.add('form-span')
    let labelExName = document.createElement('label');
    labelExName.innerHTML = `<b>${fieldNames['ex_name']}:</b>`;
    let inputExName = document.createElement('input');
    inputExName.type = 'text';
    inputExName.id = 'inputExName';
    spanExName.append(labelExName,document.createElement('br'),inputExName)

    form.append(spanExName,document.createElement('br'))


    let spanOffice = document.createElement('span');
    spanOffice.classList.add('form-span')
    let labelOffice = document.createElement('label');
    labelOffice.innerHTML = `<b>${fieldNames['office_Size']}:</b>`;
    let inputOffice = document.createElement('select');
    inputOffice.name = 'inputOffice';
    inputOffice.id = 'inputOffice';
    
    let optionL = document.createElement('option');
    optionL.value = 'L'
    optionL.innerText = 'L (100 < employees)'
    let optionLB = document.createElement('option');
    optionLB.value = 'L (B)'
    optionLB.innerText = 'L (100 < employees) - Branch'
    let optionLH = document.createElement('option');
    optionLH.value = 'L (H)'
    optionLH.innerText = 'L (100 < employees) - Headquarters'

    let optionM = document.createElement('option');
    optionM.value = 'M'
    optionM.innerText = 'M (20-100 employees)'
    let optionMB = document.createElement('option');
    optionMB.value = 'M (B)'
    optionMB.innerText = 'M (20-100 employees) - Branch'
    let optionMH = document.createElement('option');
    optionMH.value = 'M (H)'
    optionMH.innerText = 'M (20-100 employees) - Headquarters'

    let optionS = document.createElement('option');
    optionS.value = 'S'
    optionS.innerText = 'S (20 > employees)'
    let optionSB = document.createElement('option');
    optionSB.value = 'S (B)'
    optionSB.innerText = 'S (20 > employees) - Branch'
    let optionSH = document.createElement('option');
    optionSH.value = 'S (H)'
    optionSH.innerText = 'S (20 > employees) - Headquarters'
    inputOffice.append(optionL,optionLB,optionLH,
        optionM,optionMB,optionMH,
        optionS,optionSB,optionSH)

    spanOffice.append(labelOffice,document.createElement('br'),inputOffice)

    form.append(spanOffice,document.createElement('br'))


    let spanCategory = document.createElement('span');
    spanCategory.classList.add('form-span')
    let labelCategory = document.createElement('label');
    labelCategory.innerHTML = `<b>${fieldNames['category']}:</b>`;
    let inputCategory = document.createElement('select');
    inputCategory.name = 'select';
    inputCategory.id = 'inputCategory';

    let option1 = document.createElement('option');
    option1.value = 'Digital Farming'
    option1.innerText = 'Digital Farming'

    let option2 = document.createElement('option');
    option2.value = 'Earth Observation'
    option2.innerText = 'Earth Observation'

    let option3 = document.createElement('option');
    option3.value = 'GIS / Spatial Analysis'
    option3.innerText = 'GIS / Spatial Analysis'

    let option4 = document.createElement('option');
    option4.value = 'Satellite Operator'
    option4.innerText = 'Satellite Operator'

    let option5 = document.createElement('option');
    option5.value = 'UAV / Aerial'
    option5.innerText = 'UAV / Aerial'

    let option6 = document.createElement('option');
    option6.value =  'Webmap / Cartography'
    option6.innerText =  'Webmap / Cartography'

    inputCategory.append(option1,option2,option3,option4,option5,option6)
    spanCategory.append(labelCategory,document.createElement('br'),inputCategory)

    form.append(spanCategory,document.createElement('br'))

    let spanWebsite = document.createElement('span');
    spanWebsite.classList.add('form-span')
    let labelWebsite = document.createElement('label');
    labelWebsite.innerHTML = `<b>${fieldNames['website']}:</b>`;
    let inputWebsite = document.createElement('input');
    inputWebsite.type = 'text';
    inputWebsite.id = 'inputWebsite';
    spanWebsite.append(labelWebsite,document.createElement('br'),inputWebsite)

    form.append(spanWebsite,document.createElement('br'))

    let spanFocus = document.createElement('span');
    spanFocus.classList.add('form-span')
    let labelFocus = document.createElement('label');
    labelFocus.innerHTML = `<b>${fieldNames['focus']}:</b>`;
    let inputFocus = document.createElement('input');
    inputFocus.type = 'text';
    inputFocus.id = 'inputFocus';
    spanFocus.append(labelFocus,document.createElement('br'),inputFocus)

    form.append(spanFocus,document.createElement('br'))
    
    let spanCountry = document.createElement('span');
    spanCountry.classList.add('form-span')
    let labelCountry = document.createElement('label');
    labelCountry.innerHTML = `<b>${fieldNames['country']}:</b>`;
    let inputCountry = document.createElement('input');
    inputCountry.type = 'text';
    inputCountry.id = 'inputCountry';
    spanCountry.append(labelCountry,document.createElement('br'),inputCountry)

    form.append(spanCountry,document.createElement('br'))

    let spanCity = document.createElement('span');
    spanCity.classList.add('form-span')
    let labelCity = document.createElement('label');
    labelCity.innerHTML = `<b>${fieldNames['city']}:</b>`;
    let inputCity = document.createElement('input');
    inputCity.type = 'text';
    inputCity.id = 'inputCity';
    spanCity.append(labelCity,document.createElement('br'),inputCity)

    form.append(spanCity,document.createElement('br'))

    let spanAddress = document.createElement('span');
    spanAddress.classList.add('form-span')
    let labelAddress = document.createElement('label');
    labelAddress.innerHTML = `<b>${fieldNames['address']}:</b>`;
    let inputAddress = document.createElement('input');
    inputAddress.type = 'text';
    inputAddress.id = 'inputAddress';
    spanAddress.append(labelAddress,document.createElement('br'),inputAddress)

    form.append(spanAddress,document.createElement('br'))

    let spanImage = document.createElement('span');
    spanImage.classList.add('form-span');
    let labelImage = document.createElement('label');
    labelImage.innerHTML = `<b>Logo URL:</b>`;
    let inputImage = document.createElement("input");
    inputImage.type = "text";
    inputImage.id = "inputImage";
    inputImage.pattern = "https?://.+"; // regex to match valid URLs
    

    const imgPreview = document.createElement("div");
    imgPreview.className = "imgPreview form-span"

    inputImage.addEventListener("change", async () => {
    // check if the input value is a valid URL
    if (!inputImage.validity.valid) return;

        try {
            // check if the URL returns an image
            //const res = await fetch(inputImage.value);
            //if (!res.headers.get("content-type").startsWith("image/")) return;

            // create an image element and set its src to the URL
            const img = document.createElement("img");
            img.src = inputImage.value;

            // clear the imgPreview div and append the new image
            imgPreview.innerHTML = "";
            imgPreview.style.height = "100px";
            imgPreview.appendChild(img);
            imgPreview.appendChild(document.createElement('br'));
        } catch (err) {
            // handle error
        }
    });
    spanImage.append(labelImage,document.createElement('br'),inputImage)

    form.append(spanImage,imgPreview)


    let spanSubmit = document.createElement('center');
    spanSubmit.classList.add('form-span')
    let inputSubmit = document.createElement('input');
    inputSubmit.type = 'button';
    inputSubmit.id = 'inputSubmit';
    inputSubmit.value = 'Submit';
    inputSubmit.onclick = submitForm
    spanSubmit.append(inputSubmit)

    form.append(document.createElement('br'),spanSubmit,document.createElement('br'))

    return form

}

function buildDescription(){
    let description = ''
    description += currentParameters.ex_name.length > 0 ? `Notes (ex-name): ${currentParameters.ex_name}<br>` : '';
    description += currentParameters.office_Size.length > 0 ? `Office Size: ${currentParameters.office_Size}<br>` : '';
    description += currentParameters.country.length > 0 ? `Country: ${currentParameters.country}<br>` : '';
    description += currentParameters.category.length > 0 ? `Category: ${currentParameters.category}<br>` : '';
    description += currentParameters.focus.length > 0 ? `Focus: ${currentParameters.focus}<br>` : '';
    description += currentParameters.website.length > 0 ? `Website: <a href="${currentParameters.website}"${currentParameters.website}</a><br>` : '';
    description += currentParameters.city.length > 0 ? `City: ${currentParameters.city}<br>` : '';
    description += currentParameters.address.length > 0 ? `Address: ${currentParameters.address}<br>` : '';
    
    return description

}
function buildShareSpan(){
    let container = document.createElement('span');

    let twitterButton = document.createElement('a');
    twitterButton.href = 'https://twitter.com/intent/tweet?text=Geospatial%20Companies%20Map%0D%0Ahttps://bogind.github.io/Geospatial-Companies/';
    twitterButton.target="_blank" ;
    twitterButton.rel="noopener noreferrer";
    twitterButton.title = "Share to Twitter";
    let twitterImage = document.createElement('img');
    twitterImage.src = 'icons/Twitter social icons - circle - white.png';
    twitterButton.append(twitterImage)

    let facebookButton = document.createElement('a');
    facebookButton.href = 'https://www.facebook.com/sharer/sharer.php?u=https://bogind.github.io/Geospatial-Companies/&t=Geospatial%20Companies%20Map';
    facebookButton.target="_blank" ;
    facebookButton.rel="noopener noreferrer";
    facebookButton.title = "Share to Facebook";
    let facebookImage = document.createElement('img');
    facebookImage.src = 'icons/f_logo_RGB-White_58.png';
    facebookButton.append(facebookImage)

    let whatsappButton = document.createElement('a');
    whatsappButton.href = 'https://wa.me?text=Geospatial%20Companies%20Map%0D%0Ahttps://bogind.github.io/Geospatial-Companies/"';
    whatsappButton.target="_blank" ;
    whatsappButton.rel="noopener noreferrer";
    whatsappButton.title = "Share to Whatsapp";
    let whatsappImage = document.createElement('img');
    whatsappImage.src = 'icons/Digital_Glyph_White.png';
    whatsappButton.append(whatsappImage)

    let copyURLButton = document.createElement('i');
    //copyURLButton.type = 'button'
    copyURLButton.onclick = function(){
        navigator.clipboard.writeText("https://bogind.github.io/Geospatial-Companies/")
    }
    copyURLButton.title = "Copy to clipboard";
    let copyURLImage = document.createElement('img');
    copyURLImage.src = 'icons/icons8-copy-24.png';
    copyURLButton.append(copyURLImage)
    

    container.append(twitterButton,facebookButton,whatsappButton,copyURLButton)
    return container
}
function toggleShare(e){
    let control = document.getElementsByClassName('share-control')[0];
    /*if(e.type == 'mouseover'){
        control.innerHTML = ''
        control.append(buildShareSpan())
    }else if(e.type == 'mouseout'){
        control.innerHTML = '<i class="fg-map-share-alt fg-2x" style="color:#fff;"></i>';
    }else if(e.type == 'click'){*/
        if(control.value == 0){
            control.innerHTML = ''
            control.append(buildShareSpan())
        }else{
            control.innerHTML = '<i class="fg-map-share-alt fg-2x" style="color:#fff;"></i>';
        }
    //}
}
function submitForm(){
    currentParameters.type = 'add';
    currentParameters.name = document.getElementById('inputName').value;
    currentParameters.lon = currentLngLat.lng ? currentLngLat.lng : 0.0;
    currentParameters.lat = currentLngLat.lat ?  currentLngLat.lat : 0.0;
    currentParameters.ex_name = document.getElementById('inputExName').value;
    currentParameters.office_Size = document.querySelector('#inputOffice').value;
    currentParameters.category = document.querySelector('#inputCategory').value;
    currentParameters.website = document.getElementById('inputWebsite').value;
    currentParameters.focus = document.getElementById('inputFocus').value;
    currentParameters.country = document.getElementById('inputCountry').value;
    currentParameters.city = document.getElementById('inputCity').value;
    currentParameters.address = document.getElementById('inputAddress').value;
    currentParameters.description = buildDescription()
    currentParameters.logo_url = document.getElementById('inputImage').value
    
    
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

function submitComment(){
    currentParameters.type = "comment";
    currentParameters.name = document.getElementById('inputName').value;
    currentParameters.ex_name = document.getElementById('inputExName').value;
    currentParameters.office_Size = document.querySelector('#inputOffice').value;
    currentParameters.category = document.querySelector('#inputCategory').value;
    currentParameters.website = document.getElementById('inputWebsite').value;
    currentParameters.focus = document.getElementById('inputFocus').value;
    currentParameters.country = document.getElementById('inputCountry').value;
    currentParameters.city = document.getElementById('inputCity').value;
    currentParameters.address = document.getElementById('inputAddress').value;
    currentParameters.description = buildDescription();
    currentParameters.logo_url = document.getElementById('inputImage').value
    
    
    let urlParams = "?";
    urlParams += `id=${currentParameters.id}&`;
    urlParams += 'type=comment&';
    urlParams += `comment=${JSON.stringify(currentParameters)}`;

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


function createFilterForm() {
    // create a div element to hold the filter control
    var filterControl = document.createElement('div');

    // create a close button
    var closeButton = document.createElement('button');
    closeButton.innerHTML = 'X';
    closeButton.onclick = ToggleFilter
    /*closeButton.addEventListener('click', function() {
    // hide the filter control when the close button is clicked
    //filterControl.style.display = 'none';
    });*/

    // add the close button to the filter control
    filterControl.appendChild(closeButton);

    // position the close button in the top right corner of the filter control
    closeButton.style.position = 'absolute';
    closeButton.style.top = 0;
    closeButton.style.right = 0;
  
    // create a small header
    var header = document.createElement('h3');
    header.innerHTML = 'Filter';
    filterControl.appendChild(header);
  
    // create input elements for name, country, and category
    var nameInput = document.createElement('input');
    nameInput.id = "nameInput";
    nameInput.type = 'text';
    nameInput.placeholder = 'Name';
    
    filterControl.appendChild(nameInput);
  
    var countryInput = document.createElement('input');
    countryInput.id = "countryInput";
    countryInput.type = 'text';
    countryInput.placeholder = 'Country';

    filterControl.appendChild(countryInput);

    

    
  
    var categorySelect = document.createElement('select');
    categorySelect.id = "categorySelect";
    categorySelect.multiple = true;
    categorySelect.size = 6;
    categorySelect.addEventListener('change', function() {
        let categoryFilter = getCategoriesFilter()
        filterPoints(nameInput.value, countryInput.value, categoryFilter);
    });

    // create options for the select element
    var digitalFarmingOption = document.createElement('option');
    digitalFarmingOption.innerHTML = 'Digital Farming';
    digitalFarmingOption.value = 'Digital Farming';
    categorySelect.appendChild(digitalFarmingOption);

    var earthObservationOption = document.createElement('option');
    earthObservationOption.innerHTML = 'Earth Observation';
    earthObservationOption.value = 'Earth Observation';
    categorySelect.appendChild(earthObservationOption);

    var gisSpatialAnalysisOption = document.createElement('option');
    gisSpatialAnalysisOption.innerHTML = 'GIS / Spatial Analysis';
    gisSpatialAnalysisOption.value = 'GIS / Spatial Analysis';
    categorySelect.appendChild(gisSpatialAnalysisOption);

    var satelliteOperatorOption = document.createElement('option');
    satelliteOperatorOption.innerHTML = 'Satellite Operator';
    satelliteOperatorOption.value = 'Satellite Operator';
    categorySelect.appendChild(satelliteOperatorOption);

    var uavAerialOption = document.createElement('option');
    uavAerialOption.innerHTML = 'UAV / Aerial';
    uavAerialOption.value = 'UAV / Aerial';
    categorySelect.appendChild(uavAerialOption);

    var webmapCartographyOption = document.createElement('option');
    webmapCartographyOption.innerHTML = 'Webmap / Cartography';
    webmapCartographyOption.value = 'Webmap / Cartography';
    categorySelect.appendChild(webmapCartographyOption);

    // add the select element to the filter control
    filterControl.appendChild(categorySelect);
  
    // hide the filter control by default
    //filterControl.style.display = 'none';

    // add event listeners to the name and country input elements to handle autocomplete functionality
    nameInput.addEventListener('input', function() {
        // filter the suggestions based on the input value
        let filteredNameSuggestions = filterNameSuggestions(nameInput.value);
        let categoryFilter = getCategoriesFilter()
    
        // show the filtered suggestions
        if(nameInput.value.length >= 2){
            showSuggestions(nameInput, filteredNameSuggestions);
            filterPoints(nameInput.value, countryInput.value, categoryFilter);
        }else if(nameInput.value.length < 2){
            suggestionsDiv = document.querySelector('.autocomplete-suggestions');
            if(suggestionsDiv){
                suggestionsDiv.parentElement.removeChild(suggestionsDiv);
            }
            map.setFilter('companies',null)
        }
    });

    countryInput.addEventListener('input', function() {
        // filter the suggestions based on the input value
        let filteredCountrySuggestions = filterCountrySuggestions(countryInput.value);
        let categoryFilter = getCategoriesFilter()

        // show the filtered suggestions
        if(countryInput.value.length >= 2){
            showSuggestions(countryInput, filteredCountrySuggestions);
            filterPoints(nameInput.value, countryInput.value, categoryFilter);
        }else if(countryInput.value.length < 2){
            suggestionsDiv = document.querySelector('.autocomplete-suggestions');
            if(suggestionsDiv){
                suggestionsDiv.parentElement.removeChild(suggestionsDiv);
            }
            map.setFilter('companies',null)
        }
        
    });

    // create a small "clear" button
    var clearButton = document.createElement('button');
    clearButton.innerHTML = 'Clear';

    // add an event listener to the "clear" button to clear the input elements
    clearButton.onclick = clearFilterAndSuggestions;

    // append the "clear" button to the filter control
    filterControl.appendChild(clearButton);
  
    return filterControl;
  }
  

function clearFilterAndSuggestions(){
    nameInput.value = '';
        countryInput.value = '';
        categorySelect.selectedIndex = -1;
        suggestionsDiv = document.querySelector('.autocomplete-suggestions');
        if(suggestionsDiv){
            suggestionsDiv.parentElement.removeChild(suggestionsDiv);
        }
        map.setFilter('companies',null)
}
function getCategoriesFilter(){
    let selected = document.querySelectorAll('#categorySelect option:checked');
    let values = Array.from(selected).map(el => el.value);
    categoryFilter = ['any']
    values.forEach(category => {
        categoryFilter.push(['==','Category',category])
    })
    return categoryFilter
}

function filterPoints(name, country, categoryFilter) {
    // get the name, country, and category filter values
    var nameFilter = ['==', 'Name', name];
    var countryFilter = ['==', 'Country', country];
    
    // combine the filters
    var filters = ['all']//, nameFilter, countryFilter, categoryFilter];
    if(name.length > 0){
        filters.push(nameFilter)
    }
    if(country.length > 0){
        filters.push(countryFilter)
    }
    if(categoryFilter.length > 1){
        filters.push(categoryFilter)
    }
    console.log(filters)
    // apply the filters to the point layer
    map.setFilter('companies', filters);
  }


// create arrays to hold the name and country suggestions
var nameSuggestions = [];
var countrySuggestions = [];


// create a function to populate the suggestions arrays with name and country values from a geojson feature collection
function populateSuggestions(geojson) {
  geojson.features.forEach(function(feature) {
    // add the name and country values to the suggestions arrays
    nameSuggestions.push(feature.properties.Name.trim());
    countrySuggestions.push(feature.properties.Country.trim());
  });
  nameSuggestions = [...new Set(nameSuggestions)];
  countrySuggestions = [...new Set(countrySuggestions)];
}


// create a function to filter the name suggestions array based on the input value
function filterNameSuggestions(inputValue) {
    return nameSuggestions.filter(function(suggestion) {
      // return suggestions that contain the input value
      return suggestion.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;
    });
  }
  

  // create a function to filter the country suggestions array based on the input value
function filterCountrySuggestions(inputValue) {
    return countrySuggestions.filter(function(suggestion) {
      // return suggestions that contain the input value
      return suggestion.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;
    });
  }

// create a function to show the autocomplete suggestions
function showSuggestions(input, suggestions) {
    // check if the suggestions div already exists
    var suggestionsDiv = input.parentNode.querySelector('.autocomplete-suggestions');
  
    // if the suggestions div doesn't exist, create it
    if (!suggestionsDiv) {
      suggestionsDiv = document.createElement('div');
  
      // add a class to the suggestions div to style it
      suggestionsDiv.classList.add('autocomplete-suggestions');
  
      // create a div element to hold the list of suggestions
      var suggestionsList = document.createElement('div');
  
      // add a class to the suggestions list to style it
      suggestionsList.classList.add('autocomplete-suggestions-list');
  
      // add the suggestions list to the suggestions div
      suggestionsDiv.appendChild(suggestionsList);
    }
  
    // get the suggestions list within the suggestions div
    var suggestionsList = suggestionsDiv.querySelector('.autocomplete-suggestions-list');
  
    // empty the suggestions list
    suggestionsList.innerHTML = '';
  
    // add the suggestions to the suggestions list
    suggestions.forEach(function(suggestion, index) {
      // only show up to 5 suggestions
      if (index < 5) {
        // create a button element for the suggestion
        var button = document.createElement('input');
        button.type = 'button'
  
        // set the inner HTML of the button to the suggestion
        button.value = suggestion;
        button.onclick = function(e){
            input.value = e.target.value;
            suggestionsDiv = document.querySelector('.autocomplete-suggestions');
            suggestionsDiv.parentElement.removeChild(suggestionsDiv);
            let name = document.getElementById('nameInput').value;
            let country = document.getElementById('countryInput').value;
            let categoryFilter = getCategoriesFilter()
            filterPoints(name,country,categoryFilter)
        }
  
        // add the button to the suggestions list
        suggestionsList.appendChild(button);
      }
    });
  
    // append the suggestions div after the input element
    input.parentNode.insertBefore(suggestionsDiv, input.nextSibling);
  
    // position the suggestions div below the input element
    suggestionsDiv.style.top = input.offsetTop + input.offsetHeight + 'px';
    suggestionsDiv.style.left = input.offsetLeft + 'px';
  }
  
function ToggleFilter(){
    if(map.hasControl(filterControl)){
        map.removeControl(filterControl);
        map.addControl(toggleFilterControl,'top-left');
    }else{
        map.removeControl(toggleFilterControl);
        map.addControl(filterControl,'top-left');
    }
}


function zoomToFiltered(){
    let name = document.getElementById('nameInput').value;
    let country = document.getElementById('countryInput').value;
    let selectedCategories = document.querySelectorAll('#categorySelect option:checked');
    let categories = Array.from(selectedCategories).map(el => el.value);

    let gj = map.getSource('companies').serialize().data;
    let features = []
    
    gj.features.forEach(feature => {
        let addToBBOX = false;
        if(name.length > 0){
            addToBBOX = feature.properties.Name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
        }
        if(country.length > 0){
            addToBBOX = addToBBOX && feature.properties.Country.toLowerCase().indexOf(country.toLowerCase()) !== -1
        }
        if(categories.length){
            addToBBOX = addToBBOX && categories.includes(feature.properties.Category)
        }
        if(addToBBOX){
            features.push(feature)
        }
           
    })
    let bbox = turf.bbox({
        "type": "FeatureCollection",
        "features": features
      })
      console.log({
        "type": "FeatureCollection",
        "features": features
      })
      console.log(bbox)
      map.fitBounds([[bbox[0],bbox[1]],[bbox[2],bbox[3]]], {
        maxZoom: 18,
        padding: {top: 25, bottom:25, left: 25, right: 25}
    });
}

