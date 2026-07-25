/* The launch control and the anomaly never import each other — the
 * button says a pulse happened, the field decides what that looks
 * like. Kept out of the component files so fast refresh stays happy. */

export const PULSE_EVENT = 'technodyssey:pulse'

export const emitPulse = () => {
    window.dispatchEvent(new CustomEvent(PULSE_EVENT))
}

/* The hero announces when its cold open is over. Anything that would
 * otherwise interrupt the darkness waits for this instead of guessing
 * at a delay. */
export const READY_EVENT = 'technodyssey:ready'

export const emitReady = () => {
    window.dispatchEvent(new CustomEvent(READY_EVENT))
}
