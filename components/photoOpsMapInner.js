import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, Tooltip, useMap } from 'react-leaflet'
import L, { icon } from 'leaflet'
import React, { useRef, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import styles from './photoOpsMap.module.css'
import icons from '@/public/lib/icons'
import features from '@/public/data/map-features.json'
// -- Functons -- //

function getDistanceMiles(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Radius of Earth in miles
    const toRad = (value) => value * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


// -- Custom Components -- //

export function LocateControl() {
    // Continuously watch position and update a shared ref + marker
    const map = useMap();
    const locationMarkerRef = useRef(null);
    const positionRef = useRef({ lat: null, lng: null });
    const buttonRef = useRef(null);

    // SVGs for button states
    const normalSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--foreground)">
        <path d="M440-42v-80q-125-14-214.5-103.5T122-440H42v-80h80q14-125 103.5-214.5T440-838v-80h80v80q125 14 214.5 103.5T838-520h80v80h-80q-14 125-103.5 214.5T520-122v80h-80Zm40-158q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-120q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm0-80Z"/>
      </svg>`;

    const loadingSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q56 0 105.5-17.5T676-227l-57-57q-29 21-64.5 32.5T480-240q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 39-12 75t-33 65l57 57q32-41 50-91t18-106q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-160q22 0 42.5-5.5T561-342l-61-61q-5 2-10 2.5t-10 .5q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 6-.5 11.5T557-458l60 60q11-18 17-38.5t6-43.5q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Z"/>
      </svg>`;

    useEffect(() => {
        // Helper to clear loading state and show normal icon
        const clearLoading = () => {
            if (buttonRef.current) {
                buttonRef.current.innerHTML = normalSVG;
                buttonRef.current.classList.remove(styles.loading);
                buttonRef.current.removeAttribute('disabled');
            }
        };

        // Update position + marker
        const updatePosition = ({ latitude: lat, longitude: lng }) => {
            positionRef.current = { lat, lng };
            if (!locationMarkerRef.current) {
                locationMarkerRef.current = L.marker([lat, lng], { icon: icons.location }).addTo(map);
            } else {
                locationMarkerRef.current.setLatLng([lat, lng]);
            }
            clearLoading();
        };

        let watchId;
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (pos) => updatePosition(pos.coords),
                (err) => {
                    console.error(`Geolocation error (${err.code}): ${err.message}`);
                    clearLoading();
                },
                { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
            );
        } else {
            console.error('Geolocation not supported by your browser');
            clearLoading();
        }

        // Create the "fly" control button
        const control = L.control({ position: 'topright' });
        control.onAdd = () => {
            const btn = L.DomUtil.create('button', styles.locateButton);
            buttonRef.current = btn;
            btn.title = 'Center on Me';
            Object.assign(btn.style, {
                background: 'white',
                border: 'none',
                padding: '6px 10px',
                cursor: 'pointer',
                fontSize: '14px',
            });
            // show loading SVG until first fix
            btn.innerHTML = loadingSVG;
            btn.classList.add(styles.loading);
            btn.setAttribute('disabled', '');
            L.DomEvent.disableClickPropagation(btn);
            L.DomEvent.disableScrollPropagation(btn);
            btn.addEventListener('click', () => {
                const { lat, lng } = positionRef.current;
                if (lat != null && lng != null) {
                    map.flyTo([lat, lng], 18);
                } else {
                    alert('Still locating…');
                }
            });
            return btn;
        };
        control.addTo(map);

        // Cleanup on unmount
        return () => {
            if (watchId != null) navigator.geolocation.clearWatch(watchId);
            control.remove();
            if (locationMarkerRef.current) map.removeLayer(locationMarkerRef.current);
        };
    }, [map]);

    return null;
}

function FlyToQuery() {
    const map = useMap()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const x = params.get('x')
        const y = params.get('y')

        if (x && y) {
            const lat = parseFloat(x)
            const lng = parseFloat(y)
            if (!isNaN(lat) && !isNaN(lng)) {
                map.flyTo([lat, lng], 19)
            }
        }
    }, [map])

    return null
}


