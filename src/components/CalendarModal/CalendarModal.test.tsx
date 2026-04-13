import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CalendarModal from './CalendarModal'
import { Series } from '../../data/official-sessions'
import * as calendarHelpers from '../../lib/calendar-helpers'

// vi.mock is hoisted to the top of the file by Vitest's transform, so it runs
// before any imports resolve — that's what lets it intercept the module.
// We use the async factory form to spread in the real implementations, then
// override only downloadCalendar with a spy. This keeps isSpecialSession,
// parseTime, etc. working so the rest of the component renders correctly.
vi.mock('../../lib/calendar-helpers', async (importOriginal) => {
    const actual = await importOriginal<typeof calendarHelpers>()
    return { ...actual, downloadCalendar: vi.fn() }
})

// A minimal series to use across tests. Two sessions: one plain, one special.
// Having a known fixture means our assertions don't depend on real data changing.
const mockSeries: Series = {
    seriesId: 'test-series',
    shortLabel: 'Test',
    label: 'Test Series',
    cars: ['Car A', 'Car B'],
    links: { discord: 'https://discord.gg/test' },
    sessions: [
        { sessionDay: 3, sessionTimeGmt: '19:00' },                            // plain
        { sessionDay: 6, sessionTimeGmt: '17:00', notes: ['Broadcasted', 'SOF Session'] }, // special
    ],
}

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('CalendarModal rendering', () => {
    it('renders the series label as the modal title', () => {
        render(<CalendarModal series={mockSeries} onClose={() => {}} />)
        // getByRole('heading') finds <h1>–<h6> elements. Pairing it with
        // { name: /.../ } matches the accessible name — the visible text.
        // This is the preferred query because it mirrors how screen readers work.
        expect(screen.getByRole('heading', { name: /Test Series/ })).toBeInTheDocument()
    })

    it('renders a checkbox for each session', () => {
        render(<CalendarModal series={mockSeries} onClose={() => {}} />)
        // getAllByRole returns an array — useful when you expect multiple matches.
        const checkboxes = screen.getAllByRole('checkbox')
        expect(checkboxes).toHaveLength(2)
    })

    it('pre-selects special sessions (SOF / Broadcasted)', () => {
        render(<CalendarModal series={mockSeries} onClose={() => {}} />)
        const checkboxes = screen.getAllByRole('checkbox')
        // The plain session should NOT be pre-checked
        expect(checkboxes[0]).not.toBeChecked()
        // The SOF+Broadcasted session SHOULD be pre-checked
        expect(checkboxes[1]).toBeChecked()
    })

    it('disables the download button when no sessions are selected', () => {
        // Our fixture pre-selects 1 of 2 sessions. We need a series where
        // nothing is pre-selected to test the disabled state at mount.
        const noSpecialSeries: Series = {
            ...mockSeries,
            sessions: [
                { sessionDay: 3, sessionTimeGmt: '19:00' },
                { sessionDay: 1, sessionTimeGmt: '01:00' },
            ],
        }
        render(<CalendarModal series={noSpecialSeries} onClose={() => {}} />)
        expect(screen.getByRole('button', { name: /Download Calendar/ })).toBeDisabled()
    })

    it('shows the count of selected sessions in the download button', () => {
        render(<CalendarModal series={mockSeries} onClose={() => {}} />)
        // 1 session is pre-selected (the SOF one)
        expect(screen.getByRole('button', { name: /1 session\b/ })).toBeInTheDocument()
    })
})

// ─── Interactions ─────────────────────────────────────────────────────────────
//
// userEvent simulates real browser events — it moves the mouse, fires
// pointerdown/up/click in sequence — rather than just firing a synthetic
// click. This makes tests closer to what users actually experience.

