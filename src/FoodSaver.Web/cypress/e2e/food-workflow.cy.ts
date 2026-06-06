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
  let milk: string;
  let apple: string;
  let bread: string;

  beforeEach(() => {
    // Arrange
    cy.request({
      url: 'https://foodsaver-api-00tb.onrender.com/foods'
    });
    cy.visit('/');

    const suffix = Date.now();

    milk = `Milk ${suffix}`;
    apple = `Apple ${suffix}`;
    bread = `Bread ${suffix}`;

    createFood(milk, 1);
    createFood(apple, 1);
    createFood(bread, 1);

    cy.contains(milk)
      .should('exist');
    cy.contains(apple)
      .should('exist');
    cy.contains(bread)
      .should('exist');
  });

  it('must search foods by name case-insensitively', () => {
    // Act search lowercase
    cy.get('input[type="search"]')
      .type('mil')
      .should('have.value', 'mil');

    // Assert search lowercase
    cy.contains('li', milk).should('be.visible');

    // Act search uppercase
    cy.get('input[type="search"]')
      .clear()
      .type('MIL')
      .should('have.value', 'MIL');

    // Assert search uppercase
    cy.contains('li', milk).should('be.visible');
  });

  it('must search foods by name prefix only', () => {
    // Act
    cy.get('input[type="search"]')
      .type('k');

    // Assert
    cy.contains('li', milk).should('not.exist');
    cy.contains('li', apple).should('not.exist');
    cy.contains('li', bread).should('not.exist');
  });
});

describe('Food filtering', () => {
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

    createFood(todayFood, 1, createExpiryDate(0));
    createFood(soonFood, 1, createExpiryDate(2));
    createFood(laterFood, 1, createExpiryDate(10));
  });

  it('must show only foods expiring today', () => {
    // Act
    cy.findByLabelText(/filter/i)
      .select('Expiring today');

    // Assert
    cy.get('ul')
      .should('contain.text', todayFood)
      .and('not.contain.text', soonFood)
      .and('not.contain.text', laterFood);
  });

  it('must show foods expiring within 3 days', () => {
    // Act
    cy.findByLabelText(/filter/i)
      .select('Expiring soon');

    // Assert
    cy.get('ul')
      .should('contain.text', todayFood)
      .and('contain.text', soonFood)
      .and('not.contain.text', laterFood);
  });
});

describe('Food sorting', () => {
  let apple: string;
  let bread: string;

  beforeEach(() => {
    // Arrange
    cy.request({
      url: 'https://foodsaver-api-00tb.onrender.com/foods'
    });

    cy.visit('/');

    const suffix = Date.now();

    apple = `Apple ${suffix}`;
    bread = `Bread ${suffix}`;

    createFood(bread, 1);
    createFood(apple, 1);
  });
  
  it('must sort foods by name ascending', () => {
    // Act
    cy.findByLabelText(/sort/i).select('Name (A-Z)');

    // Assert
    cy.get('li').then(items => {
      const names = [...items].map(i =>
        i.textContent?.split(' x')[0]
      );

      expect(names[0]).to.contain('Apple');
      expect(names[1]).to.contain('Bread');
    });
  });

  it('must sort foods by name descending', () => {
    // Act
    cy.findByLabelText(/sort/i).select('Name (Z-A)');

    // Assert
    cy.get('li').then(items => {
      const names = [...items].map(i =>
        i.textContent?.split(' x')[0]
      );

      expect(names[0]).to.contain('Bread');
      expect(names[1]).to.contain('Apple');
    });
  });
});

function createFood(
  foodName: string,
  quantity: number,
  expiryDate = '2026-12-31'
) {
  cy.findByPlaceholderText(/food name/i)
    .clear()
    .type(foodName);

  cy.get('input[type="date"]')
    .clear()
    .type(expiryDate);

  cy.get('input[type="number"]')
    .clear()
    .type(quantity.toString());

  cy.findByRole('button', { name: /add/i })
    .click();
}

function createExpiryDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return date.toISOString().split('T')[0];
}