function ZoomLogger() { // This is for debugging
    const map = useMap();

    useEffect(() => {
        const handleZoom = () => {
            console.log('Zoom level:', map.getZoom());
        };

        map.on('zoomend', handleZoom);

        return () => {
            map.off('zoomend', handleZoom);
        };
    }, [map]);

    return null;
}

function ZoomVisibilityController() {
    const map = useMap();

    useEffect(() => {
        const handleZoom = () => {
            const zoom = map.getZoom();
            const shouldHide = zoom < 18; // Adjust threshold as needed

            const tooltips = document.querySelectorAll(`.${styles.pIconTooltip}`);
            tooltips.forEach(el => {
                el.style.display = shouldHide ? 'none' : 'block';
            });
        };

        map.on('zoomend', handleZoom);

        // Run once on mount
        handleZoom();

        return () => {
            map.off('zoomend', handleZoom);
        };
    }, [map]);

    return null;
}


// -- Markers -- //

const photoOps = [
    {
        label: 'Door',
        pos: [39.3843654, -78.0429576],
        imgSrc: null
    },
    {
        label: 'Stocks',
        pos: [39.3835555, -78.0433421],
        imgSrc: '/gallery/0b2c98_f05cbe60cd6e4a5fb0fc1af18748eb20~mv2.avif'
    },
    {
        label: 'Bench & Bridge',
        pos: [39.3836282, -78.0433265],   
    },
    {
        label: 'Big Chair',
        pos: [39.3833115, -78.0432332],
        imgSrc: '/placeholder.png'
    },
    {
        label: '"Love"',
        pos: [39.38272287986978, -78.0436764211604],
    },
    {
        label: 'Swing',
        pos: [39.381654454401975, -78.04468704613781]
    },
    {
        label: 'Kissing Booth & Tractor',
        pos: [39.38242472380304, -78.04515311653932]
    },
    {
        label: 'Ꮤ Bug',
        pos: [39.3829251383536, -78.04528277916505]
    }
]

const bathrooms = [
    {
        pos: [39.38282398140298, -78.04305006931251]
    },
    {
        pos: [39.38473337003943, -78.04291993823446]
    }
]



