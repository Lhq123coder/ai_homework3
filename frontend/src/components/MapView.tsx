import { useEffect, useRef, useState } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

interface MapViewProps {
  itinerary: any;
}

export default function MapView({ itinerary }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    initMap();
  }, []);

  useEffect(() => {
    if (map && itinerary) {
      addMarkers();
    }
  }, [map, itinerary]);

  const initMap = async () => {
    try {
      // Get the API key from environment variable
      const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '';
      
      if (!AMAP_KEY) {
        setError('地图API密钥未配置。请在环境变量中设置 VITE_AMAP_KEY。');
        setLoading(false);
        return;
      }

      const AMap = await AMapLoader.load({
        key: AMAP_KEY,
        version: '2.0',
        plugins: ['AMap.Marker', 'AMap.InfoWindow', 'AMap.Polyline']
      });

      if (mapRef.current) {
        const mapInstance = new AMap.Map(mapRef.current, {
          zoom: 12,
          center: [116.397428, 39.90923], // Default to Beijing
          viewMode: '3D'
        });

        setMap(mapInstance);
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Failed to load map:', err);
      setError('地图加载失败。使用备用视图。');
      setLoading(false);
    }
  };

  const addMarkers = () => {
    if (!map || !window.AMap) return;

    // Clear existing overlays
    map.clearMap();

    const markers: any[] = [];
    const points: any[] = [];

    // Add markers for each day's activities
    itinerary?.days?.forEach((day: any, dayIdx: number) => {
      day.activities?.forEach((activity: any, actIdx: number) => {
        if (activity.coordinates && activity.coordinates.lat && activity.coordinates.lng) {
          const position = [activity.coordinates.lng, activity.coordinates.lat];
          points.push(position);

          const marker = new window.AMap.Marker({
            position,
            title: activity.title,
            label: {
              content: `${dayIdx + 1}-${actIdx + 1}`,
              direction: 'top'
            }
          });

          const infoWindow = new window.AMap.InfoWindow({
            content: `
              <div style="padding: 10px; max-width: 250px;">
                <h4 style="margin: 0 0 8px 0; color: #3b82f6;">${activity.title}</h4>
                <p style="margin: 0 0 4px 0; font-size: 14px;">${activity.description}</p>
                <p style="margin: 0; font-size: 12px; color: #64748b;">
                  <strong>时间：</strong>${activity.time}<br/>
                  <strong>费用：</strong>¥${activity.estimatedCost || 0}
                </p>
              </div>
            `
          });

          marker.on('click', () => {
            infoWindow.open(map, marker.getPosition());
          });

          markers.push(marker);
        }
      });
    });

    // Add accommodation marker
    if (itinerary?.accommodation?.coordinates) {
      const position = [
        itinerary.accommodation.coordinates.lng,
        itinerary.accommodation.coordinates.lat
      ];
      points.push(position);

      const marker = new window.AMap.Marker({
        position,
        title: itinerary.accommodation.name,
        icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
        label: {
          content: '住宿',
          direction: 'top'
        }
      });

      const infoWindow = new window.AMap.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h4 style="margin: 0 0 8px 0; color: #3b82f6;">🏨 ${itinerary.accommodation.name}</h4>
            <p style="margin: 0; font-size: 14px;">
              ${itinerary.accommodation.type}<br/>
              ${itinerary.accommodation.location}<br/>
              <strong>约 ¥${itinerary.accommodation.estimatedCost}/晚</strong>
            </p>
          </div>
        `
      });

      marker.on('click', () => {
        infoWindow.open(map, marker.getPosition());
      });

      markers.push(marker);
    }

    // Add markers to map
    map.add(markers);

    // Draw polyline connecting the points
    if (points.length > 1) {
      const polyline = new window.AMap.Polyline({
        path: points,
        borderWeight: 2,
        strokeColor: '#3b82f6',
        strokeWeight: 4,
        strokeOpacity: 0.6,
        lineJoin: 'round'
      });
      map.add(polyline);
    }

    // Fit view to show all markers
    if (points.length > 0) {
      map.setFitView();
    }
  };

  if (error) {
    return (
      <div style={{
        padding: '3rem',
        textAlign: 'center',
        backgroundColor: '#fff7ed',
        border: '2px dashed #fed7aa',
        borderRadius: '0.5rem',
        margin: '1rem'
      }}>
        <p style={{ color: '#92400e', marginBottom: '1rem' }}>{error}</p>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          textAlign: 'left'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>备用行程位置列表：</h3>
          {itinerary?.days?.map((day: any) => (
            <div key={day.day} style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: 'var(--primary)' }}>第 {day.day} 天</h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                {day.activities?.map((activity: any, idx: number) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>
                    <strong>{activity.title}</strong> - {activity.location}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {itinerary?.accommodation && (
            <div>
              <h4 style={{ color: 'var(--primary)' }}>住宿</h4>
              <p>🏨 {itinerary.accommodation.name} - {itinerary.accommodation.location}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 10
        }}>
          <p style={{ color: 'var(--text-light)' }}>地图加载中...</p>
        </div>
      )}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '600px',
          borderRadius: '0.5rem'
        }}
      />
      <div style={{
        padding: '1rem',
        backgroundColor: '#f0f9ff',
        borderTop: '1px solid var(--border)'
      }}>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-light)',
          margin: 0
        }}>
          💡 点击地图标记查看详细信息 · 数字标记表示第几天的第几个活动
        </p>
      </div>
    </div>
  );
}

