// Mapa centrado en una ubicación específica (Ciudad de México en este caso)
const map = L.map('map').setView([-34.770938361354226, -58.22632245315239], 40); // Coordenadas de Ciudad de México

// Capa de mapa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Agregar un marcador en la ubicación específica (Ciudad de México)
L.marker([-34.770938361354226, -58.22632245315239]).addTo(map)
    .bindPopup('Vision Digital') // Texto que aparecerá en el popup
    .openPopup();
