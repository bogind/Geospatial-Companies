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
      li1.innerHTML = `<span style="background-color: #74ae36"></span>Digital Farming`

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
      this.container.onclick = ToggleForm
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

class EditCompanyControl {

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
let editCompanyControl = new EditCompanyControl();
let addCompanyControl = new EditCompanyControl();