export default function PhotoOpsMapInner() {
    return (
        <div className='flex flex-col' style={{ height: '600px', width: '100%' }}>
            <MapContainer
                center={[39.383299, -78.044536]}
                zoom={18}
                style={{ height: '100%', width: '100%' }}
                maxZoom={19}
                minZoom={16}
            >
                <LocateControl />
                <ZoomLogger />
                <ZoomVisibilityController />
                <FlyToQuery />
                {/* -- Map Tile Layer -- */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    maxZoom={19}
                />

                {/* -- Buildings -- */}
                <Polygon
                    positions={features.pavilion}
                    color="var(--foreground)"
                >
                    <Popup>
                        Market
                    </Popup>
                    market
                </Polygon>

                {/* -- Zones -- */}

                <Polygon
                    positions={features.cornMaze}
                    color="var(--accent)"
                >
                    <Popup>
                        <a href='/activities/corn-maze'>See More</a>
                    </Popup>
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 0]}>
                        CORN MAZE
                    </Tooltip>
                </Polygon>
                <Polygon
                    positions={features.cornMaze2}
                    color="var(--accent)"
                >
                    <Popup>
                        <a href='/activities/corn-maze'>See More</a>
                    </Popup>
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 0]}>
                        CORN MAZE 2
                    </Tooltip>
                </Polygon>

                <Polygon
                    positions={features.pumpkinPatch1}
                    color="var(--accent)"
                >
                    <Popup>
                        <a href='/activities/pumpkin-patch'>See More</a>
                    </Popup>
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 0]}>
                        PUMPKIN PATCH 1
                    </Tooltip>
                </Polygon>

                <Polygon
                    positions={features.pumpkinPatch2}
                    color="var(--accent)"
                >
                    <Popup>
                        <a href='/activities/pumpkin-patch'>See More</a>
                    </Popup>
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 0]}>
                        PUMPKIN PATCH 2
                    </Tooltip>
                </Polygon>

                <Polygon
                    positions={features.sunflowers}
                    color="var(--accent)"
                >
                    <Popup>
                        <a href='/activities/flower-fields'>See More</a>
                    </Popup>
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 0]}>
                        SUNFLOWERS
                    </Tooltip>
                </Polygon>

                <Polygon
                    positions={features.parking}
                    color='var(--foreground)'
                >
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 0]}>
                        PARKING
                    </Tooltip>
                </Polygon>

                <Polygon
                    positions={features.meadow}
                    color='green'
                >
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 50]}>
                        MEADOW
                    </Tooltip>
                </Polygon>

                <Polygon
                    positions={features.natureMazeBounds}
                    color='green'
                >
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 0]}>
                        NATURE MAZE
                    </Tooltip>
                </Polygon>

                <Polygon
                    positions={features.zinnias}
                    color="green"
                >
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 0]}>
                        ZINNIAS
                    </Tooltip>
                    <Popup>
                        <a href='/activities/flower-fields'>See More</a>
                    </Popup>
                </Polygon>




                {/* -- Photo Ops -- */}
                {photoOps.map(({ pos, label, imgSrc }, i) => (
                    <Marker
                        key={i}
                        position={pos}
                        icon={icons.photoOp}
                        className={styles.marker}
                    >
                        <Popup className={styles.imgPopup}>
                            <span>Photo Op: {label}</span>
                            {imgSrc &&
                                <img src={imgSrc}/>
                            }
                        </Popup>
                    </Marker>
                ))}

                {/* -- Bathrooms -- */}

                {bathrooms.map(({ pos }, i) => (
                    <Marker
                        key={i}
                        position={pos}
                        icon={icons.bathroom}
                        className={styles.marker}
                    >
                        <Popup>Portable Toilet</Popup>
                    </Marker>
                ))}

                {/* -- Other Markers -- */}
                <Marker
                    position={[39.3845852, -78.0428097]}
                    icon={icons.entrance}
                    className={styles.marker}
                >
                    <Popup>Entrance</Popup>
                </Marker>
                <Marker
                    position={[39.38255709772837, -78.04351475851128]}
                    icon={icons.tractor}
                >
                    <Popup><a href='/activities/hayrides'>See More</a></Popup>
                    <Tooltip className={styles.pIconTooltip} permanent direction='center' offset={[0, 30]}>
                        Hay Rides
                    </Tooltip>
                </Marker>
                <Marker
                    position={[39.3839874682358, -78.04320299524723]}
                    icon={icons.playset}
                >
                    <Tooltip className={styles.pIconTooltip} permanent direction='center' offset={[0, 30]}>
                        Playground
                    </Tooltip>
                </Marker>
                <Marker
                    position={[39.38348206851645, -78.04264639224952]}
                    icon={icons.animal}
                >
                    <Popup><a href='/activities/petting-zoo'>See More</a></Popup>
                    <Tooltip className={styles.pIconTooltip} permanent direction='center' offset={[0, 30]}>
                        Petting Zoo
                    </Tooltip>
                </Marker>
                <Marker
                    position={[39.382430004649066, -78.04272123387958]}
                    icon={icons.football}
                >
                    <Tooltip className={styles.pIconTooltip} permanent direction='center' offset={[0, 30]}>
                        Football Nets
                    </Tooltip>
                </Marker>
                <Marker
                    position={[39.38309209277666, -78.04276937553388]}
                    icon={icons.food}
                >
                    <Popup><a href='/vendors'>See More</a></Popup>
                    <Tooltip className={styles.pIconTooltip} permanent direction='center' offset={[0, 30]}>
                        Food Vendors
                    </Tooltip>
                </Marker>
                <Marker
                    position={[39.38163138370034, -78.04489454865366]}
                    icon={icons.flower}
                >
                    <Popup><a href='/activities/flower-fields'>See More</a></Popup>
                    <Tooltip className={styles.pIconTooltip} permanent direction='center' offset={[0, 30]}>
                        Flower Arrangement Wagon
                    </Tooltip>

                </Marker>
                <Marker
                    position={[39.38274219398928, -78.04343323508722]}
                    icon={icons.maze}
                >
                    <Popup>Corn Maze Entrance</Popup>
                </Marker>
                <Marker
                    position={[39.38465031501388, -78.04952943171128]}
                    icon={icons.clearing}
                >
                    <Tooltip className={styles.pIconTooltip} permanent direction='center' offset={[0, 30]}>
                        Walnut Bottom
                    </Tooltip>
                </Marker>
                <Marker
                    position={[39.384037840804034, -78.04459340078672]}
                    icon={icons.maze}
                >
                    <Popup>Maze 2 Entrance</Popup>
                </Marker>

                {/* -- Barriers -- */}

                <Polyline
                    positions={features.middleCreek}
                    pathOptions={{
                        color: '#4DB7FF',
                        weight: 6,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                    }}
                />

                <Polyline
                    positions={features.stream}
                    pathOptions={{
                        color: '#4DB7FF',
                        weight: 4,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                    }}
                />

                {/* -- Paths -- */}

                <Polyline
                    positions={features.mainLane}
                    pathOptions={{
                        color: 'var(--foreground)',
                        weight: 4,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                        dashArray: '10, 10',
                    }}
                />
                <Polyline
                    positions={features.sideLane}
                    pathOptions={{
                        color: 'var(--foreground)',
                        weight: 4,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                        dashArray: '10, 10',
                    }}
                />
                <Polyline
                    positions={features.forestLane}
                    pathOptions={{
                        color: 'var(--foreground)',
                        weight: 4,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                        dashArray: '10, 10',
                    }}
                />
                <Polyline
                    positions={features.hillLane}
                    pathOptions={{
                        color: 'var(--foreground)',
                        weight: 4,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                        dashArray: '10, 10',
                    }}
                />
                <Polyline
                    positions={features.shadoa1}
                    pathOptions={{
                        color: 'var(--foreground)',
                        weight: 4,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                        dashArray: '10, 10',
                    }}
                />
                <Polyline
                    positions={features.shadoa2}
                    pathOptions={{
                        color: 'var(--foreground)',
                        weight: 4,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                        dashArray: '10, 10',
                    }}
                />
                <Polyline
                    positions={features.shadoa3}
                    pathOptions={{
                        color: 'var(--foreground)',
                        weight: 4,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                        dashArray: '10, 10',
                    }}
                />
                <Polyline
                    positions={features.backLane}
                    pathOptions={{
                        color: 'var(--foreground)',
                        weight: 4,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                        dashArray: '10, 10',
                    }}
                />
                <Polyline
                    positions={features.cornMazeExit}
                    pathOptions={{
                        color: 'var(--foreground)',
                        weight: 4,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                        dashArray: '10, 10',
                    }}
                />
                <Polyline
                    positions={features.Nm1}
                    pathOptions={{
                        color: 'var(--foreground)',
                        weight: 4,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                        dashArray: '10, 10',
                    }}
                />
                <Polyline
                    positions={features.Nm2}
                    pathOptions={{
                        color: 'var(--foreground)',
                        weight: 4,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                        dashArray: '10, 10',
                    }}
                />
                
                <Polyline
                    positions={features.Nm3}
                    pathOptions={{
                        color: 'var(--foreground)',
                        weight: 4,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                        dashArray: '10, 10',
                    }}
                />
                <Polyline
                    positions={features.Nm4}
                    pathOptions={{
                        color: 'var(--foreground)',
                        weight: 4,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                        dashArray: '10, 10',
                    }}
                />
                <Polyline
                    positions={features.Nm5}
                    pathOptions={{
                        color: 'var(--foreground)',
                        weight: 4,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                        dashArray: '10, 10',
                    }}
                />
                <Polyline
                    positions={features.newgroundsPath}
                    pathOptions={{
                        color: 'var(--foreground)',
                        weight: 4,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                        dashArray: '10, 10',
                    }}
                />
            </MapContainer>
        </div>
    )
}
