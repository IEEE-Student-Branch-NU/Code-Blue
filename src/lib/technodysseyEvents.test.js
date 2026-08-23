import test from 'node:test'
import assert from 'node:assert/strict'
import {
    SOCIETIES, EVENTS, SCHEDULE, TRACK_COUNT,
    getEvent, societyOf, formatTime, formatRange,
    buildRuns, eventSchedule, currentSlot,
} from './technodysseyEvents.js'

test('every event names a society that exists', () => {
    for (const e of EVENTS) {
        assert.ok(SOCIETIES[e.society], `unknown society ${e.society} on ${e.id}`)
    }
})

test('every scheduled slot names an event that exists', () => {
    for (const day of SCHEDULE) {
        for (const row of day.rows) {
            if (row.lunch) continue
            assert.equal(row.slots.length, TRACK_COUNT)
            for (const id of row.slots) {
                if (id === null) continue
                assert.ok(getEvent(id), `unknown event ${id}`)
            }
        }
    }
})

test('the fest runs Friday to Sunday, 25-27 September 2026', () => {
    assert.deepEqual(SCHEDULE.map((d) => d.iso),
        ['2026-09-25', '2026-09-26', '2026-09-27'])
    assert.deepEqual(SCHEDULE.map((d) => d.day),
        ['Friday', 'Saturday', 'Sunday'])
})

test('Friday is present but has no rows yet', () => {
    assert.equal(SCHEDULE[0].rows.length, 0)
})

test('formatTime drops a zero minute and uses a 12-hour clock', () => {
    assert.equal(formatTime('09:00'), '9 AM')
    assert.equal(formatTime('12:00'), '12 PM')
    assert.equal(formatTime('13:30'), '1:30 PM')
    assert.equal(formatTime('00:00'), '12 AM')
})

test('formatRange prints one meridiem when both ends share it', () => {
    assert.equal(formatRange('13:00', '17:00'), '1 – 5 PM')
    assert.equal(formatRange('08:00', '10:00'), '8 – 10 AM')
    assert.equal(formatRange('12:00', '13:00'), '12 – 1 PM')
})

test('formatRange keeps both when the range crosses noon', () => {
    assert.equal(formatRange('09:00', '12:00'), '9 AM – 12 PM')
})

test('buildRuns merges contiguous identical slots in a column', () => {
    const saturday = SCHEDULE[1]
    const [voices] = buildRuns(saturday)
    assert.equal(voices.length, 2)
    assert.deepEqual(voices[0], {
        eventId: 'voices-in-motion', fromRow: 0, span: 1, from: '09:00', to: '12:00',
    })
    assert.deepEqual(voices[1], {
        eventId: 'voices-in-motion', fromRow: 2, span: 2, from: '13:00', to: '17:00',
    })
})

test('buildRuns never merges across lunch', () => {
    const sunday = SCHEDULE[2]
    const lineFollower = buildRuns(sunday)[1]
    assert.equal(lineFollower.length, 2)
    assert.equal(lineFollower[0].span, 2)
    assert.equal(lineFollower[0].to, '12:00')
    assert.equal(lineFollower[1].fromRow, 3)
    assert.equal(lineFollower[1].span, 1)
})

test('buildRuns leaves distinct neighbours unmerged', () => {
    const saturday = SCHEDULE[1]
    const third = buildRuns(saturday)[2]
    assert.deepEqual(third.map((r) => r.eventId),
        ['stellar-shield', 'art-workshop', 'embedded-system'])
    assert.ok(third.every((r) => r.span === 1))
})

test('buildRuns skips empty slots without emitting a run', () => {
    const sunday = SCHEDULE[2]
    const [itss, , embedded] = buildRuns(sunday)
    assert.equal(itss.length, 1)
    assert.equal(itss[0].span, 2)
    assert.equal(embedded.length, 1)
})

test('buildRuns returns empty columns for a day with no rows', () => {
    const runs = buildRuns(SCHEDULE[0])
    assert.equal(runs.length, TRACK_COUNT)
    assert.ok(runs.every((c) => c.length === 0))
})

test('eventSchedule reports every run an event has, in order', () => {
    assert.deepEqual(
        eventSchedule('novahack').map((s) => s.label),
        ['Saturday · 9 AM – 12 PM', 'Saturday · 1 – 5 PM'],
    )
    assert.deepEqual(
        eventSchedule('embedded-system').map((s) => s.label),
        ['Saturday · 3 – 5 PM', 'Sunday · 8 AM – 12 PM'],
    )
})

test('societyOf resolves an event to its society record', () => {
    assert.equal(societyOf(getEvent('line-follower')).accent, '#5ec9d8')
    assert.equal(societyOf(getEvent('novahack')).code, 'CS')
})

test('currentSlot finds the row covering a moment inside the fest', () => {
    const during = new Date('2026-09-26T14:00:00+05:30').getTime()
    assert.deepEqual(currentSlot(during), { dayIndex: 1, rowIndex: 2 })
})

test('currentSlot returns null outside the fest', () => {
    assert.equal(currentSlot(new Date('2026-09-01T10:00:00+05:30').getTime()), null)
    assert.equal(currentSlot(new Date('2026-09-26T12:30:00+05:30').getTime()), null)
})
