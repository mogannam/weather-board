var bool_dbg =false
var dictStr_cityList = {}
var str_liCityCSS = "li-city list-group-item"
var div_cityBoard = $(".city-board")
var div_weatherBoard = $(".weather-forecast-board")
var obj_5DayForecast = {}
var int_lat =0
var int_lon = 0
var apiUrl = ''
var str_weatherUnit = "imperial"

var apiKey = passApiKey;

var func_resetForm = ()=>{}

var func_updateCityBoard = (argsStr_cityName, args_data)=>{

  function createLi(args_str){
    var li = $("<li>").addClass("li-weather-card-item list-unstyled w-100 p-0")
    return li.html(args_str)
  }
  
    var today = moment().format("M/D/Y")

    var h1_cityName = $("<h1>").addClass("h1-city-name")
    h1_cityName.attr('id', 'h1-city-name')
    h1_cityName.html(`${argsStr_cityName}(${today})`)
    
    var float_windSpeed = args_data.current.wind_speed
    
    
    var float_temp = "Temp: "+ args_data.current.temp + "&#8457;"
    var str_wind = "Wind: " + float_windSpeed+" MPH"
    var str_wind2 = args_data.current.weather[0].main
    var str_imgUrl = `http://openweathermap.org/img/wn/${func_getWindUrl(str_wind2)}d@2x.png`;
    var int_humidity = "Humidity: "+ args_data.current.humidity

    var int_uvi = args_data.current.uvi
    var str_uviCss = "bg-light"
    if(int_uvi <= 2)
      str_uviCss = "bg-success"
    else if(int_uvi <=5)
      str_uviCss = "bg-warning"
    else if(int_uvi <=7)
      str_uviCss = "bg-orange"
    else if(int_uvi <=10)
      str_uviCss = "bg-danger"
    else
      str_uviCss ="bg-purple"
    var uvi = `UVI: <span class=\"uvi-index ${str_uviCss}\">`+ int_uvi+ "</span>"

    var ul = $("<ul>").addClass("w-100 p-0")
    //ul.append(createLi(today))

    var li_image = createLi("")
    var img = $("<img>").addClass("img-cityboard")
    img.attr('src', str_imgUrl)
    li_image.append(img)
    h1_cityName.append(li_image)
    div_cityBoard.append(h1_cityName)

    ul.append(createLi(float_temp))
    ul.append(createLi(str_wind))
    ul.append(createLi(int_humidity))
    ul.append(createLi(uvi))
    div_cityBoard.append(ul)
    
   
  }
var func_getWindUrl = (argsStr_wind)=>{
  
  var Str_return = "10" // Rain
  if(argsStr_wind ==="Clear"){
    Str_return = "01"
  }
  else if (argsStr_wind === "Clouds"){
    Str_return = "02"
  }
  else if(argsStr_wind === "scattered clouds"){
    Str_return = "03"
  }
  else if(argsStr_wind === "shower rain"){
    Str_return = "09"
  }
  else if(argsStr_wind === "Rain"){
    Str_return = "10"
  }
  else if(argsStr_wind === "thunderstorm"){
    Str_return = "11"
  }
  else if(argsStr_wind === "snow"){
    Str_return ="13"
  }
  else if(argsStr_wind ==="mist"){
    Str_return = "50"
  }
  else{ // clouds
    Str_return = "04"
  }

  return Str_return


}

var func_updateWeatherBoard = (argStr_cityName, args_Obj5Day)=>{
    //todo temp, wind, humidity, UV Index
    
    div_weatherBoard.children().remove()
  
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
      var float_temp = "Temp: "+ args_Obj5Day[key]["main"]["temp"] + "&#8457;"

      var float_windSpeed = args_Obj5Day[key].wind.speed
      
      var str_wind = "Wind: " + float_windSpeed+" MPH"
      
      var str_wind2 = args_Obj5Day[key]["weather"][0]["main"]
      var str_imgUrl = `http://openweathermap.org/img/wn/${func_getWindUrl(str_wind2)}d@2x.png`;
      var int_humidity = "Humidity: "+ args_Obj5Day[key]["main"]["humidity"]
      
      var ul = $("<ul>").addClass("w-100 p-0")
      ul.append(createLi(str_date))
      var li_image = createLi("")
      var img = $("<img>").addClass("img-weatherboard")
      img.attr('src', str_imgUrl)
      li_image.append(img)
      ul.append(li_image)
      
      ul.append(createLi(float_temp))
      ul.append(createLi(str_wind))
      ul.append(createLi(int_humidity))
      div_weatherCard.append(ul)
      div_row.append(div_weatherCard)
      div_container.append(div_row)
      
    }
    div_weatherBoard.append(div_container)
    

   
}

