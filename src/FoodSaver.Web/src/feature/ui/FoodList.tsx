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
  const threeDaysLater = new Date();
  threeDaysLater.setDate(todayDate.getDate() + 3);

  const sortedFoods = [...foods].sort(
    (a, b) => a.expiryDate.localeCompare(b.expiryDate)
  );
  
  return (
    <ul>
      {sortedFoods.map((food) => {
        const isExpired = food.expiryDate < today; 
        const expiry = new Date(food.expiryDate);
        const isSoonToExpire = 
          ! food.isConsumed &&
          expiry >= todayDate && 
          expiry <= threeDaysLater;

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
              <span className="soon-badge">
                expiring soon
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