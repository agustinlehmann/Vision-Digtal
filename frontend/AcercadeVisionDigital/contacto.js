const map = L.map('map').setView([-34.770938361354226, -58.22632245315239], 40); 

// Capa de mapa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

L.marker([-34.770938361354226, -58.22632245315239]).addTo(map)
    .bindPopup('Vision Digital') 
    .openPopup();
//