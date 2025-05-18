import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, Tooltip, useMap } from 'react-leaflet'
import L, { icon } from 'leaflet'
import React, { useRef, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import styles from './photoOpsMap.module.css'

// -- Custom Icons -- //

const entranceIcon = new L.DivIcon({
    className: styles.marker,
    html: `
    <div style="width: 30px; height: 30px;">
      <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="var(--accent)">
        <path d="M117.7-302.31v-355.38h59.99v355.38H117.7Zm110.76 73.85v-362.31q0-58.31 41.35-99.54 41.35-41.23 99.42-41.23h221.54q58.31 0 99.54 41.23 41.23 41.23 41.23 99.54v362.31H228.46Zm553.85-73.85v-355.38h59.99v355.38h-59.99ZM480-480ZM288.46-288.46H450V-450h-73.84v-60H450v-161.54h-80.82q-33.33 0-57.03 23.73-23.69 23.72-23.69 57.04v302.31Zm221.54 0h161.54v-302.31q0-33.32-23.73-57.04-23.72-23.73-57.04-23.73H510V-510h73.84v60H510v161.54Z"/>
      </svg>
    </div>
  `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -12],
})

const photOpIcon = new L.DivIcon({
    className: styles.marker,
    html: `
      <div style="width: 24px; height: 24px;">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--accent)"><path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z"/></svg>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
})

const tractorIcon = new L.DivIcon({
    className: styles.marker,
    html: `<div><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px""><path d="M160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680h120q33 0 56.5 23.5T360-600H160Zm80 360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm540 0q25 0 42.5-17.5T840-300q0-25-17.5-42.5T780-360q-25 0-42.5 17.5T720-300q0 25 17.5 42.5T780-240Zm-540-60q-25 0-42.5-17.5T180-360q0-25 17.5-42.5T240-420q25 0 42.5 17.5T300-360q0 25-17.5 42.5T240-300Zm560-139q26 5 43 13.5t37 27.5v-242q0-33-23.5-56.5T800-720H548l-42-44 56-56-28-28-142 142 30 28 56-56 42 42v92q0 33-23.5 56.5T440-520h-81q23 17 37 35t28 45h16q66 0 113-47t47-113v-40h200v201ZM641-320q6-27 14.5-43.5T682-400H436q4 23 4 40t-4 40h205Zm139 160q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm-540 0q-83 0-141.5-58.5T40-360q0-83 58.5-141.5T240-560q83 0 141.5 58.5T440-360q0 83-58.5 141.5T240-160Zm393-360Z"/></svg></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
})

const starIcon = new L.DivIcon({
    className: styles.marker,
    html: `<div><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m305-704 112-145q12-16 28.5-23.5T480-880q18 0 34.5 7.5T543-849l112 145 170 57q26 8 41 29.5t15 47.5q0 12-3.5 24T866-523L756-367l4 164q1 35-23 59t-56 24q-2 0-22-3l-179-50-179 50q-5 2-11 2.5t-11 .5q-32 0-56-24t-23-59l4-165L95-523q-8-11-11.5-23T80-570q0-25 14.5-46.5T135-647l170-57Zm49 69-194 64 124 179-4 191 200-55 200 56-4-192 124-177-194-66-126-165-126 165Zm126 135Z"/></svg></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
})

const foodIcon = new L.DivIcon({
    className: styles.marker,
    html: `<div><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-80v-366q-51-14-85.5-56T160-600v-280h80v280h40v-280h80v280h40v-280h80v280q0 56-34.5 98T360-446v366h-80Zm400 0v-320H560v-280q0-83 58.5-141.5T760-880v800h-80Z"/></svg></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
})

const bathroomIcon = new L.DivIcon({
    className: styles.marker,
    html: `<div><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M220-80v-300h-60v-220q0-33 23.5-56.5T240-680h120q33 0 56.5 23.5T440-600v220h-60v300H220Zm80-640q-33 0-56.5-23.5T220-800q0-33 23.5-56.5T300-880q33 0 56.5 23.5T380-800q0 33-23.5 56.5T300-720ZM600-80v-240H480l102-306q8-26 29.5-40t48.5-14q27 0 48.5 14t29.5 40l102 306H720v240H600Zm60-640q-33 0-56.5-23.5T580-800q0-33 23.5-56.5T660-880q33 0 56.5 23.5T740-800q0 33-23.5 56.5T660-720Z"/></svg></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
})

const locationIcon = new L.DivIcon({
    className: styles.marker,
    html: `<div><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-360q56 0 101-27.5t71-72.5q-35-29-79-44.5T480-520q-49 0-93 15.5T308-460q26 45 71 72.5T480-360Zm0-200q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0 374q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
})

