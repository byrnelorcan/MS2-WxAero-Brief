var xhr = new XMLHttpRequest();
xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        success(JSON.parse(this.responseText));
    }
});


xhr.open("GET", "https://api.checkwx.com/station/EIDW/timestamp");
xhr.setRequestHeader("X-API-KEY", "4a6fff29393d4f7080abbdfae4");
xhr.send();

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 2,
        center: new google.maps.LatLng(2.8, -187.3),
        mapTypeId: "terrain",
    });
}

function success(response) {
    if (response.results > 0) {
        var locator = response.data[0];
        for (let i = 0; i < coordinates.length; i++) {
            const coords = locator.location.coordinates[i];
            document.getElementById('LatLong').innerText = coords;
            const latLng = new google.maps.LatLng(coords[1], coords[0]);
            new google.maps.Marker({
                position: latLng,
                map: map,
            });
        }
    }
}