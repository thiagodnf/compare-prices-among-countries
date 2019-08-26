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

    for(var i = 0; i < data.length; i++){
        
        if(data[i].code == code){
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
function getCompareFromURL(){
    return (new Url).query["compare"];
}

function getDefaultCompare(){
    return convertToFloat(getCompareFromURL()) || 0;
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

function compare(){
   
    var countryA = getCountryAName();
    var countryB = getCountryBName();

    var priceOfProductA = getPriceOfProductA();
    var priceOfProductB = getPriceOfProductB();

    var timeToBuyA = priceOfProductA/countryA.minimumWage;
    var timeToBuyB = priceOfProductB/countryB.minimumWage;

    $("#country-a-result").html(getResult(countryA, timeToBuyA));
    $("#country-b-result").html(getResult(countryB, timeToBuyB));

    updateURL(countryA.code, countryB.code, priceOfProductA, priceOfProductB);
    
    $('html, body').animate({
        scrollTop: $(".result").offset().top
    }, 1000);
}

function getPriceOfProductA(){

    var productA = $("#product-a").val();

    if(!productA){
        throw new Error("The price of Product A is required");
    }

    productA = productA.replaceAll(",","");

    return convertToFloat(productA);
}

function getPriceOfProductB(){

    var productB = $("#product-b").val();

    if(!productB){
        throw new Error("The price of Product B is required");
    }

    productB = productB.replaceAll(",","");

    return convertToFloat(productB);
}

function getCountryAName(){

    var countryName = $("#country-a").val();

    if(!countryName){
        throw new Error("The country name is required");
    }

    return findCountryByName(countryName);
}

function getCountryBName(){

    var countryName = $("#country-b").val();

    if(!countryName){
        throw new Error("The country name is required");
    }

    return findCountryByName(countryName);
}

$(function(){

    $('.money').mask('000,000,000,000,000.00', {reverse: true});

    $('[data-toggle="popover"]').popover()

    $("#country-a").selectpicker();
    $("#country-b").selectpicker({dropdownAlignRight: true});

    new ClipboardJS('.btn-copy-to-clipboard');
    
    window.addEventListener("error", function (e) {
        alert(e.error.message);
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

        $('#product-a').val($('#product-a').masked(getDefaultProductA().toFixed(2)));
        $('#product-b').val($('#product-b').masked(getDefaultProductB().toFixed(2)));

        $("#product-a").focus();
        $("#product-a").select();

        if(getDefaultCompare() == 1){
            compare();
        }
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

        compare();

        return false;
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
   
})