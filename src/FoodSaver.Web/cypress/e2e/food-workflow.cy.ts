import {
  createFood,
  createExpiryDate
} from '../support/food-helpers';

beforeEach(() => {
  // Arrange
  // Wake up API before loading UI
  cy.request({
    url: 'https://foodsaver-api-00tb.onrender.com/foods'
  });
  cy.visit('/');
});

/**
 * Please see ./accessibility.cy.ts
 */
describe('Food workflow', () => {
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
    const suffix = Date.now();

    milk = `Milk ${suffix}`;
    apple = `Apple ${suffix}`;
    bread = `Bread ${suffix}`;

    seedFoods([milk, apple, bread]);
  });

  it('must search foods by name case-insensitively', () => {
    // Act search lowercase
    cy.get('input[type="search"]')
      .type('mil')
      .should('have.value', 'mil');

    // Assert search lowercase
    cy.contains('li', milk).should('be.visible');
    cy.contains('li', apple).should('not.exist');
    cy.contains('li', bread).should('not.exist');

    // Act search uppercase
    cy.get('input[type="search"]')
      .clear()
      .type('MIL')
      .should('have.value', 'MIL');

    // Assert search uppercase
    cy.contains('li', milk).should('be.visible');
    cy.contains('li', apple).should('not.exist');
    cy.contains('li', bread).should('not.exist');
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
    const suffix = Date.now();

    todayFood = `Today ${suffix}`;
    soonFood = `Soon ${suffix}`;
    laterFood = `Later ${suffix}`;

    createFood(todayFood, 1, createExpiryDate(0));
    createFood(soonFood, 1, createExpiryDate(2));
    createFood(laterFood, 1, createExpiryDate(10));

    cy.contains('li', todayFood).should('exist');
    cy.contains('li', soonFood).should('exist');
    cy.contains('li', laterFood).should('exist');
  });

  it('must show only foods expiring today', () => {
    // Act
    cy.findByLabelText(/filter/i)
      .select('Expiring today');

    // Assert
    cy.contains('li', todayFood).should('be.visible');
    cy.contains('li', soonFood).should('not.exist');
    cy.contains('li', laterFood).should('not.exist');
  });

  it('must show foods expiring within 3 days', () => {
    // Act
    cy.findByLabelText(/filter/i)
      .select('Expiring soon');

    // Assert
    cy.contains('li', todayFood).should('be.visible');
    cy.contains('li', soonFood).should('be.visible');
    cy.contains('li', laterFood).should('not.exist');
  });
});

describe('Food sorting', () => {
  let apple: string;
  let bread: string;

  beforeEach(() => {
    // Arrange
    const suffix = Date.now();

    apple = `Apple ${suffix}`;
    bread = `Bread ${suffix}`;

    seedFoods([apple, bread]);
  });
  
  it('must sort foods by name ascending', () => {
    // Act
    cy.findByLabelText(/sort/i).select('Name A → Z');

    // Assert
    cy.get('li')
      .filter((_, el) =>
        el.innerText.includes(apple) || el.innerText.includes(bread)
      )
      .should('have.length', 2)
      .then(items => {
        const names = [...items].map(i =>
          i.innerText.split('\n')[0].split(' x')[0].trim()
        );

        expect(names).to.deep.equal([apple, bread]);
      });
  });

  it('must sort foods by name descending', () => {
    // Act
    cy.findByLabelText(/sort/i).select('Name Z → A');

    // Assert
    cy.get('li')
      .filter((_, el) =>
        el.innerText.includes(apple) || el.innerText.includes(bread)
      )
      .should('have.length', 2)
      .then(items => {
        const names = [...items].map(i =>
          i.innerText.split('\n')[0].split(' x')[0].trim()
        );

        expect(names).to.deep.equal([bread, apple]);
      });
  });
});

describe('Food stock', () => {
  it('must display low stock badge for foods with quantity one', () => {
    // Arrange
    const suffix = Date.now();

    const lowStockFood: string = `Low stock food ${suffix}`;
    const normalFood: string = `Normal stock food ${suffix}`;

    // Act
    createFood(lowStockFood, 1, createExpiryDate(10));
    createFood(normalFood, 3, createExpiryDate(10));

    // Assert
    cy.contains('li', lowStockFood)
      .should('contain.text', 'Low stock');

    cy.contains('li', normalFood)
      .should('not.contain.text', 'Low stock');
  });
})

function seedFoods(names: string[]) {
  cy.wrap(names).each((name: string) => {
    createFood(name, 1);
    cy.contains('li', name).should('exist');
  });
}