var func_getCurrentWeather = (args_lat, args_lon, argsStr_cityName)=>{
  
  //apiUrl=`https://api.openweathermap.org/data/2.5/weather?q=${argStr_cityName}&appid=${apiKey}`
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?units=${str_weatherUnit}&lat=${args_lat}&lon=${args_lon}&appid=${apiKey}`
  fetch(apiUrl) //make api call
  .then(function(response) {
    // 1st then waits to see if there is a valid response

    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        // ToDo code
        
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


var func_addCityList = (argStr_cityName)=>{
  //add city to array
 
  //if city is not in the list, add it to the list
  
  dictStr_cityList = JSON.parse(localStorage.getItem("dictStr_cityList"))
  
  if(dictStr_cityList === null)
    dictStr_cityList = {}
  if(dictStr_cityList[argStr_cityName] === undefined){
  var index = Object.keys(dictStr_cityList).length
  dictStr_cityList[argStr_cityName] =argStr_cityName;
  var ul_cityList = $("#city-list").addClass("list-group")
  
  var li_aCity = $("<li>").addClass(str_liCityCSS)
  li_aCity.attr('id', `li-city-${index}`)
  li_aCity.html(argStr_cityName)
  ul_cityList.append(li_aCity)
  localStorage.setItem("dictStr_cityList", JSON.stringify(dictStr_cityList))

  
  }
  
  // else city is on the list, so just search for it.
  //search city
  //func_searchCity(argStr_cityName)
  
  
  //func_searchCity(obj_coordinates)
  
}

var func_searchCity = (argStr_cityName)=>{
  
  // clear the board for a new city
  div_cityBoard.children().remove() 
  
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?units=${str_weatherUnit}&q=${argStr_cityName}&appid=${apiKey}`
  
  
  fetch(apiUrl) //make api call
  .then(function(response) {
    // 1st then waits to see if there is a valid response

    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        
        func_addCityList(argStr_cityName)
        var obj_temp = data.list
        
        int_lat = data.city.coord.lat
        int_lon = data.city.coord.lon
        
        func_getCurrentWeather(int_lat,int_lon, data.city.name)

        obj_temp.forEach(element => {
          
        
        var str_date =  moment(element.dt_txt).format("M/D/Y")
        
        obj_5DayForecast[str_date] = element
        
          
        });
        
        
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






var func_loadCachedCityList = ()=>{
  
  dictStr_cityList = JSON.parse(localStorage.getItem("dictStr_cityList"))
  var ul_cityList = $("#city-list").addClass("list-group")
  var index = 0;
  
  var index = 0
  if(dictStr_cityList != null){
    
    var keysArr = Object.keys(dictStr_cityList)
    keysArr.forEach((element, key) => {
      
      
      var li_aCity = $("<li>").addClass(str_liCityCSS)
      li_aCity.attr('id', `li-city-${index}`)
      li_aCity.html(element)
      ul_cityList.append(li_aCity)
      localStorage.setItem("dictStr_cityList", JSON.stringify(dictStr_cityList))
      index++

    });

      
      
    
        
      
      
    
  }
}

func_loadCachedCityList()

$("aside").on("click", "li",()=>{
  index = $( event.target ).closest(".list-group-item").index();
  var str_cityName = $(`#li-city-${index}`).html()
  func_searchCity(str_cityName)

})

$("#btn-search").on("click", ()=>{
    var str_cityName = $("#city-name").val()
    
    // todo if null search value, update search field with warning and don't search
    var bool_validCity = func_searchCity(str_cityName)
    //func_addCityList(str_cityName)
})

