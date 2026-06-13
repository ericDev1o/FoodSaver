export function createFood(
  foodName: string,
  quantity: number,
  expiryDate = '2026-12-31'
) {
  cy.findByPlaceholderText(/food name|nom de l’aliment/i)
    .clear()
    .type(foodName);

  cy.get('input[type="date"]')
    .clear()
    .type(expiryDate);

  cy.get('input[type="number"]')
    .clear()
    .type(quantity.toString());

  cy.findByRole('button', { name: /add|ajouter/i })
    .click();
}

export function createExpiryDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return date.toISOString().split('T')[0];
}