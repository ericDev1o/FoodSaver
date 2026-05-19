import type { Food } from './types';

type Props = {
  foods: Food[];
  onConsume: (id: string) => void | Promise<void>;
};

export function FoodList({ foods, onConsume }: Props) {
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
                onClick={() => {onConsume(food.id)}}
                aria-label='Mark food as consumed'
              >
                Consume
              </button>
            )}

            {food.isConsumed && (
              <small aria-label="Food already consumed">consumed</small>
            )}

            {isSoonToExpire && (
              <small className="soon-badge">
                expiring soon
              </small>
            )}
          </li>
        );
      })}
    </ul>
  );
}