import type { Food } from '../types';

import { Snackbar } from './Snackbar';

import './FoodList.css'

type Props = {
  foods: Food[];
  onConsume: (
    id: string,
    qty: number
  ) => void | Promise<void>;
  snackbar: string | null;
  snackbarFoodId: string | null;
  onUndo: () => void;
  onConfirm: () => void;
};

export function FoodList({ 
  foods, 
  onConsume,
  snackbar,
  snackbarFoodId,
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

  const sortedFoods = [...foods].sort(
    (a, b) => a.expiryDate.localeCompare(b.expiryDate)
  );
  
  return (
    <ul>
      {sortedFoods.map((food) => {
        const isExpired = food.expiryDate < today; 
        const expiryDate = new Date(food.expiryDate);
        expiryDate.setHours(0, 0, 0, 0);
        const startOfToday = new Date(todayDate);
        startOfToday.setHours(0, 0, 0, 0);

        const isSoonToExpire = 
          ! food.isConsumed &&
          expiryDate >= tomorrow && 
          expiryDate <= threeDaysLater;

        const isExpiringToday = 
          ! food.isConsumed &&
          expiryDate >= startOfToday &&
          expiryDate < tomorrow;

        return (
          <li 
            key={food.id} 
            className={food.isConsumed ? 'consumed' : ''}
            aria-label={`
              ${food.name},
              ${food.isConsumed 
              ? 'consumed'
              : 'active' }
            `}
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

            {!food.isConsumed && (
              <button 
                onClick={() => {onConsume(food.id, food.quantity)}}
                aria-label={`Mark ${food.name} as consumed`}
              >
                Consume
              </button>
            )}

            {food.isConsumed && (
              <small aria-label="Food already consumed">consumed</small>
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

            {snackbarFoodId === food.id && snackbar && (
              <Snackbar
                message={snackbar}
                onUndo={onUndo}
                onConfirm={onConfirm}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}