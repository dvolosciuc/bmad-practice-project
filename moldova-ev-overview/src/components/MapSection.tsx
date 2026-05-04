import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import { fetchOCMStations } from '../lib/ocmFetch'
import type { OCMStation } from '../lib/ocmFetch'
import { useInView } from '../lib/useInView'
import 'leaflet/dist/leaflet.css'

// Moldova bounding box centre
const MOLDOVA_CENTER: [number, number] = [47.0, 28.5]
const MOLDOVA_ZOOM = 7

export default function MapSection() {
  const { t } = useTranslation()
  const [stations, setStations] = useState<OCMStation[]>([])
  const [loading, setLoading] = useState(true)
  const [ref] = useInView()

  useEffect(() => {
    fetchOCMStations().then((data) => {
      setStations(data)
      setLoading(false)
    })
  }, [])

  return (
    <section id="map" ref={ref as React.RefObject<HTMLElement>} className="section-enter py-10 md:py-14 lg:py-16">
      <div className="max-w-[720px] mx-auto px-6 mb-6">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ev-accent font-medium mb-2">
          {t('map.sectionLabel')}
        </p>
        <h2 className="text-4xl font-bold text-ev-text mb-2">{t('map.sectionTitle')}</h2>
        <p className="text-ev-muted text-sm">
          {t('map.subline')}{' '}
          <a
            href="https://www.plugshare.com/?location=Moldova"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ev-accent underline-offset-2 hover:underline"
          >
            {t('map.plugshare')} ↗
          </a>
        </p>
      </div>

      <div className="relative w-full h-[60vh] min-h-[320px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-ev-surface z-10">
            <div className="w-8 h-8 rounded-full border-2 border-ev-surface-2 border-t-ev-accent animate-spin" />
          </div>
        )}
        <MapContainer
          center={MOLDOVA_CENTER}
          zoom={MOLDOVA_ZOOM}
          scrollWheelZoom={false}
          className="w-full h-full"
          style={{ background: '#0f1117' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            maxZoom={19}
          />
          {stations.map((s, i) => (
            <CircleMarker
              key={i}
              center={[s.lat, s.lng]}
              radius={6}
              pathOptions={{
                color: '#2dd4bf',
                fillColor: '#2dd4bf',
                fillOpacity: 0.85,
                weight: 1,
              }}
            />
          ))}
        </MapContainer>
      </div>
    </section>
  )
}
