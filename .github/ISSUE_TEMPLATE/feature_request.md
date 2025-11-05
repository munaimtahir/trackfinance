name: Feature request
description: Suggest an enhancement or new idea for TrackFinance
title: "[Feature] "
labels: ["enhancement"]
body:
  - type: markdown
    attributes:
      value: |
        ## New idea
        Tell us about the enhancement or improvement you want.

  - type: textarea
    id: summary
    attributes:
      label: Summary
      description: Briefly describe the requested feature or change.
      placeholder: "Example: Add categories for bills (Electricity, Gas, Internet...)"

  - type: textarea
    id: motivation
    attributes:
      label: Why
      description: Why is this feature useful or necessary?
      placeholder: "It will help group payments and improve monthly summaries."

  - type: textarea
    id: implementation
    attributes:
      label: Proposed solution
      description: Describe how it might work (in simple terms).
      placeholder: "A dropdown on Add Bill screen with predefined categories."

  - type: checkboxes
    id: checklist
    attributes:
      label: Implementation checklist
      description: Keep track of progress as you build or review this feature.
      options:
        - label: Feature aligns with project goals (docs/Goals.md)
        - label: Design approved or matches app simplicity guidelines
        - label: Code implemented and builds successfully
        - label: Tests written and passing (100% coverage for new code)
        - label: Docs updated (Goals/DataModel/QA-Checklist)
        - label: Manual testing on Android completed

  - type: textarea
    id: notes
    attributes:
      label: Additional notes
      description: Links, screenshots, references, or test data.
