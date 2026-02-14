# Devin Case Study: CI/CD Pipeline Transformation

> How an AI agent transformed a broken CI pipeline into a modern, multi-stage test automation system in two working sessions.

---

## PR Sequence Timeline

```mermaid
gantt
    title Devin PR Timeline — Boozang TheLab
    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section Session 1 (Jan 28–29)
    PR #1  Access verification (closed)       :done, pr1, 2026-01-28, 1d
    PR #2  Fix frontend-backend integration    :done, pr2, 2026-01-28, 1d
    PR #3  Add .devin documentation            :done, pr3, 2026-01-28, 1d
    PR #4  Fix GitHub Actions workflow         :done, pr4, 2026-01-28, 1d
    PR #5  Add sequential test pipeline        :done, pr5, 2026-01-28, 1d
    PR #6  Fix workflow syntax                 :done, pr6, 2026-01-29, 1d

    section Session 2 (Feb 14)
    PR #12 Dependency audit and version pinning :done, pr12, 2026-02-14, 1d

    section Human PRs (Feb 14)
    PR #13 Add Devin trigger scripts           :done, pr13, 2026-02-14, 1d
    PR #14 Remove obsolete workflow            :done, pr14, 2026-02-14, 1d
```

## PR Dependency Graph

```mermaid
flowchart TD
    PR1["#1 Access Verification<br/><i>Closed — test only</i>"]
    PR2["#2 Fix Frontend-Backend<br/><i>Merged Jan 28</i>"]
    PR3["#3 Add .devin Docs<br/><i>Merged Jan 28</i>"]
    PR4["#4 Fix GitHub Actions<br/><i>Merged Jan 28</i>"]
    PR5["#5 Sequential Test Pipeline<br/><i>Merged Jan 28</i>"]
    PR6["#6 Fix Workflow Syntax<br/><i>Merged Jan 29</i>"]
    PR12["#12 Dependency Audit<br/><i>Merged Feb 14</i>"]
    PR13["#13 Devin Trigger Scripts<br/><i>Merged Feb 14 — Human</i>"]
    PR14["#14 Remove Old Workflow<br/><i>Merged Feb 14 — Human</i>"]

    PR1 -.->|"validated access"| PR2
    PR2 -->|"backend fixed"| PR4
    PR4 -->|"CI restored"| PR5
    PR5 -->|"syntax bug found"| PR6
    PR5 -->|"tests must pass"| PR12
    PR5 -->|"replaced old workflow"| PR14
    PR3 -.->|"documentation foundation"| PR13

    style PR1 fill:#f9f,stroke:#333,color:#000
    style PR2 fill:#bbf,stroke:#333,color:#000
    style PR3 fill:#bfb,stroke:#333,color:#000
    style PR4 fill:#bbf,stroke:#333,color:#000
    style PR5 fill:#bbf,stroke:#333,color:#000
    style PR6 fill:#bbf,stroke:#333,color:#000
    style PR12 fill:#bbf,stroke:#333,color:#000
    style PR13 fill:#fdb,stroke:#333,color:#000
    style PR14 fill:#fdb,stroke:#333,color:#000
```

### Legend

| Color | Meaning |
|-------|---------|
| Blue | Devin PR — merged |
| Pink | Devin PR — closed (test only) |
| Green | Devin PR — documentation |
| Orange | Human PR |

---

## PR Summary Table

| PR | Title | Author | Date | Status | Key Changes |
|----|-------|--------|------|--------|-------------|
| #1 | Access verification | Devin | Jan 28 | Closed | Dummy PR to validate repo access |
| #2 | Fix frontend-backend integration | Devin | Jan 28 | Merged | Proxy config, relative API paths, `getApiUrl()` helper |
| #3 | Add .devin documentation | Devin | Jan 28 | Merged | Journal, guidelines, commands, hooks |
| #4 | Fix GitHub Actions workflow | Devin | Jan 28 | Merged | Node 20, Docker runner, updated Boozang config |
| #5 | Sequential test pipeline | Devin | Jan 28 | Merged | 3-stage pipeline, Playwright tests, fixed 20 unit tests |
| #6 | Fix workflow syntax | Devin | Jan 29 | Merged | Replaced invalid `secrets` in `if` with env var pattern |
| #12 | Dependency audit | Devin | Feb 14 | Merged | Pinned all `"latest"` tags to specific versions |
| #13 | Devin trigger scripts | Human | Feb 14 | Merged | API trigger + PR polling scripts |
| #14 | Remove obsolete workflow | Human | Feb 14 | Merged | Deleted `github-actions-example.yml` |

---

## Before / After: CI Pipeline

```mermaid
flowchart LR
    subgraph BEFORE["BEFORE — Single broken workflow"]
        direction TB
        B1["github-actions-example.yml"]
        B2["Node 10 (outdated)"]
        B3["npm-based Boozang (broken)"]
        B4["No unit test stage"]
        B5["No Playwright tests"]
        B6["Dependencies set to 'latest'"]
        B1 --- B2 --- B3 --- B4 --- B5 --- B6
    end

    subgraph AFTER["AFTER — Modern 3-stage pipeline"]
        direction TB
        A1["test-pipeline.yml"]
        A2["Node 20 (LTS)"]
        A3["Stage 1: Unit Tests<br/>20 tests, 11 suites"]
        A4["Stage 2: Playwright<br/>4 smoke tests"]
        A5["Stage 3: Boozang E2E<br/>Docker runner (optional)"]
        A6["Pinned dependencies"]
        A1 --- A2
        A2 --> A3 --> A4 --> A5
        A1 --- A6
    end

    BEFORE -- "Devin PRs #2–#6, #12" --> AFTER

    style BEFORE fill:#fdd,stroke:#c00,color:#000
    style AFTER fill:#dfd,stroke:#0a0,color:#000
```

### Detailed Comparison

| Aspect | Before | After |
|--------|--------|-------|
| **Workflow file** | `github-actions-example.yml` | `test-pipeline.yml` |
| **Node.js version** | 10.x (EOL) | 20.x (LTS) |
| **GitHub Actions versions** | checkout@v2, setup-node@v1 | checkout@v4, setup-node@v4 |
| **Test runner** | npm `boozang` package (broken) | Docker `styrman/boozang-runner` |
| **Unit tests** | Not in pipeline, imports broken | 20 tests passing, 11 suites |
| **E2E tests** | None | 4 Playwright smoke tests |
| **Pipeline stages** | Single monolithic job | 3 sequential stages with gates |
| **Secret handling** | N/A | Env var pattern for optional Boozang |
| **Dependencies** | `"latest"` tags (10 packages) | All pinned to `^x.y.z` |
| **Frontend-backend** | Hardcoded `localhost:9000` URLs | Proxy config + `getApiUrl()` helper |
| **Report publishing** | Broken | Cucumber HTML reports to GitHub Pages |

### Key Outcomes

- **7 Devin PRs** created across 2 sessions (6 merged, 1 closed as test-only)
- **0 broken merges** to main
- **Pipeline went from non-functional to 3-stage sequential** with unit, integration, and E2E tests
- **Self-correction demonstrated**: PR #6 fixed a syntax issue Devin introduced in PR #5
- **Total files changed**: ~35 files across functional PRs

---

*Generated from PR data in [ljunggren/boozang-thelab](https://github.com/ljunggren/boozang-thelab). Part of the [multi-agent workflow experiment](.devin/multi-agent-workflow.md).*
