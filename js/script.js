var HOURS_OF_WORK = 8;
var DAYS_OF_WORK = 22;

var data = [];
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

function convertToURLParameters(entries, compare){

    var countries = "countries=";
    var prices = "prices=";

    $.each(entries, function(i, entry){

        countries += entry.countryCode;
        prices += entry.price.toFixed(2);

        if(i+1 != entries.length){
            countries += ",";
            prices += ",";
        }
    });

    return `?${countries}&${prices}&compare=${compare}`;
}

function getURLForSharing(entries, compare){

    var protocol = window.location.protocol;
    var host = window.location.host;
    var pathname = window.location.pathname;

    var params = convertToURLParameters(entries, compare);

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

    var SECOND_IN_MILISECONDS = 1000;
    var MINUTE_IN_MILISECONDS = 60 * SECOND_IN_MILISECONDS;
    var HOUR_IN_MILISECONDS = 60 * MINUTE_IN_MILISECONDS;
    var DAY_IN_MILISECONDS = HOURS_OF_WORK * HOUR_IN_MILISECONDS;
    var MONTH_IN_MILISECONDS = DAYS_OF_WORK * DAY_IN_MILISECONDS;
    var YEAR_IN_MILISECONDS = 12 * MONTH_IN_MILISECONDS;
    var CENTURY_IN_MILISECONDS = 100 * YEAR_IN_MILISECONDS;

    var centuries = (num / (CENTURY_IN_MILISECONDS));
    var rCenturies = Math.floor(centuries);

    num = num - rCenturies * CENTURY_IN_MILISECONDS;

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

    var labels = ["century(ies)", "year(s)", "month(s)", "day(s)", "hour(s)", "minute(s)", "second(s)", "milisecond(s)"];
    var values = [rCenturies, rYears, rMonths, rDays, rHours, rMinutes, rSeconds, rMiliseconds];

    var i = 0;

    while (values[i] == 0){
        if (i == (labels.length - 1)){
            break;
        }
        i++;
    }
    
    var text = "";

    if (i == (labels.length - 1)){
        i = 0;
    }

    for (var j = i; j < (labels.length - 1); j++){
        
        text += values[j] + " " + labels[j];
        
        if (j + 1 != (labels.length - 1)){
            text += ", ";
        }
    }

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

function getEntryHTML(country, price = 0.0){

    if (!country){
        return "";
    }

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
                                        <input type="text" class="form-control price" id="price-${entryId}" autofocus autocomplete="off" pattern="[0-9]*" value="${price.toFixed(2)}">
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

function compare(){
    
    var entries = getEntries();

    if (entries.length == 0){
        throw new Error("There are no countries");
    }

    $(".results").empty();

    $.each(entries, function(i, entry){

        var country = findCountryByCode(entry.countryCode);

        var timeToBuyIt = entry.price/country.minimumWage;

        var result = getResult(country, timeToBuyIt);

        $(".results").append(result);
    })

    $('html, body').animate({
        scrollTop: $(".results").offset().top
    }, 1000);
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

        var url = new Url;

        var countries = ["BRA", "USA"];
        var prices = ["0.00", "0.00"];
       
        if (url.query.countries){
            countries = url.query.countries.split(",");
        }
        if (url.query.prices){
            prices = url.query.prices.split(",");
        }
        
        while(countries.length > prices.length){
            prices.push("0.00");
        }

        for (var i = 0; i < countries.length; i++){

            var country = countries[i];
            var price = prices[i];
            
            addEntry(getEntryHTML(findCountryByCode(country), convertToFloat(price) ));
        }

        if (url.query.compare && url.query.compare === "1"){
            compare();
        }
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

    $("#form-settings").submit(function(event){
        event.preventDefault();

        var hoursOfWork = $(this).find("#hours-of-work").val();
        var daysOfWork = $(this).find("#days-of-work").val();

        hoursOfWork = convertToFloat(hoursOfWork);
        daysOfWork = convertToFloat(daysOfWork);
       
        if (hoursOfWork === undefined){
            throw new Error(`The hours of work is not a valid number`);
        }
        if (daysOfWork === undefined){
            throw new Error(`The days of work is not a valid number`);
        }

        HOURS_OF_WORK = hoursOfWork;
        DAYS_OF_WORK = daysOfWork; 

        $('#modal-settings').modal('hide');

        compare();

        return false;
    });

    

    $("#btn-settings").click(function(event){
        event.preventDefault();

        $('#modal-settings').modal('show');

        return false;
    });

    $('#modal-settings').on('show.bs.modal', function (e) {

       $("#hours-of-work").val(HOURS_OF_WORK);
       $("#days-of-work").val(DAYS_OF_WORK);
    });

    $('#modal-share').on('show.bs.modal', function (e) {

        var entries = getEntries();

        if (entries.length == 0){
            throw new Error("There are no countries");
        }

        var newUrl = getURLForSharing(entries, 1);

        $("#share-url").val(newUrl);
    });
    
    $('#modal-suggestions').on('show.bs.modal', function (e) {

        $.get( "data/suggestions.json", function( data ) {       

            $(".list-group").empty();

            $.each(data, function(i, item){

                var url = getURLForSharing(item.entries, 1);

                $(".list-group").append(`<li class="list-group-item"><a href="${url}">${item.name}</a></li>`)
            }); 
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

        compare();
      
        return false;
    });
   
})