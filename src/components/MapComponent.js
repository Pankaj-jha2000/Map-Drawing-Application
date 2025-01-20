import React, { useEffect } from 'react';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';

const MapComponent = ({ vectorLayer, setMap }) => {
  useEffect(() => {
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
    setMap(map);
  }, [vectorLayer, setMap]);

  return <div id="map" style={{ width: '100%', height: '500px' }}></div>;
};

export default MapComponent;
