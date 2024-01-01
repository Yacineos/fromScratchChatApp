import { mount } from "cypress/angular";
import { ChatComponent } from "src/app/chat/chat.component";

describe('Chat Component', () => {
  it('should display a message input and the list of users and the messages also a send button', () => {
    mount(ChatComponent);
    cy.get('input[id="message-input"]').should('be.visible');
    //cy.get('ul[id="users"]').should('be.visible');
    //cy.get('ul[id="messages"]').should('be.visible');
    cy.get('button[id="send-message"]').should('be.visible');
  })
})