// -- Building Polygon Coords -- //

const pavilionRectCoords = [
    [39.3837384788123, -78.04298314751757],
    [39.38372085732385, -78.04305154384465],
    [39.38355293467988, -78.04298918248622],
    [39.383570556210735, -78.04292346836804]
]

const cornMazeRectCoords = [
    [39.384167693973836, -78.04368000125827],
    [39.384132828662835, -78.04455286422159],
    [39.38272504784476, -78.04442068405612],
    [39.38274073755334, -78.04343279264026],
]

const pumpkin1PolyCoords = [
    [39.382195556313334, -78.04497710031059],
    [39.381696966621945, -78.04471095604787],
    [39.3814424404413, -78.0463168434636],
    [39.38163769348471, -78.04668899433943],
    [39.38190442220593, -78.04699348141966]
]

const pumpkin2PolyCoords = [
    [39.38238383401818, -78.04628977798133],
    [39.38260523399513, -78.0462627124631],
    [39.38269239914771, -78.0461995595872],
    [39.38278130749119, -78.0461657276894],
    [39.382720291973556, -78.0468310883462],
    [39.38275690129055, -78.04741074152855],
    [39.38282837656837, -78.04798813925106],
    [39.38242567343771, -78.04806031396637],
    [39.38232107484185, -78.04695062771843],
    [39.38233327801944, -78.04662584149952],
]

const sunflowerPolyCoords = [
    [39.38162840970017, -78.04468361276858],
    [39.38110366583773, -78.04440844666645],
    [39.380935044800324, -78.04496410309824],
    [39.381490694889806, -78.04522626717747]
]

const parkingPolyCoords = [
    [39.38481031761221, -78.04301429122442],
    [39.38482229657089, -78.04266701254909],
    [39.38505228919485, -78.04256103189655],
    [39.38557449780491, -78.04243316678473],
    [39.38594359859185, -78.04237517121719],
    [39.38660945959089, -78.04296323498832],
    [39.38720632587738, -78.04344518352950],
    [39.38717355678357, -78.04351886489675],
    [39.38705758919716, -78.04352382114078],
    [39.38696536038696, -78.04366733880218],
    [39.38703748234209, -78.04380799492615],
    [39.38715643980731, -78.04380207842264],
    [39.38722618586585, -78.04368250454078],
    [39.38718730594811, -78.04353417391133],
    [39.38721676585061, -78.04346030075236],
    [39.38809532916897, -78.04415326238191],
    [39.38737642338589, -78.04481019738122],
    [39.38668480472798, -78.04375453909363],
    [39.38629599754798, -78.04336242767336],
    [39.38563767398374, -78.04289324715265],
    [39.38481031761221, -78.04301429122442]
  ]
  

// -- Barrier Polyline Coords -- //

const middleCreekPath = [
    [39.38494971588764, -78.04313037337113],
    [39.38470223879587, -78.04313798170504],
    [39.38451299964327, -78.04315262194073],
    [39.38440411808746, -78.04319922316571],
    [39.38426676373811, -78.04330780043126],
    [39.38414996569266, -78.04347446649662],
    [39.38407390471563, -78.04353198373046],
    [39.38388669028947, -78.04347913750243],
    [39.38375023325088, -78.04346725286059],
    [39.38357167419225, -78.04345163094347],
    [39.38347418735486, -78.04342630954211],
    [39.38326602424205, -78.04335775693345],
    [39.38310537685080, -78.04331920683221],
    [39.38288882373752, -78.04327354547468],
    [39.38272401629364, -78.04323930134767],
    [39.38261190038263, -78.04319663937329],
    [39.38248108175661, -78.04312663803620],
    [39.38241033178654, -78.04305199197191],
    [39.38236070286756, -78.04301725436652],
    [39.38228940128641, -78.04305745560680],
    [39.38221164262912, -78.04315934681065],
    [39.38209184543526, -78.04324388255105]
]

