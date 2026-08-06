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