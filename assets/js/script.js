var bool_dbg =true
var dictStr_cityList = {}
var str_liCityCSS = "li-city"
var div_cityBoard = $(".city-board")

var apiKey = passApiKey;

var func_updatePage = (args_apiData)=>{
    //todo temp, wind, humidity, UV Index

    var h1_cityName = $("<h1>").addClass("h1-city-name")
    h1_cityName.attr('id', 'h1-city-name')
    h1_cityName.html(args_apiData.city["name"])
    div_cityBoard.append(h1_cityName)
}


var func_searchCity = (argStr_cityName)=>{
  
  // clear the board for a new city
  div_cityBoard.children().remove() 
  
  
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${argStr_cityName}&appid=${apiKey}`
  if(bool_dbg) console.log(apiUrl)
  var apiData = fetch(apiUrl) //make api call
  .then(function(response) {
    // 1st then waits to see if there is a valid response

    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        console.log(data);
        func_updatePage(data)
      });
    } else {
      alert('Error: city not found');
    }
  })
  .catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method
    alert("Unable to connect to api");
  });


  



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

    console.log(dictStr_cityList)
    }
    
    // else city is on the list, so just search for it.
    //search city
    func_searchCity(argStr_cityName)
    


}

$("#btn-search").on("click", ()=>{
    var str_cityName = $("#city-name").val()
    if(bool_dbg)console.log(`city ${str_cityName}`)
    // todo if null search value, update search field with warning and don't search
    func_addCityList(str_cityName)
})