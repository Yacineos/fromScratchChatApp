import { mount } from "cypress/angular";
import { AuthComponent } from "src/app/auth/auth.component";

describe('Auth Component', () => {
  it('Should display a username and a room input and a join button', () => {
    mount(AuthComponent);
    cy.get('input[id="username"]').should('be.visible');
    cy.get('input[id="room-name"]').should('be.visible');
    cy.get('button[id="join-room"]').should('be.visible');
  });
}); 
