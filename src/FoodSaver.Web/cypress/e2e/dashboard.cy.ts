import { 
    createFood, 
    createExpiryDate 
} from "../support/food-helpers";

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
describe('Dashboard visible list counters', () => {
  let todayFood: string;
  let soonFood: string;
  let laterFood: string;

  it('must refresh dashboard counters when foods are added', () => {
    // Arrange
    const suffix = Date.now();

    todayFood = `Today ${suffix}`;
    soonFood = `Soon ${suffix}`;
    laterFood = `Later ${suffix}`;
   
    // Arrange
    cy.contains('p', 'Total foods')
      .should('be.visible')
      .then($el => {
        const value = Number($el.text().match(/\d+/)?.[0] ?? 0);
        cy.wrap(value).as('initialFoods');
      });

    cy.contains('p', 'Total quantity')
      .should('be.visible')
      .then($el => {
        const value = Number($el.text().match(/\d+/)?.[0] ?? 0);
        cy.wrap(value).as('initialQuantity');
      });

    cy.contains('p', 'Expiring today')
      .should('be.visible')
      .then($el => {
        const value = Number($el.text().match(/\d+/)?.[0] ?? 0);
        cy.wrap(value).as('initialToday');
      });

    cy.contains('article', 'Inventory summary')
      .contains('p', 'Expiring soon')
      .should('be.visible')
        .then($el => {
          const value = Number($el.text().match(/\d+/)?.[0] ?? 0);
          cy.wrap(value).as('initialSoon');
        });

    // Act
    createFood(todayFood, 2, createExpiryDate(0));
    createFood(soonFood, 3, createExpiryDate(2));
    createFood(laterFood, 1, createExpiryDate(10));

    // Assert
    cy.findByRole('heading', { name: /dashboard/i, level: 2 })
      .should('be.visible');

    cy.get('@initialFoods')
    .then(initialFoods => {
      cy.contains('p', 'Total foods:')
        .should('contain.text', String(Number(initialFoods) + 3));
    });

    cy.get('@initialQuantity')
      .then(initialQuantity => {
        cy.contains('p', 'Total quantity')
          .should('contain.text', String(Number(initialQuantity) + 6));
      });

    cy.get('@initialToday')
      .then(initialToday => {
        cy.contains('p', 'Expiring today')
          .should('contain.text', String(Number(initialToday) + 1));
      });

    cy.get('@initialSoon')
      .then(initialSoon => {
        cy.contains('article', 'Inventory summary')
          .contains('p', 'Expiring soon')
          .should('contain.text', String(Number(initialSoon) + 2));
      });
  });
});

describe('Dashboard global insights', () => {
  it('must display next expiring food from existing inventory', () => {
    // Act
    cy.get('li')
      .should('have.length.greaterThan', 0)
      .then(items => {
        const parsed = [...items].map(el => {
          const text = el.textContent ?? '';

          const match = text.match(/(.+)\s+x\d+\s+expires on\s+(.+)/);

          return {
            name: match?.[1]?.trim(),
            date: match?.[2] ? parseFoodDate(match[2]) : null
          };
        }).filter(x => x.date !== null) as {
          name: string;
          date: Date;
        }[];

        const next = parsed.reduce((min, curr) =>
          curr.date < min.date ? curr : min
        );

        const expectedDate = next.date.toLocaleDateString(
          'en-GB',
          {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }
        );

        // Assert
        cy.contains('p', 'Oldest food:')
          .should('be.visible')
          .should('contain.text', next.name)
          .and('contain.text', expectedDate)
      });
  });

  it('must display correct expiring soon percentage', () => {
    // Arrange
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Act
    cy.get('li')
      .should('have.length.greaterThan', 0)
      .then(items => {
        const foods = [...items].map(el => {
          const text = el.textContent ?? '';

          const match = text.match(/(.+)\s+x\d+\s+expires on\s+(.+)/);
          if (!match) return null;

          const date = parseFoodDate(match[2]);
          date.setHours(0, 0, 0, 0);

          return date;
        }).filter(Boolean) as Date[];

        const total = foods.length;

        const soon = foods.filter(date => {
          const diffDays =
            (date.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24);

          return diffDays >= 0 && diffDays <= 3;
        }).length;

        const expected = Math.round((soon / total) * 100);

        // Assert
        cy.contains('article', 'Global insights')
          .contains('p', /^Expiring soon:/)
          .should('be.visible')
          .and('contain.text', `${expected}%`);
      });
  });
});

const months: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11
};

function parseFoodDate(text: string): Date {
  const match = text.match(/(\d+)\s+(\w+)\s+(\d{4})/);

  if (!match) {
    throw new Error(`Invalid date: ${text}`);
  }

  const [, day, month, year] = match;

  return new Date(
    Number(year),
    months[month],
    Number(day)
  );
}