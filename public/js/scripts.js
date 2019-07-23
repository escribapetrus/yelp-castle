function initMap() {
    var ju = {lat: castle.lat, lng: castle.lng};
    var map = new google.maps.Map(
    document.getElementById('map'), {zoom: 4, center: ju});
    var marker = new google.maps.Marker({position: ju, map: map});
}

$(document).ready(function() {
    $('li.active').removeClass('active');
    $('a[href="' + location.pathname + '"]').closest('li').addClass('active'); 
  });