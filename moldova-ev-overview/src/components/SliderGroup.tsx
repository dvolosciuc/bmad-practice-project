import { useTranslation } from 'react-i18next'
import type { InputState, FuelType, ChargingMode } from '../lib/types'
import SliderInput from './SliderInput'
import SegmentedControl from './SegmentedControl'

interface SliderGroupProps {
  inputs: InputState
  onChange: <K extends keyof InputState>(key: K, value: InputState[K]) => void
}

export default function SliderGroup({ inputs, onChange }: SliderGroupProps) {
  const { t } = useTranslation()

  const fuelOptions: { value: FuelType; label: string }[] = [
    { value: 'benzina95', label: t('slider.benzina95') },
    { value: 'motorina', label: t('slider.motorina') },
    { value: 'gpl', label: t('slider.gpl') },
  ]

  const chargingOptions: { value: ChargingMode; label: string }[] = [
    { value: 'home_ac', label: t('slider.homeAC') },
    { value: 'public_ac', label: t('slider.publicAC') },
    { value: 'public_dc', label: t('slider.publicDC') },
  ]

  return (
    <div className="flex flex-col gap-6">
      <SliderInput
        id="km-per-month"
        label={t('slider.kmPerMonth')}
        value={inputs.kmPerMonth}
        min={300}
        max={3000}
        step={100}
        unit={t('slider.kmUnit')}
        hint={t('slider.kmPerMonthHint')}
        onChange={(v) => onChange('kmPerMonth', v)}
        ariaValueText={`${inputs.kmPerMonth} ${t('slider.kmUnit')}`}
      />
      <SegmentedControl
        options={fuelOptions}
        value={inputs.fuelType}
        onChange={(v) => onChange('fuelType', v)}
        label={t('slider.fuelType')}
      />
      <SegmentedControl
        options={chargingOptions}
        value={inputs.chargingMode}
        onChange={(v) => onChange('chargingMode', v)}
        label={t('slider.chargingMode')}
      />
    </div>
  )
}
