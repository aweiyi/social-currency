# Feature Requirement Document: Control Panel

## Feature Name

Control Panel

## Goal

Give the user a visible control panel to play, pause, change simulation speed, reset the simulation, and see the current tick so they can run and observe the FavourNet economy over time.

## User Story

As a user exploring the FavourNet simulation, I want to start, pause, speed up or slow down, and reset the simulation, and see which “day” (tick) we’re on, so that I can control the run and correlate what I see in the dashboard with time.

## Functional Requirements

1. **Play / Pause** — A single control (button or toggle) that starts the simulation loop when paused and stops it when playing. While playing, the store’s “run one tick” action is called on an interval.
2. **Simulation speed** — A control (dropdown, slider, or preset buttons) that sets how often a tick runs (e.g. 1x = one tick per second, 2x = two per second, 0.5x = one every 2 seconds). The interval is configurable and reflected in the UI (e.g. “1x”, “2x”).
3. **Current tick display** — The current tick (simulation “day”) is shown and updates every tick while the simulation is running. It reflects the value from the Zustand store.
4. **Reset** — A reset control that: (a) stops the simulation if playing, (b) reinitialises the store to initial state (agents from seed, empty transactions/tokens, pool zeroed, tick 0). No page reload required.
5. **Wiring** — The panel reads state (playing, speed, tick) from the store and dispatches actions (play, pause, setSpeed, reset). The run loop uses the same store and engine as defined in the State and Simulation Engine FRED.

## Data Requirements

- **Reuse**: Store from state-and-simulation-engine (agents, transactions, tokens, pool, tick, runTick, reset).
- **New**: Store may expose `isPlaying` (boolean), `speed` (number or enum, e.g. 1, 2, 0.5), and actions `setPlaying`, `setSpeed`, `reset`. Alternatively, play state and speed can live in React state and only the store’s `runTick` and `reset` are used; either approach is acceptable as long as the interval is cleared on pause and reset.

## User Flow

1. User opens the app and sees the control panel (e.g. Play, Pause, Speed, Tick, Reset).
2. User clicks Play → simulation starts; tick display increments at the chosen speed.
3. User changes speed (e.g. to 2x) → tick advances faster.
4. User clicks Pause → tick stops incrementing.
5. User clicks Reset → simulation pauses, tick goes to 0, data reinitialises; user can click Play again to start from scratch.
6. User may click Play again after Pause without reset → simulation continues from current tick.

## Acceptance Criteria

- [ ] Play/Pause control exists and correctly starts and stops the simulation loop.
- [ ] Speed control exists and changes the interval between ticks (at least two distinct speeds work).
- [ ] Current tick is displayed and updates every tick while playing.
- [ ] Reset stops the simulation, reinitialises store to seed state, and sets tick to 0; Play can be used again after Reset.
- [ ] No memory leak: interval is cleared when Pause or Reset is triggered.
- [ ] UI is visible and usable (e.g. in a header or sidebar); no requirement for exact layout.

## Edge Cases

- **Rapid Play/Pause/Reset**: Multiple clicks in quick succession should not leave multiple intervals running; only one timer runs when playing.
- **Reset while playing**: Reset must clear the interval and then reinitialise state.
- **Tab in background**: Browser may throttle timers; tick may advance more slowly when tab is not focused—acceptable; no requirement to compensate.
- **Very high speed**: If speed is very high (e.g. 10x), ensure a single tick completes before the next is scheduled (e.g. cap speed or skip frames if tick takes longer than interval).

## Non-Functional Requirements

- **Responsiveness**: Play/Pause and Reset respond immediately (no perceptible delay).
- **Clarity**: User can tell at a glance whether the simulation is playing or paused and what the current tick is.
