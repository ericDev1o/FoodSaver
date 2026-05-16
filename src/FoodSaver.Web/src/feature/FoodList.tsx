import type { Food } from './types';

type Props = {
  foods: Food[];
  onConsume: (id: string) => void;
};

export function FoodList({ foods, onConsume }: Props) {
  return (
    <ul>
      {foods.map((food) => (
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
            {food.name} - {food.expiryDate}
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
            <small>Consumed</small>
          )}
        </li>
      ))}
    </ul>
  );
}