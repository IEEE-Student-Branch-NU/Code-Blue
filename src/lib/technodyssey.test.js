import test from 'node:test'
import assert from 'node:assert/strict'
import * as td from './technodyssey.js'
import { SCHEDULE } from './technodysseyEvents.js'

test('the fest starts on the first scheduled day and ends on the last', () => {
    assert.equal(td.FEST_START.toISOString(), '2026-09-25T03:30:00.000Z')  // 09:00 IST
    assert.equal(td.FEST_END.toISOString(), '2026-09-27T08:30:00.000Z')    // 14:00 IST
})

test('the date label matches the schedule', () => {
    assert.equal(td.DATE_LABEL, '25–27 September 2026')
    assert.equal(SCHEDULE[0].iso, td.FEST_START.toISOString().slice(0, 10))
})

test('the fest ends when the last scheduled row ends', () => {
    const last = SCHEDULE.at(-1)
    const lastRow = last.rows.at(-1)
    assert.equal(
        td.FEST_END.getTime(),
        new Date(`${last.iso}T${lastRow.to}:00+05:30`).getTime(),
    )
})

test('TRACKS has been retired in favour of EVENTS', () => {
    assert.equal(td.TRACKS, undefined)
})
