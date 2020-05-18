import { useElapsedTime } from 'use-elapsed-time'
import { CountUpProps, CountUpReturnProps } from '../types'
import { useFormattedValue } from '../hooks'
import { getEasing, defaultEasing } from '../utils'

const defaultDuration = 2

const getDuration = (end?: number, duration?: number) => {
  if (typeof end !== 'number') {
    return undefined
  }

  return typeof duration === 'number' ? duration : defaultDuration
}

const useCountUp = (props: CountUpProps): CountUpReturnProps => {
  const {
    isCounting = false,
    start = 0,
    end,
    duration,
    easing = defaultEasing,
    onComplete,
    autoResetKey,
  } = props

  const durationValue = getDuration(end, duration)

  const { elapsedTime, reset } = useElapsedTime(isCounting, {
    duration: durationValue,
    onComplete,
    autoResetKey,
  })

  let rawValue

  if (durationValue === 0 && typeof end === 'number') {
    rawValue = end
  } else if (typeof end === 'number' && typeof durationValue === 'number') {
    const easingFn = getEasing(easing)
    // elapsedTime should always be less or equal to the durationValue
    const time = elapsedTime < durationValue ? elapsedTime : durationValue
    rawValue = easingFn(time, start, end - start, durationValue)
  } else {
    rawValue = start + elapsedTime
  }

  const value = useFormattedValue(rawValue, props)

  return { value, reset }
}

export { useCountUp }