describe('CalendarModal interactions', () => {
    it('calls onClose when the × button is clicked', async () => {
        // vi.fn() creates a mock function so we can assert it was called.
        const onClose = vi.fn()
        render(<CalendarModal series={mockSeries} onClose={onClose} />)

        // userEvent methods are async — always await them.
        await userEvent.click(screen.getByRole('button', { name: '✕' }))
        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when the overlay backdrop is clicked', async () => {
        const onClose = vi.fn()
        render(<CalendarModal series={mockSeries} onClose={onClose} />)

        // The overlay div doesn't have a role, so we find it by its CSS class.
        // This is a last resort — role and text queries are always preferred.
        const overlay = document.querySelector('.calendar-modal-overlay')!
        await userEvent.click(overlay)
        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('Select All checks every session', async () => {
        render(<CalendarModal series={mockSeries} onClose={() => {}} />)
        await userEvent.click(screen.getByRole('button', { name: 'Select All' }))

        const checkboxes = screen.getAllByRole('checkbox')
        checkboxes.forEach(cb => expect(cb).toBeChecked())
    })

    it('Select None unchecks every session', async () => {
        render(<CalendarModal series={mockSeries} onClose={() => {}} />)
        await userEvent.click(screen.getByRole('button', { name: 'Select None' }))

        const checkboxes = screen.getAllByRole('checkbox')
        checkboxes.forEach(cb => expect(cb).not.toBeChecked())
    })

    it('download button is disabled after Select None', async () => {
        render(<CalendarModal series={mockSeries} onClose={() => {}} />)
        await userEvent.click(screen.getByRole('button', { name: 'Select None' }))
        expect(screen.getByRole('button', { name: /Download Calendar/ })).toBeDisabled()
    })

    it('toggling a checkbox changes the selected count', async () => {
        render(<CalendarModal series={mockSeries} onClose={() => {}} />)

        // Start: 1 pre-selected. Click the first (unchecked) checkbox to add it.
        const checkboxes = screen.getAllByRole('checkbox')
        await userEvent.click(checkboxes[0])

        expect(screen.getByRole('button', { name: /2 sessions/ })).toBeInTheDocument()
    })

    it('clicking a checked checkbox deselects it', async () => {
        render(<CalendarModal series={mockSeries} onClose={() => {}} />)

        // The second checkbox is pre-checked — click it to deselect
        const checkboxes = screen.getAllByRole('checkbox')
        await userEvent.click(checkboxes[1])

        expect(checkboxes[1]).not.toBeChecked()
    })
})

// ─── Download handler ─────────────────────────────────────────────────────────

describe('CalendarModal download handler', () => {
    beforeEach(() => {
        vi.mocked(calendarHelpers.downloadCalendar).mockReset()
    })

    it('calls downloadCalendar with the series and selected sessions', async () => {
        render(<CalendarModal series={mockSeries} onClose={() => {}} />)
        await userEvent.click(screen.getByRole('button', { name: /Download Calendar/ }))
        expect(calendarHelpers.downloadCalendar).toHaveBeenCalledWith(
            mockSeries,
            expect.any(Set)
        )
    })

    it('calls onClose after a successful download', async () => {
        const onClose = vi.fn()
        render(<CalendarModal series={mockSeries} onClose={onClose} />)
        await userEvent.click(screen.getByRole('button', { name: /Download Calendar/ }))
        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('shows an alert and does not close when downloadCalendar throws', async () => {
        vi.mocked(calendarHelpers.downloadCalendar).mockImplementation(() => {
            throw new Error('ICS generation failed')
        })
        vi.spyOn(window, 'alert').mockImplementation(() => {})
        const onClose = vi.fn()

        render(<CalendarModal series={mockSeries} onClose={onClose} />)
        await userEvent.click(screen.getByRole('button', { name: /Download Calendar/ }))

        expect(window.alert).toHaveBeenCalledWith('ICS generation failed')
        expect(onClose).not.toHaveBeenCalled()
    })

    it('shows the fallback alert message when a non-Error is thrown', async () => {
        vi.mocked(calendarHelpers.downloadCalendar).mockImplementation(() => {
            // eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw 'string error'
        })
        vi.spyOn(window, 'alert').mockImplementation(() => {})

        render(<CalendarModal series={mockSeries} onClose={() => {}} />)
        await userEvent.click(screen.getByRole('button', { name: /Download Calendar/ }))

        expect(window.alert).toHaveBeenCalledWith('Error generating calendar. Please try again.')
    })
})
