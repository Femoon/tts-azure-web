import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Slider, SliderValue } from '@nextui-org/slider'
const ConfigSlider = ({
  label,
  value,
  minValue,
  maxValue,
  onChange,
  reset,
  suffix = '%',
}: {
  label: string
  value: number
  minValue: number
  maxValue: number
  onChange: (value: SliderValue) => void
  reset: () => void
  suffix?: string
}) => (
  <div className="pb-5">
    <section className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <p className="shrink-0">{label}</p>
        <FontAwesomeIcon icon={faRotateRight} className="text-gray-500 cursor-pointer" onClick={reset} />
      </div>
      <p>
        {value >= 0 && '+'}
        {value}
        {suffix}
      </p>
    </section>
    <Slider
      size="sm"
      step={1}
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      aria-label={label}
      onChange={onChange}
      classNames={{
        track: 'border-s-primary-100',
        filler: 'bg-gradient-to-r from-primary-100 to-primary-500',
      }}
    />
  </div>
)

export default ConfigSlider
