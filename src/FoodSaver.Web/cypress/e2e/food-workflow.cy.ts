/**
 * Please see ./accessibility.cy.ts
 */
describe('food workflow', () => {
  it('must create and consume a food item.', () => {
    // Arrange
    const foodName = `Milk e2e test ${new Date().toLocaleString('gb-GB').replace(',', '')}`;

    cy.request({
      url: 'https://foodsaver-api-00tb.onrender.com/foods'
    });
    cy.visit('/');

    // Act - create
    cy.findByPlaceholderText(/food name/i)
      .type(foodName);

    cy.get('input[type="date"]')
      .type('2026-12-31');

    cy.get('input[type="number"]')
      .clear()
      .type('1');

    cy.findByRole('button', {
      name: /add/i,
    }).click();

    // Assert - created
    cy.contains('li', foodName)
      .should('contain.text', 'x1');

    // Act - consume
    cy.contains('li', foodName)
      .within(() => {
        cy.findByRole('button', { name: /consume/i }).click();
    });

    // Assert - consumed
    cy.contains('li', foodName)
      .should('not.exist'); 
    });

  it('given quantity 2 when consuming 1 it must show quantity 1', () => {
    // Arrange
    const foodName = `Milk e2e test ${new Date().toLocaleString('gb-GB').replace(',', '')}`;

    cy.request({
      url: 'https://foodsaver-api-00tb.onrender.com/foods'
    });
    cy.visit('/');

    // Act - create
    cy.findByPlaceholderText(/food name/i).type(foodName);
    cy.get('input[type="date"]').type('2026-12-31');
    cy.get('input[type="number"]').clear().type('2');

    cy.findByRole('button', { name: /add/i }).click();

    // Assert - created
    cy.contains('li', foodName).should('contain.text', 'x2');

    // Act - consume 1
    cy.contains('li', foodName).within(() => {
      cy.findByRole('button', { name: /consume 1/i }).click();
    });

    // Assert - consumed 1
    cy.contains('li', foodName).should('contain.text', 'x1');
  });

  it('given quantity 2 when consuming all it must remove item', () => {
    // Arrange
    const foodName = `Milk e2e test ${new Date().toLocaleString('fr-FR').replace(',', '')}`;

    cy.request({
      url: 'https://foodsaver-api-00tb.onrender.com/foods'
    });
    cy.visit('/');

    // Act - create
    cy.findByPlaceholderText(/food name/i).type(foodName);
    cy.get('input[type="date"]').type('2026-12-31');
    cy.get('input[type="number"]').clear().type('2');

    cy.findByRole('button', { name: /add/i }).click();

    // Assert - created
    cy.contains('li', foodName).should('contain.text', 'x2');

    // Act - consume all
    cy.contains('li', foodName).within(() => {
      cy.findByRole('button', { name: /consume all/i }).click();
    });

    // Assert - consumed all
    cy.contains('li', foodName).should('not.exist');
  });
});
