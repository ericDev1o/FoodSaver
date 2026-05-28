/**
 * Please see ./accessibility.cy.ts
 */
describe('food workflow', () => {
  beforeEach(() => {
    // Arrange
    cy.intercept('POST', '**/foods').as('createFood');
    cy.intercept('PATCH', '**/foods/*/consume').as('consumeFood');
    cy.intercept('GET', '**/foods').as('getFoods');

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
        cy.findByRole('button', { name: /consume/i }).click();
    });

    confirmConsume()

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
    cy.contains('li', foodName).should('contain.text', 'x2');

    // Act - consume 1
    cy.contains('li', foodName).within(() => {
      cy.findByRole('button', { name: /consume 1/i }).click();
    });

    confirmConsume()

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
    cy.contains('li', foodName).should('contain.text', 'x2');

    // Act - consume all
    cy.contains('li', foodName).within(() => {
      cy.findByRole('button', { name: /consume all/i }).click();
    });

    confirmConsume()

    // Assert - consumed all
    cy.contains('li', foodName).should('not.exist');
  });
});

function createFood(
  foodName: string, 
  quantity: number
) {
  cy.findByPlaceholderText(/food name/i).type(foodName);
  cy.get('input[type="date"]').type('2026-12-31');
  cy.get('input[type="number"]').clear().type(quantity.toString());

  cy.findByRole('button', { name: /add/i }).click();

  cy.wait('@createFood');
  cy.wait('@getFoods');
}

function confirmConsume() {
  cy.findByRole('button', { name: /confirm/i }).click();

  cy.wait('@consumeFood');
  cy.wait('@getFoods');
}