var bool_dbg =false
var dictStr_cityList = {}
var str_liCityCSS = "li-city"
var div_cityBoard = $(".city-board")
var div_weatherBoard = $(".weather-forecast-board")
var obj_5DayForecast = {}
var int_lat =0
var int_lon = 0
var apiUrl = ''

var apiKey = passApiKey;

var func_updateCityBoard = (argsStr_cityName, args_data)=>{
   
    var h1_cityName = $("<h1>").addClass("h1-city-name")
    h1_cityName.attr('id', 'h1-city-name')
    h1_cityName.html(argsStr_cityName)
    div_cityBoard.append(h1_cityName)

    var today = moment().format("M/D/Y")
    console.log(args_data)
    var float_temp = "Temp: "+ args_data.current.temp
    var str_wind = "Wind: " + args_data.current.weather[0].description
    var int_humidity = "Humidity: "+ args_data.current.humidity
    var uvi = "UVI:"+ args_data.current.uvi
    console.log(`${today} | ${float_temp} | ${str_wind} | ${int_humidity} | ${uvi}`)
}


var func_updateWeatherBoard = (argStr_cityName, args_Obj5Day)=>{
    //todo temp, wind, humidity, UV Index
    
    div_weatherBoard.children().remove()
    if(bool_dbg)console.log('in func_updateWeatherBoard')
    

    

    //todo cloud icon
    
    var str_date = args_Obj5Day

    function createLi(args_str){
      var li = $("<li>").addClass("li-weather-card-item list-unstyled w-100 p-0")
      return li.html(args_str)
    }

    var div_container = $("<div>").addClass("container")
    var div_row = $("<div>").addClass("row")
    
    for(key in args_Obj5Day){
      var div_weatherCard = $("<div>").addClass("card col")
      var str_date = key;
      var float_temp = "Temp: "+ args_Obj5Day[key]["main"]["temp"]
      var str_wind = "Wind: " + args_Obj5Day[key]["weather"][0]["description"]
      var int_humidity = "Humidity: "+ args_Obj5Day[key]["main"]["humidity"]
      //console.log(args_Obj5Day[key]["main"]["humidity"])
      
      var ul = $("<ul>").addClass("w-100 p-0")
      ul.append(createLi(str_date))
      ul.append(createLi(float_temp))
      ul.append(createLi(str_wind))
      ul.append(createLi(int_humidity))
      div_weatherCard.append(ul)
      div_row.append(div_weatherCard)
      div_container.append(div_row)
      
    }
    div_weatherBoard.append(div_container)
    
    //console.log(createLi(str_date))
    
   
    // todo humidity
    

   
}

var func_getCurrentWeather = (args_lat, args_lon, argsStr_cityName)=>{
  if(bool_dbg)console.log(`lat: ${args_lat} | Lon: ${args_lon}`)
  
  //apiUrl=`https://api.openweathermap.org/data/2.5/weather?q=${argStr_cityName}&appid=${apiKey}`
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${args_lat}&lon=${args_lon}&appid=${apiKey}`
  fetch(apiUrl) //make api call
  .then(function(response) {
    // 1st then waits to see if there is a valid response

    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        // ToDo code
        console.log(data)
        func_updateCityBoard(argsStr_cityName, data)
        
        
      });
    } else {
      alert('Error: city not found');
    }
  })
  .catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method
    alert("Unable to connect to api");
  });//end fetch

}


var func_searchCity = (argStr_cityName)=>{
  
  // clear the board for a new city
  div_cityBoard.children().remove() 
  
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${argStr_cityName}&appid=${apiKey}`
  if(bool_dbg) console.log(apiUrl)

  
  
  fetch(apiUrl) //make api call
  .then(function(response) {
    // 1st then waits to see if there is a valid response

    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        if(bool_dbg)console.log("in  func_searchCity")
        if(bool_dbg)console.log(data)
        var obj_temp = data.list
        
        int_lat = data.city.coord.lat
        int_lon = data.city.coord.lon
        console.log(data.city.name)
        func_getCurrentWeather(int_lat,int_lon, data.city.name)

        obj_temp.forEach(element => {
          
        
        var str_date =  moment(element.dt_txt).format("M/D/Y")
        //console.log(str_date)
        obj_5DayForecast[str_date] = element
        
          
        });
        if(bool_dbg)console.log("before exiting search")
        
        func_updateWeatherBoard(data.city.name, obj_5DayForecast)
      });
    } else {
      alert('Error: city not found');
    }
  })
  .catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method
    alert("Unable to connect to api");
  });// end fetch

  



}




var func_addCityList = (argStr_cityName)=>{
    //add city to array
    //if(bool_dbg)console.log(`in func_addCityList ${argStr_cityName}`)
    
    //if city is not in the list, add it to the list

    if(dictStr_cityList[argStr_cityName] === undefined){
    var index = dictStr_cityList.length
    dictStr_cityList[argStr_cityName] =argStr_cityName;
    var ul_cityList = $("#city-list")
    
    var li_aCity = $("<li>").addClass(str_liCityCSS)
    li_aCity.attr('id', `li-city-${index}`)
    li_aCity.html(argStr_cityName)
    ul_cityList.append(li_aCity)

    
    }
    
    // else city is on the list, so just search for it.
    //search city
    func_searchCity(argStr_cityName)
    
    
    //func_searchCity(obj_coordinates)
    


}

$("#btn-search").on("click", ()=>{
    var str_cityName = $("#city-name").val()
    if(bool_dbg)console.log(`city ${str_cityName}`)
    // todo if null search value, update search field with warning and don't search
    func_addCityList(str_cityName)
})