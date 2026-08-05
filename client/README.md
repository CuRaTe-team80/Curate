# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

# Curate

A collaborative Kanban-style tool for labeling machine learning data samples — cards move from **Unlabeled → In Review → Labeled** as the team works through a dataset together.

Built for [course/workshop name] by a 6-person team.

## Status

🚧 In active development — Sprint 1 (project scaffold) in progress.

## Tech stack

- **Front end:** React (Vite)
- **Back end:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT
- **Real-time:** Socket.io
- **Testing:** Jest, React Testing Library, Supertest
- **CI/CD:** GitHub Actions, Docker

## Getting started

```bash
# client
cd client
npm install
npm run dev

# server
cd server
npm install
npm run dev
```

## Team workflow

- Every feature is built on its own branch: `sprint{N}/{member}-{feature}`
- No direct pushes to `main` — all changes go through a pull request and require review before merging
- See the full sprint plan and task breakdown in `docs/team-work-plan.md` *(add this file once available)*

## License

TBD