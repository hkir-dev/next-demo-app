# Next.js Quiz Demo (TypeScript)

Next.js based web application that implements a demo quiz application.

## Live Demo 

**Live:** https://hkir-dev.github.io/next-demo-app/

> ⚠️ Warning: First load may be slow (cold CDN cache); subsequent visits are fast.

## Tech Stack

- Next.js (App Router), TypeScript, Tailwind, Jest, GitHub Actions.

## Developer Guide

See [developer guide](/docs/development.md) for the details

## Architecture

```
src/
  app/             # App Router pages: /, /quiz/[flow], /score
  components/      # Pure UI: Button, CardLayout, ChoiceList, QuestionCard, RoundCard
  domain/          # Domain types (QuizSuite, Activity, QuizData, Question, Round) and Flow strategies (linear, rounds)
  hooks/           # client side data processing
  services/        # server side API access and normalisation
```

### Reusable components

Components such as Button, CardLayout, QuestionCard and RoundCard are designed to be reused across the application (see [components folder](/src/components/)).

### Flow engine (strategy pattern)

Small, [typed interface](/src/domain/flowStrategies.ts) so **new flows** can be added without touching the UI:

```ts
export interface FlowStrategy {
  handleAnswer(params: {...}): void;
  handleRoundDisplay(params: {...}): void;
  renderRoundCard(params: {...}): React.ReactElement;
  renderQuestionCard(params: {...}): React.ReactElement;
}
```

* **`LinearFlowStrategy`**: iterates through `questions[]` once.
* **`RoundsFlowStrategy`**: iterates within the current round; at end-of-round it **pauses** and signals the UI to show a **Round Card**. 

This makes Question UI & Score UI agnostic of flow logic and highly reusable.

### Adapter

The [data adapter](/src/services/apiToQuiz.ts) decouples the app’s domain model from the remote API shape (normalizes fields, correct answer formats, and grouping).

## Testing

[Jest unit tests](/test/services/) cover data access and normalization.

## Code Quality and Formatting

ESLint + Prettier for consistent style:

```bash
npm run lint
npm run format
```

## Deployment

Deployed to **GitHub Pages** via **GitHub Actions**.
Live: [https://hkir-dev.github.io/next-demo-app/](https://hkir-dev.github.io/next-demo-app/)
Workflow: `.github/workflows/nextjs.yml`
