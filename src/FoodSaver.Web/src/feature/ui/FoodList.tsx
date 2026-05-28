import type { Food } from '../types';

import { Snackbar } from './Snackbar';

import './FoodList.css'

type Props = {
  foods: Food[];
  onConsume: (
    id: string,
    qty: number
  ) => void;
  snackbar: string | null;
  onUndo: () => void;
  onConfirm: () => void;
};

export function FoodList({ 
  foods, 
  onConsume,
  snackbar,
  onUndo,
  onConfirm
 }: Props) {
  const today = new Date().toISOString().split('T')[0];

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const threeDaysLater = new Date(todayDate);
  threeDaysLater.setDate(todayDate.getDate() + 3);
  const tomorrow = new Date(todayDate);
  tomorrow.setDate(todayDate.getDate() + 1);

  const visibleFoods = foods.filter(
  food =>
    food.quantity > 0
    &&
    food.expiryDate >= today
);

  const sortedFoods = [...visibleFoods].sort(
    (a, b) => a.expiryDate.localeCompare(b.expiryDate)
  );

  const activeFoodsCount = sortedFoods.reduce(
    (total, food) => total + food.quantity,
    0
  );
  const foodLabel = activeFoodsCount === 1 
    ? "food" 
    : "foods";
  
  return (
    <>
      <p>
          {activeFoodsCount} {foodLabel}
          {' '}to consume
        </p>
      <ul>
        {sortedFoods.map((food) => {
          const isExpired = food.expiryDate < today; 
          const expiryDate = new Date(food.expiryDate);
          expiryDate.setHours(0, 0, 0, 0);
          const startOfToday = new Date(todayDate);
          startOfToday.setHours(0, 0, 0, 0);

          const isSoonToExpire = 
            food.quantity > 0 &&
            expiryDate >= tomorrow && 
            expiryDate <= threeDaysLater;

          const isExpiringToday = 
            food.quantity > 0 &&
            expiryDate >= startOfToday &&
            expiryDate < tomorrow;

          return (
            <li 
              key={food.id}
              aria-label={`${food.name}, quantity ${food.quantity}`}
            >
              <span>
                {food.name} x{food.quantity}
                {isExpired ? ' expired ' : ' expires '} 
                on {' '} 
                {new Date(food.expiryDate)
                  .toLocaleDateString(
                    'en-GB', 
                    {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }
                  )
                }
              </span>

              {food.quantity > 0 && (
              <>
                <button
                  onClick={() => {onConsume(food.id, 1)}}
                  aria-label={`
                    Consume ${food.quantity === 1 
                      ? food.name :
                      `1 ${food.name}`
                    }
                  `}
                >
                  {food.quantity === 1
                  ? 'Consume'
                  : 'Consume 1'}
                </button>

                {food.quantity > 1 && (
                  <button
                    onClick={() => {onConsume(food.id, food.quantity)}}
                    aria-label={`Consume all ${food.name}`}
                  >
                    Consume all
                  </button>
                )}
            </>
            )}

              {isSoonToExpire && (
                <span className='soon-badge'>
                  expiring soon
                </span>
              )}

              {isExpiringToday && (
                <span className='today-badge'>
                  expiring today !
                </span>
              )}
            </li>
          );
        })}
      </ul>
       {snackbar && (
          <Snackbar
            message={snackbar}
            onUndo={onUndo}
            onConfirm={onConfirm}
          />
        )}
    </>
  );
}