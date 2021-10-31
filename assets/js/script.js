var bool_dbg =false
var dictStr_cityList = {} //global variable used wit hloal storage

// global variables holding Boostrapp CSS strings
var str_liCityCSS = "li-city list-group-item bg-gray"
// global variables where we addded dynamic content onto the page
var div_cityBoard = $(".city-board")
var div_weatherBoard = $(".weather-forecast-board")
var obj_5DayForecast = {}
var int_lat =0
var int_lon = 0
var apiUrl = ''
var str_weatherUnit = "imperial"

// load the api key from the config file
var apiKey = passApiKey;

// used to reset the form, and clear out the input field
// it does nothing on purpose
var func_resetForm = ()=>{}

// Updated the city board with the current weather data
var func_updateCityBoard = (argsStr_cityName, args_data)=>{

  // helper function used to create an li with consistant CSS styling
  function createLi(args_str){
    var li = $("<li>").addClass("li-weather-card-item list-unstyled w-100 ")
    return li.html(args_str)
  }
    // get todays date, and format it like 01/10/21
    var today = moment().format("M/D/Y")

    // create a Header that will hold the City name and an image of the 
    // current weather
    var h1_cityName = $("<h1>").addClass("h1-city-name")
    h1_cityName.attr('id', 'h1-city-name')
    h1_cityName.html(`${argsStr_cityName}(${today})`)
    
    var float_windSpeed = args_data.current.wind_speed
    
    
    var float_temp = "Temp: "+ args_data.current.temp + "&#8457;"
    // get the wind speed MPH
    var str_wind = "Wind: " + float_windSpeed+" MPH"
    // get the wind type, i.e snow, rain, clear, cloudy, etc
    var str_wind2 = args_data.current.weather[0].main
    // get an image that represents the wind type
    var str_imgUrl = `http://openweathermap.org/img/wn/${func_getWindUrl(str_wind2)}d@2x.png`;
    var int_humidity = "Humidity: "+ args_data.current.humidity

    var int_uvi = args_data.current.uvi
    // color code the UVI data based on how extreme/damiging the sun is
    var str_uviCss = "bg-light"
    if(int_uvi <= 2) // Less than two is best
      str_uviCss = "bg-success"
    else if(int_uvi <=5)
      str_uviCss = "bg-warning"
    else if(int_uvi <=7)
      str_uviCss = "bg-orange"
    else if(int_uvi <=10)
      str_uviCss = "bg-danger"
    else // purple is the worst
      str_uviCss ="bg-purple"
    // bundle up the UVI index with the correct CSS color coding
    var uvi = `UVI: <span class=\"uvi-index ${str_uviCss}\">`+ int_uvi+ "</span>"
    // create a UL to hold all the data
    var ul = $("<ul>").addClass("w-100 ")
    
    // create an image of the current wind type
    var img = $("<img>").addClass("img-cityboard")
    img.attr('src', str_imgUrl)
    //place the image in a span so it can sit on the same line as the Header
    var span_imageContainer = $("<span>").addClass("img-city-board")
    span_imageContainer.append(img)
    // add the Image to the right of the city name
    h1_cityName.append(span_imageContainer)
    // add a dark border to the main City Board and some dynamic padding
    div_cityBoard.addClass("border border-dark rounded p-3")
    // add the City name and Image header to the board
    div_cityBoard.append(h1_cityName)

    // append the rest of the data to the UL
    ul.append(createLi(float_temp))
    ul.append(createLi(str_wind))
    ul.append(createLi(int_humidity))
    ul.append(createLi(uvi))
    // add the UL with all the data to the board
    div_cityBoard.append(ul)
    
   
  }
var func_getWindUrl = (argsStr_wind)=>{
  // a helper function that takes a string representatio of the wind type
  // then returns the string/int value of the wind type
  // this value is used for "indexing" the correct image we grab from the weather api
  // to dynamically grab an image.
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
  else{ // else return a cloud image to warn the user to bring an umbrella
    Str_return = "04"
  }

  return Str_return


}

var func_updateWeatherBoard = (argStr_cityName, args_Obj5Day)=>{
    //  A helper function that takes data froman api,
    // and will update the 5 day weatherboard with data.
    
    // remove any data already on the page
    div_weatherBoard.children().remove()
  
    
    var str_date = args_Obj5Day
    //helper function to create all li with same css
    function createLi(args_str){
      var li = $("<li>").addClass("li-weather-card-item list-unstyled w-100 p-0")
      return li.html(args_str)
    }

    // create a container to hold all our weather cards
    // so that we can use Boot Strap to dynamiccally place cards in a
    // row as the page shrinks/grows/\.
    var div_container = $("<div>").addClass("container")
    var div_row = $("<div>").addClass("row")
    // append a title for the section to the container
    div_container.append("<h3>5-Day Forecast: </h3>")
    
    // loop over the data, from the api 
    for(key in args_Obj5Day){
      // create one weather card for one day
      var div_weatherCard = $("<div>").addClass("card col")

      // grab the data from the api parameter, and bundle it up
      var str_date = key;
      var float_temp = "Temp: "+ args_Obj5Day[key]["main"]["temp"] + "&#8457;"

      var float_windSpeed = args_Obj5Day[key].wind.speed
      
      var str_wind = "Wind: " + float_windSpeed+" MPH"
      
      var str_wind2 = args_Obj5Day[key]["weather"][0]["main"]
      // call our helper function that converts a string representation of wind type
      // to an string/int representation i.e "Rain" -> "04"
      // use the string value of the link to load the correct image
      var str_imgUrl = `http://openweathermap.org/img/wn/${func_getWindUrl(str_wind2)}d@2x.png`;
      var int_humidity = "Humidity: "+ args_Obj5Day[key]["main"]["humidity"]
      
      // create a ul to hold all the data
      var ul = $("<ul>").addClass("w-100 ")
      //add the ith date out of the 5 day forecast
      ul.append(createLi(str_date))
      // add the image of the wind type
      var li_image = createLi("")
      var img = $("<img>").addClass("img-weatherboard")
      img.attr('src', str_imgUrl)
      li_image.append(img)
      ul.append(li_image)
      // add the rest of the data
      ul.append(createLi(float_temp))
      ul.append(createLi(str_wind))
      ul.append(createLi(int_humidity))
      // add the ul holding the data to the weather card div
      div_weatherCard.append(ul)
      // add the weather card to the row of 5days worth of cards
      div_row.append(div_weatherCard)
      div_container.append(div_row)
      
    }
    // add all the data to index.html dynamically
    div_weatherBoard.append(div_container)
    
    

   
}


