import { useEffect, useState } from 'react'
import { getCountdown } from './technodyssey'

/* Ticks the fest countdown once a second.
 * Background tabs throttle setInterval, so we also resync whenever the
 * tab becomes visible again rather than trusting the tick count. */
export const useCountdown = () => {
    const [countdown, setCountdown] = useState(getCountdown)

    useEffect(() => {
        const tick = () => setCountdown(getCountdown())
        const id = setInterval(tick, 1000)
        document.addEventListener('visibilitychange', tick)

        return () => {
            clearInterval(id)
            document.removeEventListener('visibilitychange', tick)
        }
    }, [])

    return countdown
}

export default useCountdown
