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
    cy.contains('p', /total foods|nombre total d'aliments/i)
      .should('be.visible')
      .then($el => {
        const value = Number($el.text().match(/\d+/)?.[0] ?? 0);
        cy.wrap(value).as('initialFoods');
      });

    cy.contains('p', /total quantity|quantité totale/i)
      .should('be.visible')
      .then($el => {
        const value = Number($el.text().match(/\d+/)?.[0] ?? 0);
        cy.wrap(value).as('initialQuantity');
      });

    cy.contains('p', /to consume today|à consommer aujourd'hui/i)
      .should('be.visible')
      .then($el => {
        const value = Number($el.text().match(/\d+/)?.[0] ?? 0);
        cy.wrap(value).as('initialToday');
      });

    cy.contains('article', /fridge summary|résumé du réfrigérateur/i)
      .contains('p', /to consume soon|à consommer bientôt/i)
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
    cy.findByRole('heading', { 
      name: /dashboard|tableau de bord/i, 
      level: 2 
    })
      .should('be.visible');

    cy.get('@initialFoods')
    .then(initialFoods => {
      cy.contains('p', /total foods|nombre total d'aliments/i)
        .should('contain.text', String(Number(initialFoods) + 3));
    });

    cy.get('@initialQuantity')
      .then(initialQuantity => {
        cy.contains('p', /total quantity|quantité totale/i)
          .should('contain.text', String(Number(initialQuantity) + 6));
      });

    cy.get('@initialToday')
      .then(initialToday => {
        cy.contains('p', /to consume today|à consommer aujourd'hui/i)
          .should('contain.text', String(Number(initialToday) + 1));
      });

    cy.get('@initialSoon')
      .then(initialSoon => {
        cy.contains('article', /fridge summary|résumé du réfrigérateur/i)
          .contains('p', /to consume soon|à consommer bientôt/i)
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

          const match = text.match(/(\d{1,2}\s+\w+\s+\d{4})/);

          return {
            name: text.split(' x')[0].trim(),
            date: match ? parseFoodDate(match[1]) : null,
            dateText: match?.[1]

          };
        }).filter(x => x.date !== null) as {
          name: string;
          date: Date;
          dateText: string;
        }[];

        const next = parsed.reduce((min, curr) =>
          curr.date < min.date ? curr : min
        );

        const expectedDate = next.dateText;

        // Assert
        cy.contains('p', /next food to consume|prochain aliment à consommer/i)
          .should('be.visible')
          .and('contain.text', next.name)
          .and('contain.text', expectedDate)
      });
  });

  it('must display correct expiring soon percentage', () => {
    // Arrange - snapshot initial UI value
    cy.contains('article', /global insights|indicateurs globaux/i)
      .contains('p', /to consume soon|à consommer bientôt/i)
      .should('be.visible')
      .then($el => {
        const initialText = $el.text();
        const initialMatch = initialText.match(/\((\d+) of (\d+)\)/);

        const soonBefore = Number(initialMatch?.[1] ?? 0);
        const totalBefore = Number(initialMatch?.[2] ?? 0);

        const expectedPercent = Math.round(
          ((soonBefore + 2) / (totalBefore + 3)) * 100
        );
        cy.wrap(expectedPercent).as('expectedPercent');
      });

    const suffix = Date.now();

    const foodSoon1 = `Soon food 1 ${suffix}`;
    const foodSoon2 = `Soon food 2 ${suffix}`;
    const foodLater3 = `Later food ${suffix}`;

    // Act - controlled dataset
    createFood(foodSoon1, 1, createExpiryDate(1));
    createFood(foodSoon2, 1, createExpiryDate(2));
    createFood(foodLater3, 1, createExpiryDate(10));

    // Assert - deterministic recalculation from controlled data only
    cy.get('@expectedPercent').then(expectedPercent => {
      cy.contains('article', /global insights|indicateurs globaux/i)
        .contains('p', /to consume soon|à consommer bientôt/i)
        .should('be.visible')
        .and('contain.text', `${expectedPercent}%`);
    });
  });

  it('must count foods with quantity equal to one', () => {
    // Arrange
    cy.contains('p', /foods to restock|aliments à renouveler/i)
      .should('be.visible')
      .then($el => {
        const value = Number(
          $el.text().match(/\d+/)?.[0] ?? 0
        );

        cy.wrap(value).as('initialLowStock');
      });

    const suffix = Date.now();

    const foodQty1_1: string = `Low stock food ${suffix}`;
    const foodQty1_2: string = `Low stock food ${suffix}`;
    const foodQty3: string = `Normal stock food ${suffix}`;

    // Act
    createFood(foodQty1_1, 1, createExpiryDate(5));
    createFood(foodQty1_2, 1, createExpiryDate(10));
    createFood(foodQty3, 3, createExpiryDate(15));

    // Assert
    cy.get('@initialLowStock')
      .then(initialLowStock => {
        cy.contains('p', /foods to restock|aliments à renouveler/i)
          .should(
            'contain.text',
            String(Number(initialLowStock) + 2)
          );
      });
  })
});

function parseFoodDate(text: string): Date {
  const match = text.match(/(\d{1,2}\s+\w+\s+\d{4})$/);
  if (!match)
    throw new Error(`Invalid date: ${text}`);

  const date = new Date(match[1]);

  if(isNaN(date.getTime()))
    throw new Error(`Invalid date: ${text}`);

  return date;
}