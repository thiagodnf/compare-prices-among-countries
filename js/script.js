var SECOND_IN_MILISECONDS = 1000;
var MINUTE_IN_MILISECONDS = 60 * SECOND_IN_MILISECONDS;
var HOUR_IN_MILISECONDS = 60 * MINUTE_IN_MILISECONDS;
var DAY_IN_MILISECONDS = 24 * HOUR_IN_MILISECONDS;
var MONTH_IN_MILISECONDS = 30 * DAY_IN_MILISECONDS;
var YEAR_IN_MILISECONDS = 12 * MONTH_IN_MILISECONDS;

var data = [];
var entries = [];
var ENTRY_ID = 1;

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function updateURL(countryA, countryB, productA, productB){
    
    if (history.pushState) {
        var url = getURLForSharing(countryA, countryB, productA, productB, 0);
        window.history.pushState({path: url}, '', url);
    }
}

function findCountryByName(name){

    for(var i = 0; i < data.length; i++){
        
        if(data[i].name == name){
            return data[i];
        }
    }

    return;
}

function findCountryByCode(code){

    if(!code){
        return null;
    }

    for (var i = 0; i < data.length; i++){
        
        if (data[i].code == code){
            return data[i];
        }
    }

    return;
}

function convertToURLParameters(countryA, countryB, productA, productB, compare){
    return `?country-a=${countryA}&country-b=${countryB}&product-a=${productA.toFixed(2)}&product-b=${productB.toFixed(2)}&compare=${compare}`
}

function getURLForSharing(countryA, countryB, productA, productB, compare){

    var protocol = window.location.protocol;
    var host = window.location.host;
    var pathname = window.location.pathname;

    var params = convertToURLParameters(countryA, countryB, productA, productB, compare);

    return `${protocol}//${host}${pathname}${params}`;
}

/**
 * Convert string number to float
 * 
 * @param {String} num The number in string
 */
function convertToFloat(number) {

    if (isNaN(number)){
        return;
    }

    var result = parseFloat(number);

    if(isNaN(result)){
        return;
    }

    return result;
}

/**
 * Return the time in a friendly form
 * 
 * @param {number} num The time in miliseconds
 */
function convertTime(num) {

    var years = (num / (YEAR_IN_MILISECONDS));
    var rYears = Math.floor(years);

    num = num - rYears * YEAR_IN_MILISECONDS;

    var months = (num / (MONTH_IN_MILISECONDS));
    var rMonths = Math.floor(months);

    num = num - rMonths * MONTH_IN_MILISECONDS;

    var days = (num / (DAY_IN_MILISECONDS));
    var rDays = Math.floor(days);

    num = num - rDays * DAY_IN_MILISECONDS;

    var hours = (num / (HOUR_IN_MILISECONDS));
    var rHours = Math.floor(hours);

    num = num - rHours * HOUR_IN_MILISECONDS;

    var minutes = (num / (MINUTE_IN_MILISECONDS));
    var rMinutes = Math.floor(minutes);

    num = num - rMinutes * MINUTE_IN_MILISECONDS;

    var seconds = (num / (SECOND_IN_MILISECONDS));
    var rSeconds = Math.floor(seconds);

    num = num - rSeconds * SECOND_IN_MILISECONDS;

    var rMiliseconds = Math.floor(num);

    var labels = ["year(s)", "month(s)", "day(s)", "hour(s)", "minute(s)", "second(s)", "milisecond(s)"];
    var values = [rYears, rMonths, rDays, rHours, rMinutes, rSeconds, rMiliseconds];

    var i = 0;

    while (values[i] == 0){
        if (i == 6){
            break;
        }
        i++;
    }
    
    var text = "";

    if(i == 6){
        text = "oopppa";
    }else{
        for (var j=i;j<6;j++){
            text += values[j] + " "+labels[j]+", ";
        }
    }

    console.log(i);

    

    // text += rYears + " year(s), ";
    // text += rMonths + " month(s), ";
    // text += rDays + " day(s), ";
    // text += rHours + " hour(s), ";
    // text += rMinutes + " minute(s), ";
    // text += rSeconds + " second(s), and ";
    // text += rMiliseconds + " milisecond(s)";
    
    return text;
}

function getResult(country, timeToBuyIt){

    var hours = timeToBuyIt;
    var minutes = hours * 60;
    var seconds = minutes * 60;
    var miliseconds = seconds * 1000;
    
    var time = convertTime(miliseconds);

    return `
        <div class="row">
            <div class="col-12">
                <p><span class="flag-icon mr-2 ${country.flag}"></span>${country.name}</p>
                <p class="text-muted">${time}</p>
            </div>
        </div>
    `;
}

function getProductAFromURL(){
    return (new Url).query["product-a"];
}
function getProductBFromURL(){
    return (new Url).query["product-b"];
}
function getCountryAFromURL(){
    return (new Url).query["country-a"];
}
function getCountryBFromURL(){
    return (new Url).query["country-b"];
}
function getCompareFromURL(){
    return (new Url).query["compare"];
}

