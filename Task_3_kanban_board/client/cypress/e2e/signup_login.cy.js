describe("Signup and login flow", () => {
  const R = Date.now();
  const email = `cypress_e2e_${R}@example.com`;
  const password = `P@ss${R}`;
  const first = "Cypress";
  const last = "User";

  it("signs up via UI, logs in and navigates to boards", () => {
    // visit the home page
    cy.visit("/");

    // fill signup form inputs by placeholder text
    cy.get('input[placeholder="Enter first name"]').type(first);
    cy.get('input[placeholder="Enter last name"]').type(last);
    cy.get('input[placeholder="Enter email address"]').type(email);
    cy.get('input[placeholder="Enter password"]').type(password);

    // click sign up
    cy.contains("button", "Sign Up").click();

    // after signup, perform login via backend to get a token
    cy.request(
      "POST",
      `${Cypress.env("BACKEND") || "http://localhost:8080"}/auth/login`,
      {
        email,
        password,
      }
    ).then((resp) => {
      expect(resp.status).to.eq(201);
      const token = resp.body.token;
      // store token in localStorage to simulate logged-in user
      const authData = {
        token,
        userId: resp.body.userId,
        firstname: resp.body.firstname,
      };
      localStorage.setItem("authData", JSON.stringify(authData));
      // visit boards page
      cy.visit("/boards");
      // assert we are on boards page (MyBoardsPage contains text)
      cy.contains("Boards").should("exist");
    });
  });
});
