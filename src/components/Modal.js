import React from 'react';

const Modal = ({ title, data }) => {
  return (
    <div className="modal">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Waypoint</th>
            <th>Coordinates</th>
            <th>Distance (m)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.waypoint}</td>
              <td>{item.coordinates.join(', ')}</td>
              <td>{item.distance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Modal;
