Next.js based web application that implements a demo quiz application.

## Live Demo 

Live: https://hkir-dev.github.io/next-demo-app/

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

[Data adapter](/src/services/apiToQuiz.ts) provides abstraction between the data model and the data source (API.) 

## Testing

[Unit tests](/test/services/) added for the data access and normalisation functionalities using Jest.

## Code Quality and Formatting

This project uses **ESLint** for linting and **Prettier** for code formatting to ensure consistent styling and adherence to best practices. Run `npm run lint` to check for linting issues and `npm run format` to format the code.

## Deployment

GitHub Pages: [https://hkir-dev.github.io/next-demo-app/](https://hkir-dev.github.io/next-demo-app/)

The site is deployed to **GitHub Pages** via **GitHub Actions**.
Workflow file: `.github/workflows/nextjs.yml`
