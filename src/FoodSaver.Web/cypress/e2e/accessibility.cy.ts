/**
 * For now, 
 *  * Cold start? please rerun manually.
 *  * Dev? Please 
 *    1. configure your render https://dashboard.render.com/... to deploy from the feature branch; then
 *    2. commit and push your feature
 */
describe('Accessibility Tests', () => {
  it('must have no accessibility violations.', () => {
    // Arrange
    cy.visit('https://foodsaver-web.onrender.com');
    cy.contains('h1', 'FoodSaver');

    // Act
    cy.injectAxe();

    // Assert
    cy.checkA11y(undefined,
      {
        runOnly: {
          type: 'tag',
          values: ['wcag2a']
        }
      },
      (violations) => {
        violations.forEach((violation) => {
          cy.log(violation.id);
          cy.log(violation.description);
          cy.log(violation.help);
        });
      }
    );
  });
});   