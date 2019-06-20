function initMap() {
    var ju = {lat: castle.lat, lng: castle.lng};
    var map = new google.maps.Map(
    document.getElementById('map'), {zoom: 4, center: ju});
    var marker = new google.maps.Marker({position: ju, map: map});
}
