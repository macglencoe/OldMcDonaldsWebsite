'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'



export default function PhotoOpsMap() {

    return (
        <div style={{ height: '600px', width: '100%' }}>
            <MapContainer
                center={[39.383299, -78.044590]} // ← Your coordinates go here
                zoom={15}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker
                    position={[39.383299, -78.044590]}
                    icon={L.icon({
                        className: '',
                        html: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M117.7-302.31v-355.38h59.99v355.38H117.7Zm110.76 73.85v-362.31q0-58.31 41.35-99.54 41.35-41.23 99.42-41.23h221.54q58.31 0 99.54 41.23 41.23 41.23 41.23 99.54v362.31H228.46Zm553.85-73.85v-355.38h59.99v355.38h-59.99ZM480-480ZM288.46-288.46H450V-450h-73.84v-60H450v-161.54h-80.82q-33.33 0-57.03 23.73-23.69 23.72-23.69 57.04v302.31Zm221.54 0h161.54v-302.31q0-33.32-23.73-57.04-23.72-23.73-57.04-23.73H510V-510h73.84v60H510v161.54Z"/></svg>`
                    })}
                >
                    <Popup>
                        This is the entrance to the pumpkin patch!
                    </Popup>
                </Marker>
            </MapContainer>

        </div>
    )
}