const streamPath = [
    [39.38302036096318, -78.05106257257059],
    [39.38317053135678, -78.05080422516578],
    [39.38280469836696, -78.04995648150727],
    [39.38276160334598, -78.04961232425212],
    [39.38231148529103, -78.04873146182767],
    [39.38233121500014, -78.04833849457627],
    [39.38229708188910, -78.04789218312455],
    [39.38220429149547, -78.04756830052678],
    [39.38205044806787, -78.04740118366161],
    [39.38197755316190, -78.04701526936618],
    [39.38205773090615, -78.04673648333218],
    [39.38211681598462, -78.04629931130179],
    [39.38215886652072, -78.04570978040908],
    [39.38227415095098, -78.04498300472663],
    [39.38231772684465, -78.04438531999017],
    [39.38232854726656, -78.04368941475656],
    [39.38232821075578, -78.04308815397454]
]

// -- Paths -- //

const mainLanePath = [
    [39.38294796837541, -78.04274111746251],
    [39.38284251028097, -78.04282039173997],
    [39.38276773030428, -78.04292205234218],
    [39.38273025105474, -78.04308454478476],
    [39.38269691824863, -78.04336942415006],
    [39.38266923820850, -78.04449018662292],
    [39.38259736229405, -78.04500038579596],
    [39.38245121706609, -78.04555348498374],
    [39.38227268191507, -78.04676813204993],
    [39.38240864904328, -78.04867072276717],
    [39.38267931661350, -78.04934331178781],
    [39.38292189643492, -78.04991994941085],
    [39.38317057726579, -78.05056746257888]
]

const sideLanePath = [
    [39.38257118371344, -78.0451015369942],
    [39.38220768515099, -78.04489245179872],
    [39.38182065243161, -78.04468147847862],
    [39.3812804151946, -78.0444245614368],
    [39.38095372662128, -78.04427095263533]
]

const forestLanePath = [
    [39.38236967564792, -78.04811560046717],
    [39.38331296389842, -78.04802218649375],
    [39.38339984763220, -78.04798737478514],
    [39.38350899327710, -78.04791429399148],
    [39.38359857845398, -78.04785804213539],
    [39.38369401665056, -78.04782436885753],
    [39.38378304089450, -78.04783330640537],
    [39.38384483673761, -78.04788609115683],
    [39.38391527093264, -78.04794438557734],
    [39.38399064185907, -78.04795101920855],
    [39.38410346686558, -78.04794009447623],
    [39.38421372484481, -78.04796885722055],
    [39.38432687195901, -78.04815012680898],
    [39.38466894850312, -78.04822011324980],
    [39.38473462604770, -78.04849060178195],
    [39.38468690512128, -78.04876015139557]
]

// -- Custom Components -- //

function LocateControl({ children }) {
    const map = useMap();

    useEffect(() => {
        const control = L.control({ position: 'topright' });

        control.onAdd = function () {
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');

            div.innerHTML = `<button class="${styles.locateButton}" title="Locate Me" style="background:white;border:none;padding:6px 10px;cursor:pointer;font-size:14px;"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--foreground)"><path d="M440-42v-80q-125-14-214.5-103.5T122-440H42v-80h80q14-125 103.5-214.5T440-838v-80h80v80q125 14 214.5 103.5T838-520h80v80h-80q-14 125-103.5 214.5T520-122v80h-80Zm40-158q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-120q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm0-80Z"/></svg></button>`;

            div.onclick = function () {
                if (!navigator.geolocation) {
                    alert('Geolocation is not supported by your browser');
                    return;
                }

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        map.flyTo([latitude, longitude], 18);
                        L.marker([latitude, longitude], {
                            icon: locationIcon,
                        }).addTo(map);
                    },
                    () => {
                        alert('Unable to retrieve your location');
                    }
                );
            };

            return div;
        };

        control.addTo(map);

        return () => {
            control.remove();
        };
    }, [map]);

    return null;
}



