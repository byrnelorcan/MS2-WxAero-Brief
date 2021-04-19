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
                $('#results_block').removeClass('d-none');
                $('#icao_code').html(metar.icao + ', ');
                $('#name').text(metar.station.name);
                $('#metar_raw').text(metar.raw_text);
                $('#metar_email').text(metar.raw_text);

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
                            $("#cloud_list").append('<li>' + ' Ceiling and visibility are ok' + '</li>');
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

                if (metar.flight_category) {
                    if (metar.flight_category === 'VFR') {
                        $('#flight_category').addClass('vfr_label').text('VFR');
                    } else if (metar.flight_category === 'IFR') {
                        $('#flight_category').addClass('ifr_label').text('IFR');
                    } else if (metar.flight_category === 'MVFR') {
                        $('#flight_category').addClass('mvfr_label').text('MVFR');
                    } else if (metar.flight_category === 'LIFR') {
                        $('#flight_category').addClass('lifr_label').text('LIFR');
                    } else if (metar.flight_category === 'UNK') {
                        $('#flight_category').addClass('unk_label').text('Unknown');
                    }
                }

                if (metar.conditions[0]) {
                    $('#cond_block').removeClass('d-none');
                    metar.conditions.forEach(condition => {
                        $('#cond_list').append('<li>' + condition.text + '</li>');
                    });
                }



            } else {
                $('#icao_code').text('No results for this search.. Check your ICAO code');
            }

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
                $('#taf_label').addClass('taf-active').text('ACTIVE');
                var taf = response.data[0];
                $('#results_block').removeClass('d-none');
                var bulletin_info = taf.timestamp.bulletin;
                var date = new Date(bulletin_info);
                var from_timestamp = taf.timestamp.from;
                var from = new Date(from_timestamp);
                var to_timestamp = taf.timestamp.to;
                var end = new Date(to_timestamp);
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
                $('#taf_bulletin').html('Bulletin issued on ' + date.toUTCString());
                $('#taf_raw').text(taf.raw_text);
                $('#taf_print').text(taf.raw_text);
                $('#taf_email').text(taf.raw_text);
                $('#taf_info').html('Report issued for ' + taf.icao + ' at ' + taf.station.name);
                $('#taf_timestamp').html('Forecast active from ' + from.toUTCString() + ' to ' + end.toUTCString());

            } else {
                $('#taf_label').addClass('taf-inactive').text('INACTIVE');
            }
        }
    });
    /*----------------------------- STATION DATA -----------------------------------*/
    $.ajax({
        type: 'GET',
        url: 'https://api.checkwx.com/station/' + icao + '/suntimes',
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
                var station = response.data[0];
                $('#results_block').removeClass('d-none');
                $('#sunrise').text(station.sunrise_sunset.utc.sun_rise)
                $('#sunset').text(station.sunrise_sunset.utc.sun_set)
            }
        }

    });

    $.ajax({
        type: 'GET',
        url: 'https://api.checkwx.com/station/' + icao + '/timestamp',
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

        /*----------------------------- MAP DATA -----------------------------------*/
        success: function initMap(response) {
            if (response.results > 0) {
                var lat = response.data[0].location.coordinates[1];
                var long = response.data[0].location.coordinates[0];
                map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 13,
                    center: new google.maps.LatLng(lat, long),
                    mapTypeId: "hybrid",
                });
            } else var lat = [0];
            var long = [0];

        },
    });


    $.ajax({
        type: 'GET',
        url: 'https://api.checkwx.com/station/' + icao + '/timestamp',
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
                var time = response.data[0];
                $('#results_block').removeClass('d-none');
                $('#local_time').text(time.timestamp.local.time);
                $('#utc_time').text(time.timestamp.utc.time);
                $('#loc').html(time.location.coordinates[0] + ',' + time.location.coordinates[1]);
            }
        },
    });

    $.ajax({
        type: 'GET',
        url: 'https://api.checkwx.com/station/' + icao,
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
                var station = response.data[0];
                $('#results_block').removeClass('d-none');
                $('#type').text(station.type);
                $('#elevation').text(station.elevation.meters);
                $('#coordinates').html(station.latitude.degrees + ' / ' + station.longitude.degrees);
            }
        },
    });
})

//https://stackoverflow.com/questions/2231936/how-can-i-pre-fill-the-value-of-a-textarea-in-an-html-form
function addMetar() {

    var x = document.getElementById("emaildata").value;

    document.getElementById("emaildata").value = x + document.getElementById('metar_email').innerHTML;
}

function addTaf() {

    var x = document.getElementById("emaildata").value;

    document.getElementById("emaildata").value = x + document.getElementById('taf_email').innerHTML;
}

// https://gist.github.com/andrewlimaza/490a69417d9fe2df3f668195a7661605
function printDiv(divName) {
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;

}

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})