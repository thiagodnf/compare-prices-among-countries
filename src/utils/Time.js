
class Time {

    static convertFromMilisecondsToDays(timeInMiliseconds, hoursOfWork) {

        var SECOND_IN_MILISECONDS = 1000;
        var MINUTE_IN_MILISECONDS = 60 * SECOND_IN_MILISECONDS;
        var HOUR_IN_MILISECONDS = 60 * MINUTE_IN_MILISECONDS;
        var DAY_IN_MILISECONDS = hoursOfWork * HOUR_IN_MILISECONDS;

        var rest = timeInMiliseconds / DAY_IN_MILISECONDS;

        return rest;
    }

    static calculateTimes(url, countries){

        var produceName = url.productName;

        var times = [];

        var hoursOfWork = 8;

        for (var i in url) {

            if (i === "productName") {
                continue;
            }

            var country = countries.filter(el => el.code === i)[0];
            var price = parseFloat(url[i]);
            var minimumWage = country.minimumWage;

            if (country.payPeriod === "month") {
                minimumWage = ((minimumWage / 21) / 8)
            }

            var timeToBuyIt = price/minimumWage;

            var hours = timeToBuyIt;
            var minutes = hours * 60;
            var seconds = minutes * 60;
            var miliseconds = seconds * 1000;

            times.push({
                price: parseFloat(url[i]),
                timeInMiliseconds: miliseconds,
                timeInDays: Time.convertFromMilisecondsToDays(miliseconds, hoursOfWork),
                country:  country,
            });
        }

        times.sort((a, b) => {
            if (a.timeInDays > b.timeInDays) {
                return -1;
            }
            if (b.timeInDays > a.timeInDays) {
                return 1;
            }
            return 0;
        });

        return {
            productName: produceName,
            times: times,
            maxDays: times[0].timeInDays
        }
    }
}

export default Time;
