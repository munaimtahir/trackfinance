name: Bug report
description: Report an error or malfunction in TrackFinance
title: "[Bug] "
labels: ["bug"]
body:
  - type: markdown
    attributes:
      value: |
        ## Bug description
        Please describe clearly what went wrong.

  - type: textarea
    id: steps
    attributes:
      label: Steps to reproduce
      description: What sequence of actions leads to the bug?
      placeholder: "1. Open the app → 2. Tap Add Bill → 3. Crash appears..."
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected behavior
      placeholder: "Describe what you expected to happen."

  - type: textarea
    id: actual
    attributes:
      label: Actual behavior
      placeholder: "Describe what actually happened."

  - type: input
    id: environment
    attributes:
      label: Environment
      placeholder: "Device model, Android version, app build, commit hash…"

  - type: checkboxes
    id: checklist
    attributes:
      label: Verification checklist
      description: Tick items after confirming them.
      options:
        - label: I reproduced this issue myself
        - label: I attached console logs / screenshots (if applicable)
        - label: I verified it happens on the latest main branch
        - label: I added clear reproduction steps

  - type: textarea
    id: extra
    attributes:
      label: Additional context
      description: Anything else that might help investigate this bug.
