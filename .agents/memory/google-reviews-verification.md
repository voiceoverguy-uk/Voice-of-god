---
name: Google reviews verification
description: Google can restrict signed-out desktop review visibility even with an official reviews URI.
---

Do not treat reaching the correct Google Maps business as a successful direct-reviews test.

**Why:** A fresh signed-out desktop test of the Places API's official reviewsUri showed Google's “limited view” without reviews, while a fresh mobile-emulated context selected Reviews and displayed customer reviews using the same URL.

**How to apply:** Verify actual review content in each browser context, distinguish mobile emulation from physical-device app handoff, and report Google's restrictions rather than replacing its official URL with a guessed deep link.