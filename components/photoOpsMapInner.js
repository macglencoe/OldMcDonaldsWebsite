import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, Tooltip, useMap } from 'react-leaflet'
import L, { icon } from 'leaflet'
import React, { useRef, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import styles from './photoOpsMap.module.css'

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


// -- Custom Icons -- //

const entranceIcon = new L.DivIcon({
    className: styles.marker + ' ' + styles.t,
    html: `
    <div style="width: 30px; height: 30px;">
      <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 674.22 674.2">
  <path d="m674.22.86c-224.42.2-448.83.04-673.25.09-.08,224.42.16,448.84-.09,673.26C-1.04,450.57.88,224.6.22.2,224.83.83,449.78-1,674.22.86Z" style="fill: #fff; stroke-width: 0px;"/>
  <path d="m561.44,381.75c19.46.02,38.57-.04,57.95.01,6.39.03,9.47,3.09,9.62,9.41.67,6.09-1.56,12.47-8.68,12.17-19.66.03-39.26.02-58.93.02v34.39c11.06,1.8,66.05-4.66,66.84,4.63,3.2,6.91.65,18.41-8.9,17.09-19.37-.04-38.55-.05-57.95-.05v33.86c11.94,2.04,64.69-5.16,66.79,5.03,3.05,6.66.54,17.32-8.47,16.84-19.51-.07-38.9-.02-58.42-.02-1.17,27.56,7.72,35.9-26.89,33.6-6.92.52-10.71-4.25-10.65-10.71.01-124.98-.01-249.95,0-374.93h-115.46v45.02c11.59-.86,27.34-.33,27.09,14.95-.06,19.28-.11,38.56-.05,57.84.03,9.46-5.82,15.83-15.35,15.87-25.53.11-51.06.04-76.59.05-28.16.01-56.32.05-84.49.05-9.9,1.21-19.67-4.85-19.38-15.75-.03-19.4-.03-38.79.02-58.19,0-14.84,15.33-15.82,26.87-14.87v-45.02h-115.38c.06,124.15-.12,248.26.08,372.41.03,9.67-1.62,13.98-13.4,13.27-32.18,2.86-22.13-9.56-23.9-33.6-19.51-.01-38.56.02-57.97-.01-6.38-.02-9.65-3.3-9.73-9.69-.74-6.41,2.04-12.32,9.27-12.08,19.48-.02,38.86,0,58.35,0v-33.92c-11.32-1.81-65.77,4.67-67.05-4.73-3.11-6.66-.82-17.93,8.38-16.95,19.59.03,39.09-.02,58.69-.03v-34.36c-11.67-1.97-64.62,4.94-66.59-4.71-3.11-6.74-.38-17.7,8.72-16.9,19.33.03,38.59,0,57.92-.01v-218.87c-33.24-.57-45.57,7.24-41.86-34.16.07-6.9,4.64-12.01,11.57-12.14,15.23-.3,30.46-.29,45.69-.29,154.49.25,309.03-.56,463.5.32,15.96,2.65,9.62,22.72,10.72,34.15-2.02,19.59-28.64,9.85-41.97,12.19v218.81Zm-279.47-173.9h110.82v-44.69h-110.82v44.69Z" style="fill: #020202; stroke-width: 0px;"/>
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

const playsetIcon = new L.DivIcon({
    className: styles.marker + ' ' + styles.t,
    html: `<div>
<svg height="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 843.19 669.51">
  <path d="m319.87,167.01c-64.04.91-127.44,1.81-191.51,2.73v170.4c33.58,1.16,67.31,1.33,100.86.22,25.28-1.14,45.24,8.42,63.12,24.75,10.45,9.55,18.34,20.95,25.32,33.21,30.81,54.09,61.68,108.14,92.95,161.96,20.54,38.33,56.3,68.62,100.71,72.59,13.08.39,27.22,6.06,25.05,21.97-1.17,9.28-7.46,14.75-17.09,14.66-139.18-3.4-174.81-165.55-241.27-260.7-5.4-9.4-11.92-17.57-22.68-23.08-.3,77.61.6,155.1-.36,232.67-.58,8.27-4.95,12.85-13.16,13.41-10.18.48-25.41.3-24.37-13.61.01-33.9.29-66.87.2-100.96h-89.13c-.02,33.36-.06,66.76-.09,100.12,0,9.6-3.8,13.97-13.41,14.09-15.33.19-23.94.02-23.88-22,.12-45.65-.88-91.3-2.5-137.21-16.72,48.56-33.57,97.07-50.41,145.58-3.71,10.66-8.11,13.56-19.39,13.2-10.79-.23-23.03-3.25-17.42-16.73,28.09-82.13,60.64-162.69,88.12-245.04,3.6-65.69-.8-132.3.12-198.3-9.26-.14-18.74-1.43-21.84-11.23-2.25-6.47-1.32-12.49,3.75-17.51C116.87,97.29,162.74,52.89,208.39,8.3c11.72-11.41,21.05-10.87,32.66.5,45.26,44.52,91.44,88.12,136.11,133.25,4.78,4.75,6.04,10.56,3.87,16.53-3.42,9.3-14.28,8.69-22.7,9.08-.34,235.96-10.31,67.29,73.9,225.73,50.26,70.95,77.48,183.77,177.34,195.05,29.29,3.96,42.93,27.55,40.5,54.22-.61,10.73-3.87,23.86-16.98,23.22-13.47.75-17.01-13.44-17.45-24.49-1.25-11-5.7-15.16-16.48-17.33-124.31-17.34-158.89-156.41-220.27-246.49-12.25-21.18-29.18-36.04-52.79-42.94-5.04-1.47-6.04-5.22-6.05-9.66-.21-53.21-.18-103.87-.17-157.96Zm-102.44,215.2h-89.15v97.91h89.15v-97.91Z"/>
  <path d="m744.01,133.09h-33.63v266.84c11.81,1.5,14.68,2.39,14.22,15.91.05,6.5.29,13,.16,19.49.47,13.29-13.92,11.33-23.2,11.22-54.16.09-108.32.17-162.47.26-7.92.01-12.16-3.74-12.51-11.68-.34-7.65-.32-15.33-.39-22.99-.65-9.37,6.55-11.63,14.49-11.9V133.12h-35.21c-12.2,89.91-24.39,179.72-36.71,270.55-10.1-15.45-17.32-32.24-27.23-47.77-4.32-7.06-2.68-13.74-1.84-20.72,7.53-63.14,15.63-126.21,24.16-189.22,4.71-19.51-1.6-54.64,27.25-53.69,88.32-.08,176.64-.11,264.96-.09,14.78,0,22.71,6.46,24.84,21.17,3.24,22.4,5.83,44.89,8.64,67.34,8.68,69.53,17.26,139.07,26.03,208.58,7.75,60.59,15.46,121.18,22.96,181.8,1.41,11.23,2.91,22.44,4.49,33.65,1.18,8.38-2.88,15.13-11.07,16.84-11.42,3.03-26.18.13-27.48-13.82-6.75-52-13.49-103.99-20.17-156-13.64-106.28-26.83-212.31-40.26-318.66Zm-61.44,267.21V133.09h-115.07v267.21h115.07Z"/>
  <path d="m262.46,254.2c1.04,58.53,3.05,40.77-65,43.81-9.09-.01-13.07-4.11-13.09-13.19-.05-20.32-.06-40.65-.05-60.97,0-6.85,3.78-11.08,10.67-11.11,19.16-.11,38.32-.03,57.47.21,6.84.08,10.08,3.82,10.11,10.78.04,10.16,0,20.32,0,30.49h-.12Z"/>
</svg></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
})

const animalIcon = new L.DivIcon({
    className: styles.marker,
    html: `<div><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M180-475q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180-160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm240 0q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180 160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM266-75q-45 0-75.5-34.5T160-191q0-52 35.5-91t70.5-77q29-31 50-67.5t50-68.5q22-26 51-43t63-17q34 0 63 16t51 42q28 32 49.5 69t50.5 69q35 38 70.5 77t35.5 91q0 47-30.5 81.5T694-75q-54 0-107-9t-107-9q-54 0-107 9t-107 9Z"/></svg></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
})

const footballIcon = new L.DivIcon({
    className: styles.marker,
    html: `<div><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-480ZM362-202 202-362q-3 38-1.5 79t7.5 73q23 7 69.5 9t84.5-1Zm96-16q59-13 106-37t82-59q34-34 58-80.5T742-500L500-742q-57 14-103 38.5T316-644q-35 35-59.5 81.5T218-458l240 240Zm-62-122-56-56 224-224 56 56-224 224Zm362-256q4-39 2.5-81t-8.5-73q-23-8-69.5-10t-84.5 2l160 162ZM310-120q-57 0-104-8.5T148-148q-11-12-19.5-60T120-314q0-119 36-220.5T258-702q66-66 169-102t223-36q58 0 104.5 8.5T812-812q11 12 19.5 60t8.5 108q0 117-36 218.5T702-258q-65 65-168 101.5T310-120Z"/></svg></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
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
    [39.38720632587738, -78.0434451835295],
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

const meadowPolyCoords = [
    [39.38455262999532, -78.04309069124558],
    [39.38441534779643, -78.04311799366127],
    [39.38429809133059, -78.04324174451209],
    [39.38422705255935, -78.04329425947746],
    [39.38412947802303, -78.04333772403662],
    [39.3841296119118, -78.04342741468267],
    [39.38406097237566, -78.0434919949827],
    [39.38401126081848, -78.04347371656286],
    [39.38387974735232, -78.04344407779992],
    [39.38375138758046, -78.0434290773179],
    [39.38361932482493, -78.04342472224465],
    [39.3834635342841, -78.04338572874086],
    [39.38328919418718, -78.04332832384449],
    [39.38307631169106, -78.04328125832755],
    [39.38288055282338, -78.04323301628214],
    [39.38279158533962, -78.04319153828723],
    [39.38285376768982, -78.04288093191941],
    [39.38290304542633, -78.04280662364224],
    [39.38322659747622, -78.04260185407503],
    [39.38341153599814, -78.04252206775986],
    [39.38337503618315, -78.04266417461662],
    [39.38406450526296, -78.04287269926859],
    [39.3840656300847, -78.04280423483901],
    [39.38458632660144, -78.04278092139923],
    [39.38455262999532, -78.04309069124558]
]

const natureMazePolyCoords = [
    [39.38433755056818, -78.04815356994779],
    [39.38560011456507, -78.04826795658059],
    [39.38643624099736, -78.04837284514873],
    [39.38621890421253, -78.04990261399008],
    [39.38611174169476, -78.05040874068244],
    [39.38598493327811, -78.05053777844014],
    [39.38584508966504, -78.05054106290775],
    [39.38502786979112, -78.0505339172381],
    [39.3844381979019, -78.05051266087392],
    [39.38414821849114, -78.04900918251774],
    [39.38433755056818, -78.04815356994779]
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
const hillLanePath = [
    [39.38097054650977, -78.04430056589739],
    [39.38053550961378, -78.04526968004268],
    [39.38066125305239, -78.04539169646210],
    [39.38080498206207, -78.04557401500981],
    [39.38092387359227, -78.04572425797517],
    [39.38098322737414, -78.04580539136923],
    [39.38102168203937, -78.04591248370701],
    [39.38105406729328, -78.04598824303717],
    [39.38110945740490, -78.04604455140633],
    [39.38117449093604, -78.04607972365028],
    [39.38125820329286, -78.04610025113129],
    [39.38130427280289, -78.04612477654838],
    [39.38135993097977, -78.04620757865615],
    [39.38139725252289, -78.04630257605588],
    [39.38145143389944, -78.04640337836412],
    [39.38152122726721, -78.04651212362830],
    [39.38157871232287, -78.04659688835270],
    [39.38163158453123, -78.04668438360102],
    [39.38169717590335, -78.04675538017325],
    [39.38176754840467, -78.04684650966955],
    [39.38181765091575, -78.04689696672580],
    [39.38186454300687, -78.04695752689310],
    [39.38190207317138, -78.04701192882307],
    [39.38192554963756, -78.04711259678731],
    [39.38193806443607, -78.04720717982639],
    [39.38195986546587, -78.04731022384445],
    [39.38200352815936, -78.04739864676529],
    [39.38205494759855, -78.04749931902514],
    [39.38212197040707, -78.04757611604607],
    [39.38218783682238, -78.04768618243462],
    [39.38222819001237, -78.04780728235397],
    [39.38224549502588, -78.04794270698518],
    [39.38226125887689, -78.04811622173550],
    [39.38225203708555, -78.04828740323543],
    [39.38223198210813, -78.04848426783153],
    [39.38222423564230, -78.04860093201482],
    [39.38224622118939, -78.04874481339496],
    [39.38227900359500, -78.04886637407554],
    [39.38232163609908, -78.04896890942119],
    [39.38238194548924, -78.04907682727200],
    [39.38243112715930, -78.04919757869591],
    [39.38247422412799, -78.04929979218140],
    [39.38250104604367, -78.04940428438158],
    [39.38253479598895, -78.04947924457569],
    [39.38257239484832, -78.04949242717674],
    [39.38262545848209, -78.04946590479871],
    [39.38270523853065, -78.04941658895284]
]


// -- Custom Components -- //

// Continuously watch position and update a shared ref + marker
export function LocateControl() {
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
          locationMarkerRef.current = L.marker([lat, lng], { icon: locationIcon }).addTo(map);
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
                {/* -- Map Tile Layer -- */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    maxZoom={19}
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

                {/* -- Zones -- */}

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
                        <a href='/activities/flower-fields'>See More</a>
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

                <Polygon
                    positions={meadowPolyCoords}
                    color='green'
                >
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 50]}>
                        MEADOW
                    </Tooltip>
                </Polygon>

                <Polygon
                    positions={natureMazePolyCoords}
                    color='green'
                >
                    <Tooltip className={styles.pTooltip} permanent direction='center' offset={[0, 0]}>
                        NATURE MAZE
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
                        <span>Stocks Photo Op</span>
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
                        <span>Photo Op: Big Chair</span>
                        <img src='/placeholder.png'></img>
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
                    <Tooltip className={styles.pIconTooltip} permanent direction='center' offset={[0, 30]}>
                        Hay Rides
                    </Tooltip>
                </Marker>
                <Marker
                    position={[39.3839874682358, -78.04320299524723]}
                    icon={playsetIcon}
                >
                    <Tooltip className={styles.pIconTooltip} permanent direction='center' offset={[0, 30]}>
                        Playground
                    </Tooltip>
                </Marker>
                <Marker
                    position={[39.38348206851645, -78.04264639224952]}
                    icon={animalIcon}
                >
                    <Popup><a href='/activities/petting-zoo'>See More</a></Popup>
                    <Tooltip className={styles.pIconTooltip} permanent direction='center' offset={[0, 30]}>
                        Petting Zoo
                    </Tooltip>
                </Marker>
                <Marker
                    position={[39.382430004649066, -78.04272123387958]}
                    icon={footballIcon}
                >
                    <Tooltip className={styles.pIconTooltip} permanent direction='center' offset={[0, 30]}>
                        Football Nets
                    </Tooltip>
                </Marker>
                <Marker
                    position={[39.38309209277666, -78.04276937553388]}
                    icon={foodIcon}
                >
                    <Popup><a href='/vendors'>See More</a></Popup>
                    <Tooltip className={styles.pIconTooltip} permanent direction='center' offset={[0, 30]}>
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
                <Polyline
                    positions={hillLanePath}
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
