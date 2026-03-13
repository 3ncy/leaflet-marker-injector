// ==UserScript==
// @name         Leaflet map tools
// @description  Allows easy adding of custom markers by their position;
// @author       Ency
// @homepage     https://github.com/3ncy/leaflet-marker-injector
// @match        https://tarkov.dev/map/*
// @run-at       document-start
// @version      2025-12-22
// @grant        none
// ==/UserScript==

function create(position, color = null, name = null) {
    let pos = [position.z, position.x];

    if (color == null) color = "#3388ff";
    else color = standardize_color(color);

    let svgIcon = L.divIcon({
        html: `<svg width="32" height="44" viewBox="0 0 32 44" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.2 0 0 7.2 0 16c0 11 16 28 16 28s16-17 16-28c0-8.8-7.2-16-16-16z"
                  fill="${color}" stroke="white" stroke-width="2"/>
            <circle cx="16" cy="16" r="6" fill="white"/>
        </svg>`,
        className: 'svg-marker',
        iconSize: [32, 44],
        iconAnchor: [16, 44],
        popupAnchor: [0, -44]
    });

    let marker = L.marker(pos, { icon: svgIcon }).addTo(window.leafletMap);
    if (name != null) marker.bindPopup(name);
    console.log(pos);
    return marker;
}
window.add = create;


function standardize_color(str) {
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = str;
    return ctx.fillStyle;
}


function remove(marker) {
    window.leafletMap.removeLayer(marker);
}
window.del = remove;


(function () {
    'use strict';

    function interceptLeaflet() {
        if (typeof L === 'undefined' || !L.map) {
            // Leaflet not loaded yet, check again soon
            setTimeout(interceptLeaflet, 1); // milliseconds
            return;
        }

        console.log("Leaflet has loaded");
        // Leaflet is loaded, now intercept
        const originalMap = L.map;
        L.map = function (...args) {
            const mapInstance = originalMap.apply(this, args);
            window.leafletMap = mapInstance;
            console.log('Leaflet map captured!', mapInstance);
            return mapInstance;
        };

        console.log('Leaflet interceptor installed!');
    }

    interceptLeaflet();

    window.create = create;
})();
