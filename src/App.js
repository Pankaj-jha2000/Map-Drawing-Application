import React, { useState, useEffect } from 'react';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Draw } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Modal from './components/Modal';
import './styles/styles.css';

const App = () => {
  const [map, setMap] = useState(null);
  const [vectorSource] = useState(new VectorSource());
  const [vectorLayer] = useState(new VectorLayer({ source: vectorSource }));
  const [drawType, setDrawType] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [activeModal, setActiveModal] = useState('linestring');

  useEffect(() => {
    const initializeMap = () => {
      const newMap = new Map({
        target: 'map',
        layers: [
          new TileLayer({ source: new OSM() }),
          vectorLayer,
        ],
        view: new View({ center: [0, 0], zoom: 2 }),
      });
      setMap(newMap);
    };

    initializeMap();
  }, [vectorLayer]);

  const startDrawing = (type) => {
    if (!map) return;

    
    if (drawType) {
      map.removeInteraction(drawType);
    }

    setIsDrawing(true);
    setActiveModal(type);

    const draw = new Draw({ source: vectorSource, type });
    map.addInteraction(draw);

    draw.on('drawend', (event) => {
      const coords = event.feature.getGeometry().getCoordinates();
      if (type === 'LineString') updateLineStringModal(coords);
      else if (type === 'Polygon') updatePolygonModal(coords);
      setIsDrawing(false);
    });

    setDrawType(draw);

    
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        map.removeInteraction(draw);
        setIsDrawing(false);
        window.removeEventListener('keydown', handleKeyDown);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
  };

  const updateLineStringModal = (coords) => {
    const updatedData = coords.map((coord, index) => ({
      waypoint: `WP${String(index).padStart(2, '0')}`,
      coordinates: coord,
      distance: index > 0 ? calculateDistance(coords[index - 1], coord) : 0,
    }));
    setModalData(updatedData);
  };

  const updatePolygonModal = (coords) => {
    const updatedData = coords[0].map((coord, index) => ({
      waypoint: `WP${String(index).padStart(2, '0')}`,
      coordinates: coord,
      distance: index > 0 ? calculateDistance(coords[0][index - 1], coord) : 0,
    }));
    setModalData(updatedData);
  };

  const calculateDistance = (coord1, coord2) => {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div>
      <header className="app-header">
        <h1>Map Drawing Application</h1>
      </header>
      <div className="toolbar">
        <button disabled={isDrawing} onClick={() => startDrawing('LineString')}>
          Draw LineString
        </button>
        <button disabled={isDrawing} onClick={() => startDrawing('Polygon')}>
          Draw Polygon
        </button>
      </div>
      <div id="map" className="map-container"></div>
      <Modal title={activeModal === 'linestring' ? 'Mission Modal' : 'Polygon Modal'} data={modalData} />
    </div>
  );
};

export default App;
