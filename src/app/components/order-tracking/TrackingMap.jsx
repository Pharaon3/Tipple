import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';
import config from 'app/config';
import { throttle } from 'lib/util/function';
import { PUBLIC_ICON_FOLDER } from 'lib/constants/app';
// import GestureHandling from '@geolonia/mbgl-gesture-handling'; // For posterity

import styles from './TrackingMap.module.scss';

const MAP_VIEWPORT_PADDING = 40;
const MAP_DEFAULT_ZOOM = 14;

const TrackingMap = ({ lat, lng, driverLat, driverLng, assetPath }) => {
    const [viewport, setViewport] = useState({
        width: '100%',
        height: '100%',
        latitude: lat,
        longitude: lng,
        zoom: MAP_DEFAULT_ZOOM
    });

    const mapRef = useRef();
    const mapContainerRef = useRef();

    /**
     * Zoom the map to fit the complete set of markers rendered on the map.
     */
    const fitMap = () => {
        const width = mapContainerRef.current.getBoundingClientRect().width;
        const height = mapContainerRef.current.getBoundingClientRect().height;

        if (width && height) {
            const mercViewport = new WebMercatorViewport({ width, height });
            const mapItems = [{ lat, lng }];

            if (driverLat && driverLng) {
                mapItems.push({
                    lat: driverLat,
                    lng: driverLng
                });
            }

            const mapBounds = getMapBounds(mapItems, width, height);
            try {
                const bound = mercViewport.fitBounds(mapBounds, {
                    padding: MAP_VIEWPORT_PADDING
                });

                if (bound && bound.latitude && bound.longitude) {
                    setViewport({
                        ...viewport,
                        latitude: bound.latitude,
                        longitude: bound.longitude,
                        zoom: bound.zoom > MAP_DEFAULT_ZOOM && !(driverLat && driverLng) ? MAP_DEFAULT_ZOOM : bound.zoom,
                        width: '100%',
                        height: '100%'
                    });
                } else {
                    console.warn('ERROR triggering viewport change');
                }
            } catch (e) {
                console.warn('fitBounds error', e);
            }
        }
    };

    const throttledFitMap = throttle(() => {
        fitMap();
    }, 500);

    const getMapBounds = (mapItems = []) => {
        let bounds = new window.google.maps.LatLngBounds();

        // Cater for no items to render on map
        if (!mapItems || mapItems.length === 0) {
            return { center: null, zoom: null };
        }

        mapItems.forEach(o => {
            bounds.extend(new window.google.maps.LatLng(o.lat, o.lng));
        });

        // GET NW, SE BY NE, SW
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const nw = { lat: ne.lat(), lng: sw.lng() };
        const se = { lat: sw.lat(), lng: ne.lng() };

        return [[se.lng, se.lat], [nw.lng, nw.lat]];
    };

    useEffect(() => {
        window.addEventListener('resize', throttledFitMap);

        return () => {
            window.removeEventListener('resize', throttledFitMap);
        }
    }, []);

    // Update map when the driver changes their location.
    useEffect(() => {
        fitMap();
    }, [driverLat, driverLng]);

    return (
        <div className={styles.mapContainer} ref={mapContainerRef}>
            <ReactMapGL
                {...viewport}
                onViewportChange={(viewport) => setViewport(viewport)}
                mapboxApiAccessToken={config.mapboxKey}
                scrollZoom={false}
                ref={mapRef}
            >
                <div className={styles.control}>
                    <NavigationControl />
                </div>
                <Marker latitude={lat} longitude={lng} key="customer">
                    <div className={styles.customerMarker}>
                        <img src={`${PUBLIC_ICON_FOLDER}/icon-account.svg`} alt="Your location" />
                    </div>
                </Marker>
                {(driverLat && driverLng) && <Marker latitude={driverLat} longitude={driverLng} key="driver">
                    <div className={styles.driverMarker}>
                        <img src={`${assetPath}/icon-tracking-driver.svg`} alt="Your driver" />
                    </div>
                </Marker>}
            </ReactMapGL>
        </div>
    );
};

export default TrackingMap;