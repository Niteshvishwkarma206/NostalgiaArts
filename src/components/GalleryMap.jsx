import { useEffect, useRef } from 'react';

// Gallery location: Bhopal Naka, Murli, Sehore, Madhya Pradesh, India
const LAT = 23.2032;
const LNG = 77.0844;

export default function GalleryMap() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!window.L || mapRef.current) return;

    const map = window.L.map(containerRef.current, {
      center: [LAT, LNG],
      zoom: 14,
      scrollWheelZoom: false,
    });

    window.L.tileLayer(
      'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    const goldIcon = window.L.divIcon({
      className: '',
      html: '<div style="width:16px;height:16px;border-radius:50%;background:#d4af37;border:3px solid white;box-shadow:0 0 0 4px rgba(212,175,55,0.3)"></div>',
      iconSize: [16, 16],
    });

    window.L.marker([LAT, LNG], { icon: goldIcon })
      .addTo(map)
      .bindPopup('<b>Era Nostalgia</b><br/>Bhopal Naka, Murli, Sehore, MP');

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[320px]" />;
}
