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
