# Launch QA inventory

Check the shelf, filters, surprise button, direct hashes, all-game links, copy link, unknown-route recovery, and About & data with score clearing. Test desktop and phone widths with no horizontal overflow. Verify no missing resources or app console errors.

| Experience | Controls and states |
| --- | --- |
| City Tycoon | Roll, buy, skip, AI turn, rent, pass START, bankruptcy, round limit, reset |
| Spend a Crore | Buy, sell, zero quantity, unaffordable purchase, receipt, reset |
| Gully Cricket | Timing marker, six shot results, end screen, replay, best score |
| Chai Tapri | Ticket hide/reveal, ingredient toggle, correct/incorrect order, five-order finish, reset |
| Bargain Bazaar | Numeric offer validation, rejected offer, counteroffer, accept, walk away, budget, three-stall finish, replay |
| Dabba Memory | Reveal, mismatch lock, pair match, six-pair finish, reset during play |
| Perfect Roti | Touch/pointer drawing, short/invalid stroke, circle score, keyboard timing mode, reset |
| Train Window | Canvas rendering, light, speed, pause/resume, reduced motion startup |

Edge cases: navigate away during a mismatch timeout and an animation; unknown hash; storage unavailable; empty drawing; overspending; repeated purchase; reloading a deep link.

Engine tests cover monetary conservation and boundaries, board events, drawing scoring, shot scoring, offers and shuffling. Browser tests cover rendered controls and session flow. Visual checks cover the shelf and representative games at desktop and mobile sizes.

## Release 1.1 checks

Seat, Please: select, place, swap, reserved seats, invalid allocation, hint, all five solutions, reset and completion. Masala Lab: mixing, failed mix, repeat discovery, all 21 results, persistence, corrupted saves, hints and reset. Society Pass: cumulative reveals, earlier-rule regression, whole-word matching, hints, submit and restart. Check all three at desktop and 320px phone width. Confirm the built page loads hashed modules and every emitted dependency exists; verify the live release manifest against the local build.

## Release 1.2 checks

Complete and retry a daily over; pause/resume a delivery; leave a ball unplayed; use keyboard input and gentle pace; test reduced motion; copy a dated score link; clear daily records. Buy and sell batches, buy the maximum affordable quantity, exhaust the budget and display a large quantity on a phone. Return from a low shelf tile and the daily strip to verify scroll and focus restoration. Open the recommended games. Check the field and primary cricket action together at a short desktop and a narrow phone size.

## Release 1.3 checks

Verify all eleven preview assets load and all gallery links and filters work. Check the plain visitor form through approval and reset. Confirm the mascot, fake stationery header and tilted approval stamp are absent. Inspect every main screen at 320px for horizontal overflow and inspect the gallery/form on desktop. Preserve all game rules and local storage keys.
