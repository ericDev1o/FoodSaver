/**
 * For now, 
 *  * Cold start? please rerun manually.
 *  * Dev? Please 
 *    * configure your render Dashboard(1) to deploy from the feature branch
 *    * commit and push your feature
 *    (1) https://dashboard.render.com/...
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