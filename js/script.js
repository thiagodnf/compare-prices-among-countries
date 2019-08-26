var SECOND_IN_MILISECONDS = 1000;
var MINUTE_IN_MILISECONDS = 60 * SECOND_IN_MILISECONDS;
var HOUR_IN_MILISECONDS = 60 * MINUTE_IN_MILISECONDS;
var DAY_IN_MILISECONDS = 24 * HOUR_IN_MILISECONDS;
var MONTH_IN_MILISECONDS = 30 * DAY_IN_MILISECONDS;
var YEAR_IN_MILISECONDS = 12 * MONTH_IN_MILISECONDS;

var data = [];

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function updateURL(countryA, countryB, productA, productB){
    
    if (history.pushState) {

        var protocol = window.location.protocol;
        var host = window.location.host;
        var pathname = window.location.pathname;

        var params = `country-a=${countryA}&country-b=${countryB}&product-a=${productA}&product-b=${productB}`

        var newUrl = `${protocol}//${host}${pathname}?${params}`;
        
        window.history.pushState({path: newUrl}, '', newUrl);
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

    for(var i = 0; i < data.length; i++){
        
        if(data[i].code == code){
            return data[i];
        }
    }

    return;
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

    var text = "";

    text += rYears + " year(s)<br/>";
    text += rMonths + " month(s)<br/>";
    text += rDays + " day(s)<br/>";
    text += rHours + " hour(s)<br/>";
    text += rMinutes + " minute(s)<br/>";
    text += rSeconds + " second(s)<br/>";
    text += rMiliseconds + " milisecond(s)";
    
    return text;
}

function getHelpText(country){
    return `${country.currencyCode} ${country.minimumWage} per hour`;
}

function getResult(country, price){

    var hourA = price;
    var minutesA = hourA * 60;
    var secondsA = minutesA * 60;
    var miliseconds = secondsA * 1000;
    
    var time = convertTime(miliseconds);

    return `A person in ${country.name} needs <br/><b> ${time} </b><br/>to buy this product`;
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

function getDefaultProductA(){
    return convertToFloat(getProductAFromURL()) || 0.0;;
}
function getDefaultProductB(){
    return convertToFloat(getProductBFromURL()) || 0.0;;
}
function getDefaultCountryA(){
    return findCountryByCode(getCountryAFromURL()) || findCountryByName("Brazil");
}
function getDefaultCountryB(){
    return findCountryByCode(getCountryBFromURL()) || findCountryByName("United States of America");
}

$(function(){

    $('.money').mask('000,000,000,000,000.00', {reverse: true});

    $("#country-a").selectpicker();
    $("#country-b").selectpicker({dropdownAlignRight: true});
    
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

            $('.countries')
                .append($("<option></option>")
                .attr("value", country.name)
                .attr("data-icon", "flag-icon " + country.flag)
                .text(country.name));
            
        })

        $('.countries').selectpicker('refresh');

        // The default values
        $('#country-a').selectpicker('val', getDefaultCountryA().name);
        $('#country-b').selectpicker('val', getDefaultCountryB().name);

        $('#product-a').val($('#product-a').masked(getDefaultProductA()));
        $('#product-b').val($('#product-b').masked(getDefaultProductB()));

        $("#product-a").focus();
        $("#product-a").select();
    });

    $(".countries").on("changed.bs.select", function(event, clickedIndex, newValue, oldValue) {
        event.preventDefault();

        var id = $(this).attr("id");

        var country = findCountryByName(this.value);

        $(`#${id}-help`).text(getHelpText(country));
        
        if(id == "country-a"){
            $("#product-a-currency-code").text(country.currencyCode);
            $("#product-a-help").text(`Type the price in ${country.name}`);
        }else if(id == "country-b"){
            $("#product-b-currency-code").text(country.currencyCode);
            $("#product-b-help").text(`Type the price in ${country.name}`);
        }

        return false;
    });

    $("#btn-compare").click(function(event){
        event.preventDefault();

        var countryAName= $("#country-a").val();
        var countryBName = $("#country-b").val();

        var countryA = findCountryByName(countryAName);
        var countryB = findCountryByName(countryBName);

        var productA = $("#product-a").val();
        var productB = $("#product-b").val();

        if(!productA){
            alert("The price of Product A is required");
            $("#product-a").select();
            return;
        }
        if(!productB){
            alert("The price of Product B is required");
            $("#product-b").select();
            return;
        }

        productA = productA.replaceAll(",","");
        productB = productB.replaceAll(",","");

        productA = convertToFloat(productA);
        productB = convertToFloat(productB);

        var priceA = productA/countryA.minimumWage;
        var priceB = productB/countryB.minimumWage;

        $("#country-a-result").html(getResult(countryA, priceA));
        $("#country-b-result").html(getResult(countryB, priceB));

        updateURL(countryA.code, countryB.code, productA, productB);
        
        $('html, body').animate({
            scrollTop: $(".result").offset().top
        }, 1000);

        return false;
    });
})