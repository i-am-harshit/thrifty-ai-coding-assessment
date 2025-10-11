Cypress E2E test instructions

This repository includes a simple Cypress test at `cypress/e2e/signup_login.cy.js`.

To run it locally:

1. Start the backend server (from `server/` folder):

```bash
node server.js
```

2. Ensure the frontend knows where the API is. Create a `client/.env` with:

```text
REACT_APP_HOST_URL=http://localhost:8080/
```

3. Start the frontend (from `client/`):

```bash
npm install
npm start
```

4. In another terminal run Cypress (from `client/`):

```bash
# interactive
npm run cypress:open
# or headless
npm run cypress:run
```

Notes:

- The Cypress test fills the signup form, then calls the backend login endpoint to obtain a token and stores it in localStorage (so the app shows the boards page).
- Make sure backend is listening on `http://localhost:8080` and the frontend on `http://localhost:3000` (CRA default).
