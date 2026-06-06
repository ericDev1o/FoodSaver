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

  beforeEach(() => {
    // Arrange
    cy.request({
      url: 'https://foodsaver-api-00tb.onrender.com/foods'
    });

    cy.visit('/');

    const suffix = Date.now();

    todayFood = `Today ${suffix}`;
    soonFood = `Soon ${suffix}`;
    laterFood = `Later ${suffix}`;

    createFood(todayFood, 2, createExpiryDate(0));
    createFood(soonFood, 3, createExpiryDate(2));
    createFood(laterFood, 1, createExpiryDate(10));
  });

  it('must display inventory insights', () => {
    // Assert
    cy.findByRole('heading', { name: /dashboard/i, level: 2 })
      .should('be.visible');

    cy.contains(/total foods/i)
      .should('contain.text', '3');

    cy.contains(/total quantity/i)
      .should('contain.text', '6');

    cy.contains(/expiring today/i)
      .should('contain.text', '1');

    cy.contains(/expiring soon/i)
      .should('contain.text', '2');

    cy.contains(/next expiry/i)
      .should('contain.text', todayFood);
  });
});