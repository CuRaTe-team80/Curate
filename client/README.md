# Curate

A collaborative Kanban-style tool for labeling machine learning data samples - cards move from **Unlabeled -> In Review -> Labeled** as the team works through a dataset together.

Built for [course/workshop name] by a 7-person team.

## Status

In active development - Sprint 2 (working REST API) in progress.

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

## API Contract

Base URL (local dev): `http://localhost:5000`

### Sample object shape

```json
{
  "id": "1",
  "content": "sample-image-1.jpg",
  "type": "image",
  "currentLabel": null,
  "status": "Unlabeled",
  "labeledBy": null,
  "history": []
}
```

- `content` - the sample itself: an image filename/URL, or raw text for text samples
- `type` - `"image"` or `"text"`
- `currentLabel` - the applied label, or `null` if unlabeled
- `status` - `"Unlabeled"` | `"In Review"` | `"Labeled"` (mirrors the board's three columns)
- `labeledBy` - user ID of whoever last labeled it, or `null`
- `history` - array of past labeling actions, e.g. `{ "action": "labeled", "label": "positive", "by": "user123", "at": "2026-08-05T10:00:00Z" }`

### Routes

| Method | Route | Description | Status |
|---|---|---|---|
| GET | `/samples` | Returns all samples | working |
| GET | `/samples/:id` | Returns one sample by id | needs verification |
| POST | `/samples` | Creates a new sample | needs verification |
| PATCH | `/samples/:id` | Updates a sample's label/status | needs verification |
| POST | `/auth/register` | Registers a new user | in progress |
| POST | `/auth/login` | Logs in, returns a JWT | in progress |

*Note: samples are currently served from in-memory/mock data - MongoDB persistence lands in Sprint 3.*

## Team workflow

- Every feature is built on its own branch: `sprint{N}/{member}-{feature}`
- No direct pushes to `main` - all changes go through a pull request and require review before merging
- See the full sprint plan and task breakdown in `docs/team-work-plan.md` *(add this file once available)*

## License
TBD