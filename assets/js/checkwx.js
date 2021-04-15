$(function () {

    var urlParams = new URLSearchParams(window.location.search);
    var icao = 'EIDW';
    if (urlParams.has('icao') && urlParams.get('icao').length) {
        icao = urlParams.get('icao');
    }

    $('icao').val(icao);
    /*----------------------------- METAR DATA -----------------------------------*/
    $.ajax({
        type: 'GET',
        url: 'https://api.checkwx.com/metar/' + icao + '/decoded',
        headers: {
            'X-API-Key': '4a6fff29393d4f7080abbdfae4'
        },
        dataType: 'json',

        error: function (response) {
            var e = response.responseJSON;
            $('#icao').text(e.StatusCode);
            $('#name').text(e.error);
            $('#raw').text(e.message);
        },

        success: function (response) {
            if (response.results > 0) {
                var metar = response.data[0];

                $('#icao').text(metar.icao);
                $('#name').text(metar.station.name);

                if (metar.visibility) {
                    $('#visibility_meters').text(metar.visibility.meters_float);
                }

                if (metar.wind) {
                    $('#wind_direction').text(metar.wind.degrees.toString().padStart(3, '0'));
                    $('#wind_speed').text(metar.wind.speed_kts);
                }

                if (metar.clouds[0]) {
                    metar.clouds.forEach(cloud => {
                        if (cloud.code === 'CAVOK') {
                            $("#cloud_list").append('Cloud and visibility are OK');
                        } else {
                            $("#cloud_list").append('<li>' + cloud.text + ' clouds at ' + cloud.base_feet_agl + "' AGL ");
                        }
                    });
                    $('#cloud_block').removeClass('d-none');
                }

                if (metar.barometer) {
                    $('#pressure').text(metar.barometer.hpa);
                    $('#barometer_block').removeClass('d-none');
                }

                if (metar.temperature) {
                    $('#temperature_c').text(metar.temperature.celsius);
                    $('#temperature_block').removeClass('d-none');
                }

                if (metar.dewpoint) {
                    $('#dewpoint_c').text(metar.dewpoint.celsius);
                    $('#dewpoint_block').removeClass('d-none');
                }

                if (metar.humidity) {
                    $('#humidity').text(metar.humidity.percent);
                    $('#humidity_block').removeClass('d-none');
                }

            } else {
                $('#icao').text('No results for this search.. Check your ICAO code');
            }
            $('results_block').removeClass('d-none');
        }
    });
    /*----------------------------- TAF DATA -----------------------------------*/
    $.ajax({
        type: 'GET',
        url: 'https://api.checkwx.com/taf/' + icao + '/decoded',
        headers: {
            'X-API-Key': '4a6fff29393d4f7080abbdfae4'
        },
        dataType: 'json',

        error: function (response) {
            var e = response.responseJSON;
            $('#icao').text(e.StatusCode);
            $('#name').text(e.error);
            $('#raw').text(e.message);
        },

        success: function (response) {
            if (response.results > 0) {
                var taf = response.data[0];

                if (taf.forecast) {
                    var forecast1 = taf.forecast[0];
                    $('#timestamp_1').html('Forecast from ' + forecast1.timestamp.from + ' to ' + forecast1.timestamp.to);
                    var forecast2 = taf.forecast[1];
                    $('#timestamp_2').html(forecast2.change.indicator.text + ' from ' + forecast2.timestamp.from + ' to ' + forecast2.timestamp.to);
                    var forecast3 = taf.forecast[2];
                    $('#timestamp_3').html(forecast3.change.indicator.text + ' from ' + forecast3.timestamp.from + ' to ' + forecast3.timestamp.to);
                    var forecast4 = taf.forecast[3];
                    $('#timestamp_4').html(forecast4.change.indicator.text + ' from ' + forecast4.timestamp.from + ' to ' + forecast4.timestamp.to);
                    var forecast5 = taf.forecast[4];
                    $('#timestamp_5').html(forecast5.change.indicator.text + ' from ' + forecast5.timestamp.from + ' to ' + forecast5.timestamp.to);
                }
                //taf.forecast.forEach(forecast => {
                //    $('#timestamp_1').append('Forecast from' + forecast.timestamp.from + 'to' + forecast.timestamp.to);
                //})
                //}
                //if (taf.forecast[0]) {
                //    $('#timestamp_1').text(forecast.timestamp.from);
                //}

            }
        }
    });
});