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
        unit="km/lună"
        hint={t('slider.kmPerMonthHint')}
        onChange={(v) => onChange('kmPerMonth', v)}
        ariaValueText={`${inputs.kmPerMonth} km pe lună`}
      />
      <SegmentedControl
        options={fuelOptions}
        value={inputs.fuelType}
        onChange={(v) => onChange('fuelType', v)}
        label={t('slider.fuelType')}
      />
      <SliderInput
        id="vehicle-weight"
        label={t('slider.vehicleWeight')}
        value={inputs.vehicleWeightKg}
        min={500}
        max={5000}
        step={50}
        unit="kg"
        hint={t('slider.vehicleWeightHint')}
        onChange={(v) => onChange('vehicleWeightKg', v)}
        ariaValueText={`${inputs.vehicleWeightKg} kg`}
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