var func_getCurrentWeather = (args_lat, args_lon, argsStr_cityName)=>{
  // a function to query an api to get todays weather
  //apiUrl=`https://api.openweathermap.org/data/2.5/weather?q=${argStr_cityName}&appid=${apiKey}`
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?units=${str_weatherUnit}&lat=${args_lat}&lon=${args_lon}&appid=${apiKey}`
  fetch(apiUrl) //make api call
  .then(function(response) {
    // 1st then waits to see if there is a valid response

    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        // ToDo code
        // if we sucesfully pull data, then update the page with the data returned
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
  //add the city to the search history and local storage
  // if we ahve enver searcched for the city before
  
  // get the current cacched city list
  dictStr_cityList = JSON.parse(localStorage.getItem("dictStr_cityList"))
  // if the city list is empty, make the list a an empty dictionary instead 
  // of an null  value that will throw an error
  if(dictStr_cityList === null)
    dictStr_cityList = {}
  // if the given city is not already in pur list, then add it to our list
  // and then get the weather
  if(dictStr_cityList[argStr_cityName] === undefined){
  // get the last index value of our list, so we can add one more city to the list
  var index = Object.keys(dictStr_cityList).length
  //add the new city to the citionary list
  dictStr_cityList[argStr_cityName] =argStr_cityName;
  // get the current list of citys on the page
  var ul_cityList = $("#city-list").addClass("list-group")
  // create one new li, to add to the search history list
  var li_aCity = $("<li>").addClass(str_liCityCSS)
  // create the li with a unique ID, or the ith city in the list
  li_aCity.attr('id', `li-city-${index}`)
  li_aCity.html(argStr_cityName)
  ul_cityList.append(li_aCity)
  // update the cached list in local storage
  localStorage.setItem("dictStr_cityList", JSON.stringify(dictStr_cityList))

  
  }
  
}

var func_searchCity = (argStr_cityName)=>{
  // check if the city inputed is valid and qury the api for weather data.
  
  // clear the city board of old data for a new city
  div_cityBoard.children().remove() 
  
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?units=${str_weatherUnit}&q=${argStr_cityName}&appid=${apiKey}`
  
  if(argStr_cityName === ""){
    return alert('Error: city not found');
  }
  
  fetch(apiUrl) //make api call
  .then(function(response) {
    // 1st then waits to see if there is a valid response

    // request was successful
    if (response.ok && argStr_cityName != "") {
      response.json().then(function(data) {
        // if the given city is a real city, add the city name to 
        // the search history list
        func_addCityList(data.city.name)
        // a temporary array used to reformat the data from the api
        // and simply the data to only grab what is needed
        var obj_temp = data.list
        // get the latitude and longitude of the city 
        // used to make another api call
        int_lat = data.city.coord.lat
        int_lon = data.city.coord.lon
        // make another api call to get the current weather
        func_getCurrentWeather(int_lat,int_lon, data.city.name)
        // loop over the 5 day forecast of data, and onyl grab the data that is needed.
        obj_temp.forEach(element => {
        //get the ith date
        var str_date =  moment(element.dt_txt).format("M/D/Y")
        // get the ith weather forecast, add it to a dicctionary
        // so that we can then call a helper function to
        // parse the data and ad it to the page
        obj_5DayForecast[str_date] = element
        
          
        });
        // call helper function to add data to the page
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
  // when the webpage is first loaded, we will update any cached data onto the pagge

  dictStr_cityList = JSON.parse(localStorage.getItem("dictStr_cityList"))
  var ul_cityList = $("#city-list").addClass("list-group")
  var index = 0;
  
  var index = 0
  // if there is data cached in local storage
  // then we can update the page
  if(dictStr_cityList != null){
    
    var keysArr = Object.keys(dictStr_cityList)
    keysArr.forEach((element, key) => {
      
      // add the city to the search history list on index.html
      var li_aCity = $("<li>").addClass(str_liCityCSS)
      li_aCity.attr('id', `li-city-${index}`)
      li_aCity.html(element)
      ul_cityList.append(li_aCity)
      // refresh the local storage, because this function is also used at the end of a search
      // to update the list with new data.
      localStorage.setItem("dictStr_cityList", JSON.stringify(dictStr_cityList))
      index++

    });
  
    
  }
}

// when the page loads, load any cached data
func_loadCachedCityList()

// add event listeners to the search history list
$("aside").on("click", "li",()=>{
  index = $( event.target ).closest(".list-group-item").index();
  var str_cityName = $(`#li-city-${index}`).html()
  func_searchCity(str_cityName)

})

//add the event listener to our form
$("#btn-search").on("click", ()=>{
    
    var str_cityName = $("#city-name").val()
    
    // todo if null search value, update search field with warning and don't search
    var bool_validCity = func_searchCity(str_cityName)
    
})
