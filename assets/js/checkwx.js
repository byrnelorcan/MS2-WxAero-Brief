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

                $('#icao_code').html(metar.icao);
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
                var bulletin_info = taf.timestamp.bulletin;
                var date = new Date(bulletin_info);
                var from_timestamp = taf.timestamp.from;
                var from = new Date(from_timestamp);
                var to_timestamp = taf.timestamp.to;
                var end = new Date(to_timestamp);
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
                $('#taf_bulletin').html('Bulletin issued on ' + date.toUTCString());
                $('#taf_raw').text(taf.raw_text);
                $('#taf_info').html('Report issued for ' + taf.icao + ' at ' + taf.station.name);
                $('#taf_timestamp').html('Forecast active from ' + from.toUTCString() + ' to ' + end.toUTCString());

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

        success: function (response) {
            if (response.results > 0) {
                var time = response.data[0];
                //var lat = response.data[0].location.coordinates[1];
                //var long = response.data[0].location.coordinates[0];
                $('#local_time').text(time.timestamp.local.time);
                $('#utc_time').text(time.timestamp.utc.time);
                $('#loc').html(time.location.coordinates[0] + ',' + time.location.coordinates[1]);

            }
        }


    });

});

/*----------------------------- MAP DATA -----------------------------------*/


function initMap() {
    //https://stackoverflow.com/questions/58012240/map-center-and-marker-create-based-on-text-input
    var loc = document.getElementById('loc').value;
    var coords = loc.split(",");
    //https://stackoverflow.com/questions/26890514/convert-lat-long-string-into-google-maps-api-latlng-object
    var build = new google.maps.LatLng(parseFloat(coords[0]), parseFloat(coords[1]));
    var map = new google.maps.Map(document.getElementById('map'), {
        center: build,
        zoom: 13,
        mapTypeId: 'roadmap'
    });
}





//var lat = document.getElementById('lat');
//var long = document.getElementById('long');
//var build = new google.maps.LatLng(parseFloat(lat), parseFloat(long));
//var map = new google.maps.Map(document.getElementById('map'), {
//center: build,
// zoom: 13,
//mapTypeId: 'roadmap'
//});
//var marker = new google.maps.Marker({
// map: map,
// position: map.getCenter()