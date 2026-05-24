/**
 * Please see ./accessibility.cy.ts
 */
describe('food workflow', () => {
  it('must create and consume a food item.', () => {
    // Arrange
    const foodName = `Milk (test e2e ${new Date().toLocaleString('fr-FR').replace(',', '')}`;

    cy.request({
      url: 'https://foodsaver-api-00tb.onrender.com/foods'
    });
    cy.visit('/');

    // Act
    cy.findByPlaceholderText(/food name/i)
      .type(foodName);

    cy.get('input[type="date"]')
      .type('2026-12-31');

    cy.get('input[type="number"]')
      .clear()
      .type('2');

    cy.findByRole('button', {
      name: /add/i,
    }).click();

    // Assert
    cy.contains('li', foodName)
      .should('exist');

    cy.contains('li', foodName).within(() => {
      cy.findByRole('button', { name: /consume/i }).click();
    });

    cy.contains('li', foodName)
      .should('contain.text', 'consumed'); 
    });
});
