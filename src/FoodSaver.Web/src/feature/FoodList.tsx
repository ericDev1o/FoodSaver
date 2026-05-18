import type { Food } from './types';

type Props = {
  foods: Food[];
  onConsume: (id: string) => void;
};

export function FoodList({ foods, onConsume }: Props) {
  const today = new Date().toISOString().split('T')[0];

  const sortedFoods = [...foods].sort(
    (a, b) => a.expiryDate.localeCompare(b.expiryDate)
  );
  
  return (
    <ul>
      {sortedFoods.map((food) => {
        const isExpired = food.expiryDate < today; 

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
              {food.name} 
              {isExpired ? ' expired ' : ' expires '} 
              on {' '} 
              {new Date(food.expiryDate).toLocaleDateString
                (
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
                onClick={() => onConsume(food.id)}
                aria-label='Mark food as consumed'
              >
                Consume
              </button>
            )}

            {food.isConsumed && (
              <small aria-label="Food already consumed">consumed</small>
            )}
          </li>
        );
      })}
    </ul>
  );
}