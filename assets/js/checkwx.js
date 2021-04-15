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

                if (taf.forecast) {
                    //----------------------------------------------------- First TAF FORECAST -----------------------------------------------------
                    var result1 = taf.forecast[0];

                    if (result1.wind) {
                        // add in if less than 5 kts it is variable
                        $('#wind_direction_1').text(result1.wind.degrees);
                        $('#wind_speed_1').text(result1.wind.speed_kts);
                    }
                    if (result1.visibility) {
                        $('#visibility_1').text(result1.visibility.meters_float);
                    }
                    if (result1.clouds[0]) {
                        result1.clouds.forEach(cloud => {
                            if (cloud.code === 'NSC') {
                                $('#cloud_list_1').append(cloud.text);
                            } else {
                                $('#cloud_list_1').append(cloud.text + cloud.base_feet_agl);
                            }
                        });
                    }
                    if (result1.conditions[0]) {
                        $('#cond_block_1').removeClass('d-none');
                        result1.conditions.forEach(cond => {
                            $('#cond_list_1').append(cond.text);
                        })
                    }
                    //----------------------------------------------------- Second TAF FORECAST -----------------------------------------------------
                    var result2 = taf.forecast[1];

                    if (result2.wind) {
                        // add in if less than 5 kts it is variable
                        $('#wind_direction_2').text(result2.wind.degrees);
                        $('#wind_speed_2').text(result2.wind.speed_kts);
                    }
                    if (result2.visibility) {
                        $('#visibility_2').text(result2.visibility.meters_float);
                    }
                    if (result2.clouds[1]) {
                        result2.clouds.forEach(cloud => {
                            if (cloud.code === 'NSC') {
                                $('#cloud_list_2').append(cloud.text);
                            } else {
                                $('#cloud_list_2').append(cloud.text + cloud.base_feet_agl);
                            }
                        });
                    }
                    if (result2.conditions[1]) {
                        $('#cond_block_2').removeClass('d-none');
                        result2.conditions.forEach(cond => {
                            $('#cond_list_2').append(cond.text);
                        })
                    }


                }


                //$('#taf_1').html(forecast1.wind.degrees + ' at ' + weather1.wind.speed_kts + '.' + ' Visibility ' + weather1.visibility.meters_float);

            }
        }
    });
});