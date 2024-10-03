// Inicialización del mapa

var map = L.map('IRAmap').setView([-38.4161, -63.6167], 5); // Centro de Argentina

// Capa base del mapa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Función para buscar usando Overpass API
function searchLocation(query) {
    var overpassUrl = "https://overpass-api.de/api/interpreter";
    var overpassQuery = `
    [out:json];
    (
      area[name="Argentina"]->.boundaryarea;
      node(area.boundaryarea)[name~"${query}", i][place];
      way(area.boundaryarea)[name~"${query}", i][place];
      relation(area.boundaryarea)[name~"${query}", i][place];
    );
    out center;
    `;

    axios.post(overpassUrl, `data=${encodeURIComponent(overpassQuery)}`)
        .then(function (response) {
            var data = response.data.elements;

            if (data.length === 0) {
                alert("No se encontró ninguna coincidencia.");
                return;
            }

            var firstResult = data[0];
            var lat = firstResult.lat || firstResult.center.lat;
            var lon = firstResult.lon || firstResult.center.lon;

            map.setView([lat, lon], 10); // Zoom en la ubicación encontrada

            L.marker([lat, lon]).addTo(map)
                .bindPopup(firstResult.tags.name)
                .openPopup();
        })
        .catch(function (error) {
            console.error("Error al buscar la ubicación:", error);
        });
}

// Evento de clic en el botón de búsqueda
document.getElementById('searchButton').addEventListener('click', function () {
    var query = document.getElementById('search').value;
    if (query) {
        searchLocation(query);
    } else {
        alert("Por favor, ingresa una provincia o localidad.");
    }
});

// Evento para presionar Enter en el input
document.getElementById('search').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('searchButton').click();
    }
});
