import { 
    createFood, 
    createExpiryDate 
} from "../support/food-helpers";

/**
 * Please see ./accessibility.cy.ts
 */
describe('Dashboard', () => {
  let todayFood: string;
  let soonFood: string;
  let laterFood: string;

  it('must refresh dashboard counters when foods are added', () => {
    // Arrange
    // Wake up API before loading UI
    cy.request({
      url: 'https://foodsaver-api-00tb.onrender.com/foods'
    });

    cy.visit('/');

    const suffix = Date.now();

    todayFood = `Today ${suffix}`;
    soonFood = `Soon ${suffix}`;
    laterFood = `Later ${suffix}`;
   
    // Act
    createFood(todayFood, 2, createExpiryDate(0));
    createFood(soonFood, 3, createExpiryDate(2));
    createFood(laterFood, 1, createExpiryDate(10));

    // Assert
    cy.findByRole('heading', { name: /dashboard/i, level: 2 })
      .should('be.visible');

    cy.contains('p', 'Total foods:')
      .should('contain.text', '3');

    cy.contains('p', 'Total quantity')
      .should('contain.text', '6');

    cy.contains('p', 'Expiring today')
      .should('contain.text', '1');

    cy.contains('p', 'Expiring soon')
      .should('contain.text', '2');

    cy.contains('p', 'Next expiry')
      .should('contain.text', todayFood);
  });
});