import L from 'leaflet';
import styles from '@/components/photoOpsMap.module.css';

import entrance from '../icons/entrance.svg?raw';
import photoOp from '../icons/photoOp.svg?raw';
import tractor from '../icons/tractor.svg?raw';
import animal from '../icons/animal.svg?raw';
import bathroom from '../icons/bathroom.svg?raw';
import food from '../icons/food.svg?raw';
import football from '../icons/football.svg?raw';
import location from '../icons/location.svg?raw';
import playset from '../icons/playset.svg?raw';
import flower from '../icons/flower.svg?raw';
import maze from '../icons/maze.svg?raw';
import clearing from '../icons/clearing.svg?raw';
import arrowLeft from '../icons/arrow-left.svg?raw';
import arrowSquareOut from '../icons/arrow-square-out.svg?raw';
import map from '../icons/map.svg?raw';

export function makeIcon({ svg, className = styles.marker, size = 24, anchor = size / 2 }) {
    console.log(svg)
    return new L.DivIcon({
        className: className,
        html: `<div>${svg}</div>`,
        iconSize: [size, size],
        iconAnchor: [anchor, anchor],
        popupAnchor: [0, -anchor]
    })
}

export const icons = {
    entrance: makeIcon({ svg: entrance}),
    photoOp: makeIcon({ svg: photoOp }),
    tractor: makeIcon({ svg: tractor }),
    animal: makeIcon({ svg: animal }),
    bathroom: makeIcon({ svg: bathroom }),
    food: makeIcon({ svg: food }),
    football: makeIcon({ svg: football }),
    location: makeIcon({ svg: location }),
    playset: makeIcon({ svg: playset, className: styles.marker + ' ' + styles.t, size: 30 }),
    flower: makeIcon({ svg: flower }),
    maze: makeIcon({ svg: maze }),
    clearing: makeIcon({ svg: clearing }),
    arrowLeft: makeIcon({ svg: arrowLeft }),
    arrowSquareOut: makeIcon({ svg: arrowSquareOut }),
    map: makeIcon({ svg: map })
}

export default icons;