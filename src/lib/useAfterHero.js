import { useEffect, useState } from 'react'

/* True once the reader has left the first screen behind.
 *
 * Home's hero already carries Technodyssey, so anything that would
 * repeat the fest — or cover the composition — waits for this. Every
 * other page passes `false` and shows straight away.
 *
 * Pass `wait` as a value that is stable for the life of the mount;
 * callers that can flip it should remount instead, so a surface that
 * has already been seen never retreats. */
export const useAfterHero = (wait) => {
    const [passed, setPassed] = useState(!wait)

    useEffect(() => {
        if (passed) return

        const check = () => {
            if (window.scrollY > window.innerHeight * 0.85) {
                setPassed(true)
                window.removeEventListener('scroll', check)
            }
        }

        check()  // a deep link or a restored scroll position is already past it
        window.addEventListener('scroll', check, { passive: true })
        return () => window.removeEventListener('scroll', check)
    }, [passed])

    return passed
}

export default useAfterHero
