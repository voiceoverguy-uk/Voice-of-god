---
name: Shared Google reviews
description: Review ownership/attribution and a deployment verification constraint.
---

Guy's Google stars and reviews belong to Guy/VoiceoverGuy and may be displayed on VoiceOfGod as a shared source, not as a separate VoiceOfGod-only collection.

**Why:** The owner explicitly confirmed “The stars and reviews are still mine.”

**How to apply:** Keep the attractive numeric/star display when validated data is available, with clear Guy Harris / VoiceoverGuy attribution. Do not change VoiceoverGuy code to implement this.

Verify serverless dependencies under native, unbundled Node ESM as well as the Express build.

**Why:** Bundled tests resolved extensionless imports that failed before handler invocation under native ESM, masking a production startup defect.

**How to apply:** Preserve native-Node import coverage when changing shared modules used by serverless handlers; a passing bundled build is not sufficient.