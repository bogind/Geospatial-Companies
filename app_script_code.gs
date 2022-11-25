function doGet(e) {
    // Will only work when connected to a sheet, otherwise change to 'SpreadsheetApp.openById'
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Geospatial_companies");
  var range = sheet.getRange("A2:N");
  var values = range.getValues();
  
  var base_object = {
    "type": "FeatureCollection",
    "features": []
  };
  for(var i=0;i<values.length;i++){ 
    if(values[i][13] === 1){
      var feature = {
      "type": "Feature",
      "id":values[i][0], 
      "properties": { 
        "id":values[i][0], 
        "Name": values[i][1], 
        "description": values[i][4],
        "Notes__ex_name_": values[i][5],
        "Office_Size": values[i][6],
        "Country": values[i][7],
        "Category": values[i][8],
        "Focus": values[i][9],
        "Website": values[i][10],
        "City": values[i][11],
        "Address": values[i][12]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          values[i][3],
          values[i][2]
        ]
      }
    };
    base_object.features.push(feature);
    }
    
    
  }

  var response = ContentService.createTextOutput(JSON.stringify( base_object));
  response.setMimeType(ContentService.MimeType.JSON);
  return response;  
}

function doPost(e){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Geospatial_companies");
  var parameters = e.parameter;
  var id = countRows();
  
  var name = parameters.name ? parameters.name : "unknown";
  var lat = parameters["lat"];
  var lon = parameters["lon"];
  var description = parameters.description ? parameters.description : ""
  var ex_name = parameters.ex_name ? parameters.ex_name : ""
  var office_Size = parameters.office_Size ? parameters.office_Size : ""
  var country = parameters.country ? parameters.country : ""
  var category = parameters.category ? parameters.category : ""
  var focus = parameters.focus ? parameters.focus : ""
  var website = parameters.website ? parameters.website : ""
  var city = parameters.city ? parameters.city : ""
  var address = parameters.address ? parameters.address : ""
  
  
  sheet.appendRow([id, name,lat,lon,description,ex_name,office_Size,country,category,focus,website,city,address,0]);
  return ContentService.createTextOutput(200)
}
function countRows(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Geospatial_companies");
  var range = sheet.getRange("A2:N");
  return range.getNumRows()+1;
}