import type { Food } from './types';

type Props = {
  foods: Food[];
  onConsume: (id: string) => void;
};

export function FoodList({ foods, onConsume }: Props) {
  return (
    <ul>
      {foods.map((food) => (
        <li key={food.id}>
          <span>
            {food.name} - {food.expiryDate}
          </span>

          {!food.isConsumed && (
            <button onClick={() => onConsume(food.id)}>
              Consume
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}