var map = L.map('map', {center: [39.981192, -75.155399], zoom: 11});
    	L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
			attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="https://www.phila.gov/programs/lead-and-healthy-homes-program/">Philadelphai Open Data</a>',
			maxZoom: 17,
			minZoom: 9
		}).addTo(map);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap' }).addTo(map);
        
        var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGR1Ym9pcyIsImEiOiJjbG83czN0aG8wN2ZoMnFxcHluYWdueTU4In0.gYvYsMVbWvNO8zCb4M14dA';
            
        var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr}),
            streets  = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
            
 var baseMaps = {
    "grayscale": grayscale,
    "streets": streets
};

        // Add you code here 


                // Create an Empty Popup
                var popup = L.popup();
                // Write function to set Properties of the Popup
                function onMapClick(e) {
                    popup
                        .setLatLng(e.latlng)
                        .setContent("You clicked the map at " + e.latlng.toString())
                        .openOn(map);
                }

                // Listen for a click event on the Map element
                map.on('click', onMapClick);

                // Set style function that sets fill color property equal to blood lead
                function styleFunc(feature) {
                    return {
                        fillColor: setColorFunc(feature.properties.mortlty),
                        fillOpacity: 0.9,
                        weight: 1,
                        opacity: 1,
                        color: '#ffffff',
                        dashArray: '3'
                    };
                }

                // Set function for color ramp, you can use a better palette
                function setColorFunc(density){
                    return density = "Better" ? '#36A4AB' :
                        density = "Worse" ? '#3B2D5B' :
                        density = "No Different" ? '#ffffff' :
                                        '#BFBCBB';
                };

                // Now we’ll use the onEachFeature option to add the listeners on our state layers:
                function onEachFeatureFunc(feature, layer){
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        click: zoomFeature
                    });
                    layer.bindPopup('Count: '+feature.properties.mortlty);
                }

                

                function highlightFeature(e){
                var layer = e.target;

                layer.setStyle({
                    weight: 5,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.7
                });
                // for different web browsers
                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layer.bringToFront();
                }
                }

                  // Define what happens on mouseout:
                  function resetHighlight(e) {
                    neighborhoodsLayer.resetStyle(e.target);
                }  


                // As an additional touch, let’s define a click listener that zooms to the state: 
                function zoomFeature(e){
                    console.log(e.target.getBounds());
                    map.fitBounds(e.target.getBounds().pad(1.5));
                }

                // load GeoJSON from an external file
                var neighborhoodsLayer = null;
                $.getJSON("nbhds.geojson",function(data){
                    // add GeoJSON layer to the map once the file is loaded
                    neighborhoodsLayer = L.geoJson(data, {
                        style: styleFunc,
                        onEachFeature: onEachFeatureFunc
                    }).addTo(map);

                    var overlayLayer = {
                        "mortality": neighborhoodsLayer
                };

                L.control.layers(baseMaps, overlayLayer).addTo(map);
                });

                
		// Create Leaflet Control Object for Legend
		var legend = L.control({position: 'bottomright'});
		
		// Function that runs when legend is added to map
		legend.onAdd = function (map) {
			// Create Div Element and Populate it with HTML
			var div = L.DomUtil.create('div', 'legend');		    
			div.innerHTML += '<b>Count of Children</b><br />';
			div.innerHTML += 'in census tract<br />';
			div.innerHTML += '<br>';
			div.innerHTML += '<i style="background: #810f7c"></i><p>43 - 81</p>';
			div.innerHTML += '<i style="background: #8856a7"></i><p>25 - 42</p>';
			div.innerHTML += '<i style="background: #8c96c6"></i><p>12 - 24</p>';
			div.innerHTML += '<i style="background: #b3cde3"></i><p>1 - 11</p>';
			div.innerHTML += '<hr>';
			div.innerHTML += '<i style="background: #BFBCBB"></i><p>No Data</p>';
			
			// Return the Legend div containing the HTML content
			return div;
		};
		
		// Add Legend to Map
		legend.addTo(map);

		// Add Scale Bar to Map
		L.control.scale({position: 'bottomleft'}).addTo(map);

