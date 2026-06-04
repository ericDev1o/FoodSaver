/**
 * Please see ./accessibility.cy.ts
 */
describe('Food workflow', () => {
  beforeEach(() => {
    // Arrange
    cy.request({
      url: 'https://foodsaver-api-00tb.onrender.com/foods'
    });
    cy.visit('/');
  });

  it('must create and consume a food item.', () => {
    // Arrange
    const foodName = `Milk e2e test ${Date.now()}`;

    // Act - create
    createFood(foodName, 1);

    // Assert - created
    cy.contains('li', foodName)
      .should('contain.text', 'x1');

    // Act - consume
    cy.contains('li', foodName)
      .within(() => {
        cy.findByRole('button', { name: /consume/i })
          .click();
    });

    cy.findByRole('button', { name: /confirm/i })
      .click();

    // Assert - consumed
    cy.contains('li', foodName)
      .should('not.exist'); 
    });

  it('given quantity 2 when consuming 1 then it must show quantity 1', () => {
    // Arrange
    const foodName = `Milk e2e test ${Date.now()}`;

    // Act - create
    createFood(foodName, 2);

    // Assert - created
    cy.contains('li', foodName)
      .should('contain.text', 'x2');

    // Act - consume 1
    cy.contains('li', foodName).within(() => {
      cy.findByRole('button', { name: /consume 1/i })
        .click();
    });

    cy.findByRole('button', { name: /confirm/i })
      .click();

    // Assert - consumed 1
    cy.contains('li', foodName)
    .should('exist')
    .and('contain.text', 'x1');
  });

  it('given quantity 2 when consuming all then it must remove item', () => {
    // Arrange
    const foodName = `Milk e2e test ${Date.now()}`;

    // Act - create
    createFood(foodName, 2);

    // Assert - created
    cy.contains('li', foodName)
      .should('contain.text', 'x2');

    // Act - consume all
    cy.contains('li', foodName).within(() => {
      cy.findByRole('button', { name: /consume all/i })
        .click();
    });

  cy.findByRole('button', { name: /confirm/i })
    .click();

    // Assert - consumed all
    cy.contains('li', foodName)
      .should('not.exist');
  });
});

describe('Food search', () => {
  beforeEach(() => {
    // Arrange
    cy.request({
      url: 'https://foodsaver-api-00tb.onrender.com/foods'
    });
    cy.visit('/');

    createFood('Milk', 1);
    createFood('Apple', 1);
    createFood('Bread', 1);

    cy.contains('Milk')
      .should('exist');
    cy.contains('Apple')
      .should('exist');
    cy.contains('Bread')
      .should('exist');
  });

  it('must search foods by name case-insensitively', () => {
    // Act search lowercase
    cy.get('input[type="search"]')
      .type('mil');

    // Assert search lowercase
    cy.contains('Milk')
      .should('exist');

    cy.contains('Apple')
      .should('not.exist');

    cy.contains('Bread')
      .should('not.exist');

    // Act search uppercase
    cy.get('input[type="search"]')
      .clear()
      .type('MIL');

    // Assert search uppercase
    cy.contains('Milk')
      .should('exist');

    cy.contains('Apple')
      .should('not.exist');

    cy.contains('Bread')
      .should('not.exist');
  });

  it('must search foods by name prefix only', () => {
    // Act
    cy.get('input[type="search"]')
      .type('k');

    // Assert
    cy.contains('Milk')
      .should('not.exist');
  });
});

function createFood(
  foodName: string, 
  quantity: number
) {
  cy.findByPlaceholderText(/food name/i).type(foodName);
  cy.get('input[type="date"]').clear().type('2026-12-31');
  cy.get('input[type="number"]').clear().type(quantity.toString());

  cy.findByRole('button', { name: /add/i }).click();
}