function getEntryHTML(country){

    var entryId = ENTRY_ID++;

    return `
        <div class="row entry mt-3" id="entry-${entryId}" data-country-code="${country.code}"> 
            <div class="col-12"> 
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="card-title" ><span class="flag-icon mr-2 ${country.flag}"></span>${country.name}</h5>
                            <button type="button" class="close btn-remove" data-dismiss="modal" data-id="#entry-${entryId}">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group mb-0">
                                    <label for="price-${entryId}">Price</label>
                                    <div class="input-group ">
                                        <div class="input-group-prepend"><span class="input-group-text">${country.currency}</span></div>
                                        <input type="text" class="form-control price" id="price-${entryId}" autofocus autocomplete="off" pattern="[0-9]*" value="0.00">
                                    </div>
                                    <small id="product-a-hep" class="form-text text-muted">${country.currency} ${country.minimumWage} per hour</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

function getEntries(){

    var entries = [];

    $(".entry").each(function(i, entry){

        var countryCode = $(this).data("country-code");
        var price = $(this).find(".price").val();

        if (!price){
            throw new Error(`The price in ${countryCode} should not be empty or null`);
        }

        price = convertToFloat(price.replaceAll(",",""));

        if (price === undefined){
            throw new Error(`The price in ${countryCode} is not a valid number`);
        }
        
        entries.push({
            countryCode: $(this).data("country-code"),
            price: price,
        });
    });

    return entries;
}

function addEntry(html){
    $(".entries").append(html).find(".price").mask('000,000,000,000,000.00', {reverse: true});
}

$(function(){

    new ClipboardJS('.btn-copy-to-clipboard');
    
    // Manage all errors
    window.addEventListener("error", function (e) {
        $.toast({
            title: 'Error',
            content: e.error.message,
            type: 'danger',
            delay: 2000,
        });
        return false;
    })

    $.get( "data/minimum-wage.json", function( result ) {
        
        data = result;

        data.sort(function(a, b) {
            if ( a.name < b.name ){
                return -1;
            }
            if ( a.name > b.name ){
                return 1;
            }
            return 0;
        });
       
        $.each(data, function(i, country){

            $('#countries')
                .append($("<option></option>")
                .attr("value", country.code)
                .attr("data-icon", "flag-icon " + country.flag)
                .text(country.name));
        })

        $('#countries').selectpicker('refresh');

        // The default entries
        addEntry(getEntryHTML(findCountryByCode("BRA")));
        addEntry(getEntryHTML(findCountryByCode("USA")));
    });

    $("#btn-suggestions").click(function(event){
        event.preventDefault();

        $('#modal-suggestions').modal('show');

        return false;
    });

    $("#btn-share").click(function(event){
        event.preventDefault();

        $('#modal-share').modal('show');

        return false;
    });

    $('#modal-share').on('show.bs.modal', function (e) {

        var countryA = getCountryAName();
        var countryB = getCountryBName();

        var priceOfProductA = getPriceOfProductA();
        var priceOfProductB = getPriceOfProductB();

        var newUrl = getURLForSharing(countryA.code, countryB.code, priceOfProductA, priceOfProductB, 1);

        $("#share-url").val(newUrl);
    });
    
    $('#modal-suggestions').on('show.bs.modal', function (e) {

        $.get( "data/suggestions.json", function( data ) {       

            var categories = []; 

            $.each(data, function(i, item){
                
                if(!categories.includes(item.category)){
                    categories.push(item.category);
                }
            }); 

            $("#suggestions-tab").empty();

            $.each(categories, function(i, category){

                var id = `suggestion-${category}`;

                $("#suggestions-tab").append(`<a class="nav-link" data-toggle="pill" href="#${id}">${category}</a>`);

                $("#suggestions-content").append(`<div class="tab-pane fade" id="${id}">
                    <table class="table table-striped table-hover table-sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Country A</th>
                                <th>Country B</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </div>
                `);
            });

            $.each(data, function(i, item){

                var newUrl = getURLForSharing(item["country-a"], item["country-b"], item["product-a"], item["product-b"], 1);

                var countryA = findCountryByCode(item["country-a"]);
                var countryB = findCountryByCode(item["country-b"]);

                var tr = `
                    <tr>
                        <td><a href="${newUrl}">${item.name}</a></td>
                        <td><span class="flag-icon ${countryA.flag}"></span> ${countryA.code}</td>
                        <td><span class="flag-icon ${countryB.flag}"></span> ${countryB.code}</td>
                    </tr>
                `;

                $(`#suggestion-${item.category} table tbody`).append(tr);
            });

            // Always select the first tab as default
            if(categories.length >= 1){
                $(`#suggestions-tab a[href="#suggestion-${categories[0]}"]`).tab('show')
            }
        });
    });

    $("#btn-add-country").click(function(event){
        event.preventDefault();

        var countryCode = $("#countries").val();

        if (!countryCode){
            throw new Error("The country code can not be null or empty");
        }

        var country = findCountryByCode(countryCode);

        if (!country){
            throw new Error("The country code does not exists");
        }

        var entries = getEntries();

        if (entries.filter(e => e.countryCode === countryCode).length > 0) {
            throw new Error("This country has been already added");
        }

        addEntry(getEntryHTML(country));
        
        return false;
    });

    $(document).on('click', ".btn-remove", function (e) {
        event.preventDefault();

        var entryId = $(this).data("id");

        $(entryId).remove();

        return false;
    });

    $("#btn-compare").click(function(event){
        event.preventDefault();

        var entries = getEntries();

        if (entries.length == 0){
            throw new Error("There are no countries");
        }

        $(".results").empty().append(`<h3 class="mb-3">Results</h3>`);

        $.each(entries, function(i, entry){

            var country = findCountryByCode(entry.countryCode);

            var timeToBuyIt = entry.price/country.minimumWage;

            var result = getResult(country, timeToBuyIt);

            $(".results").append(result);
        })
    
        $('html, body').animate({
            scrollTop: $(".results").offset().top
        }, 1000);
      
        return false;
    });
   
})