// Inicialización del mapa en Buenos Aires
var map = L.map('IRAmap').setView([-34.6037, -58.3816], 10); // Centro de Buenos Aires

// Establecer límites para que no se pueda mover fuera de Argentina
var bounds = L.latLngBounds(
    L.latLng(-55.0, -73.0), // Suroeste (Tierra del Fuego)
    L.latLng(-21.0, -53.0)  // Noreste (Misiones)
);

map.setMaxBounds(bounds);
map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: false });
});

// Capa base del mapa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    minZoom: 5,
    maxZoom: 15
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

// Función para obtener sugerencias mientras se escribe
document.getElementById('search').addEventListener('input', function () {
    var query = this.value;

    if (query.length > 2) { // Buscar sugerencias si hay más de 2 caracteres
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
                var suggestionsList = document.getElementById('suggestions');
                suggestionsList.innerHTML = ''; // Limpiar las sugerencias anteriores

                data.forEach(function (element) {
                    var option = document.createElement('option');
                    option.value = element.tags.name;
                    suggestionsList.appendChild(option);
                });
            })
            .catch(function (error) {
                console.error("Error al obtener sugerencias:", error);
            });
    }
});

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

