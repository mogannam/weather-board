<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
    <header class="jumbotron">
        <h1 class="display-3 text-center">Weather Dashboard</h1>
      </header>

    <div class="container h-100 " id="body-container">
        <div class="row">
            <aside class="left-search-menu col-3 w-100" > 
                
            <form action="javascript:func_resetForm()"> 
            <label class="w-100 "><h4>Search for a City: </h4></label>
            <input type="text" class="search city-name w-100" id="city-name" aria-describedby="emailHelp" placeholder="Enter city">
            <button type="reset" class="btn-search btn btn-primary w-100" id="btn-search">Submit</button>
            </form> 

            <hr>
            <ul class="city-list" id="city-list">

            </ul>
            
            </aside>
            
            <div class="col-9 " >
                <div class="city-board" ></div>
                <div class="weather-forecast-board"> </div>
            
            </div>
        </div>
        
    </div>
    
    
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"></script>
    <script type="text/javascript" src="assets/js/config.js"></script>
    <script type="text/javascript" src="https://github.com/mogannam/api/blob/main/config.js"></script>
    <script src="assets/js/script.js"></script> 
    

   

     
</body>
<footer>

</footer>
</html>

