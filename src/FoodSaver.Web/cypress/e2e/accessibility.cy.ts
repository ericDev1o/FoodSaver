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
    // Wake up API before loading UI
    cy.request({
      url: 'https://foodsaver-api-00tb.onrender.com/foods'
    });

    cy.visit('/');
    
    cy.contains('h1', 'FoodSaver');

    // Act
    cy.injectAxe();

    // Assert
    cy.checkA11y(undefined,
      {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag2aaa']
        }
      },
      (violations) => {
        violations.forEach((violation) => {
          cy.log(violation.id);
          cy.log(violation.description);
          cy.log(violation.help);

          violation.nodes.forEach(node => {
            cy.log(node.html);
          });
        });
      }
    );
  });
});   