export default function PhotoOpsMapInner() {
    return (
        <div className='flex flex-col' style={{ height: '600px', width: '100%' }}>
            <MapContainer
                center={[39.383299, -78.044536]}
                zoom={18}
                style={{ height: '100%', width: '100%' }}
            >
            <LocateControl />
                {/* -- Map Tile Layer -- */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* -- Buildings -- */}
                <Polygon
                    positions={pavilionRectCoords}
                    color="var(--foreground)"
                >
                    <Popup>
                        Market
                    </Popup>
                    market
                </Polygon>

                <Polygon
                    positions={cornMazeRectCoords}
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
                    positions={pumpkin1PolyCoords}
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
                    positions={pumpkin2PolyCoords}
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
                    positions={sunflowerPolyCoords}
                    color="var(--accent)"
                >
                    <Popup>
                        <a href='/activities/sunflower-field'>See More</a>
                    </Popup>
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 0]}>
                        SUNFLOWER FIELD
                    </Tooltip>
                </Polygon>

                <Polygon
                    positions={parkingPolyCoords}
                    color='var(--foreground)'
                >
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 0]}>
                        PARKING
                    </Tooltip>
                </Polygon>





                {/* -- Markers -- */}
                <Marker
                    position={[39.3845852, -78.0428097]}
                    icon={entranceIcon}
                    className={styles.marker}
                >
                    <Popup>Entrance</Popup>
                </Marker>
                <Marker
                    position={[39.3843654, -78.0429576]}
                    icon={photOpIcon}
                >
                    <Popup>Door Photo Op</Popup>
                </Marker>
                <Marker
                    position={[39.3835555, -78.0433421]}
                    icon={photOpIcon}
                >
                    <Popup
                        className={styles.imgPopup}
                    >
                        <img src='/gallery/0b2c98_f05cbe60cd6e4a5fb0fc1af18748eb20~mv2.avif'></img>
                        Stocks Photo Op
                    </Popup>
                </Marker>
                <Marker
                    position={[39.3836282, -78.0433265]}
                    icon={photOpIcon}
                >
                    <Popup>Bench & Bridge Photo Op</Popup>
                </Marker>
                <Marker
                    position={[39.3833115, -78.0432332]}
                    icon={photOpIcon}
                >
                    <Popup className={styles.imgPopup}>
                        <img src='/UNLICENSED_PLACEHOLDER_bigchair.jpg'></img>
                        Big Chair Photo Op
                    </Popup>
                </Marker>
                <Marker
                    position={[39.38272287986978, -78.0436764211604]}
                    icon={photOpIcon}
                >
                    <Popup>"Love" Photo Op</Popup>
                </Marker>
                <Marker
                    position={[39.381654454401975, -78.04468704613781]}
                    icon={photOpIcon}
                >
                    <Popup>Swing Photo Op</Popup>
                </Marker>
                <Marker
                    position={[39.38242472380304, -78.04515311653932]}
                    icon={photOpIcon}
                >
                    <Popup>Kissing Booth & Tractor Photo Op</Popup>
                </Marker>
                <Marker
                    position={[39.3829251383536, -78.04528277916505]}
                    icon={photOpIcon}
                >
                    <Popup>VW Bug Photo Op</Popup>
                </Marker>
                <Marker
                    position={[39.38255709772837, -78.04351475851128]}
                    icon={tractorIcon}
                >
                    <Popup><a href='/activities/hayrides'>See More</a></Popup>
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 30]}>
                        Hay Rides
                    </Tooltip>
                </Marker>
                <Marker
                    position={[39.3839874682358, -78.04320299524723]}
                    icon={starIcon}
                >
                    <Popup><a href='/activities/playground'>See More</a></Popup>
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 30]}>
                        Playground
                    </Tooltip>
                </Marker>
                <Marker
                    position={[39.38348206851645, -78.04264639224952]}
                    icon={starIcon}
                >
                    <Popup><a href='/activities/petting-zoo'>See More</a></Popup>
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 30]}>
                        Petting Zoo
                    </Tooltip>
                </Marker>
                <Marker
                    position={[39.382430004649066, -78.04272123387958]}
                    icon={starIcon}
                >
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 30]}>
                        Football Nets
                    </Tooltip>
                </Marker>
                <Marker
                    position={[39.38309209277666, -78.04276937553388]}
                    icon={foodIcon}
                >
                    <Popup><a href='/vendors'>See More</a></Popup>
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 30]}>
                        Food Vendors
                    </Tooltip>
                </Marker>
                <Marker
                    position={[39.38282398140298, -78.04305006931251]}
                    icon={bathroomIcon}
                >
                    <Popup>Portable Toilet</Popup>
                </Marker>
                <Marker
                    position={[39.38473337003943, -78.04291993823446]}
                    icon={bathroomIcon}
                >
                    <Popup>Portable Toilet</Popup>
                </Marker>

                {/* -- Barriers -- */}

                <Polyline
                    positions={middleCreekPath}
                    pathOptions={{
                        color: '#4DB7FF',
                        weight: 6,
                        opacity: 0.7,
                        lineCap: 'round',
                        lineJoin: 'round',
                    }}
                />

                <Polyline
                    positions={streamPath}
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
                    positions={mainLanePath}
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
                    positions={sideLanePath}
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
                    positions={forestLanePath}
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
