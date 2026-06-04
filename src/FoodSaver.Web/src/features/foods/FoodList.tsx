import { 
  useDispatch, 
  useSelector 
} from 'react-redux';

import { selectSearchQuery } from '../search/selectors';
import { setQuery } from '../search/searchSlice';

import type { 
  Food, 
  UndoAction
} from '../types';

import './FoodList.css'

type Props = {
  foods: Food[];
  onConsume: (
    id: string,
    qty: number
  ) => void;
  onUndo: () => void;
  onConfirm: () => void;
  undoAction: UndoAction | null;
};

export function FoodList({ 
  foods, 
  onConsume,
  onUndo,
  onConfirm,
  undoAction
 }: Props) {
  const today = new Date().toISOString().split('T')[0];

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const threeDaysLater = new Date(todayDate);
  threeDaysLater.setDate(todayDate.getDate() + 3);
  const tomorrow = new Date(todayDate);
  tomorrow.setDate(todayDate.getDate() + 1);

  const dispatch = useDispatch();
  const query = useSelector(selectSearchQuery);

  const visibleFoods = foods.filter(
    food =>
      food.quantity > 0
      &&
      food.expiryDate >= today
  );

  const searchedFoods = visibleFoods.filter(food => 
    food.name
      .toLowerCase()
       .startsWith(query.toLowerCase())
  );

  const sortedFoods = [...searchedFoods].sort(
    (a, b) => a.expiryDate.localeCompare(b.expiryDate)
  );

  const activeFoodsCount = sortedFoods.reduce(
    (total, food) => total + food.quantity,
    0
  );
  const foodLabel = activeFoodsCount === 1 
    ? 'food' 
    : 'foods';
  
  return (
    <>
      <input
        type='search'
        placeholder='Search foods...'
        value={query}
        onChange={(event) =>
          dispatch(setQuery(event.target.value))
        }
      />
      
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
            <li key={food.id}>
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
                <button onClick={() => {
                  onConsume(food.id, 1);
                }}
                >
                  {food.quantity === 1
                  ? 'Consume'
                  : 'Consume 1'}
                </button>

                {food.quantity > 1 && (
                  <button onClick={() => {
                    onConsume(food.id, food.quantity);
                  }}
                  >
                    Consume all
                  </button>
                )}

                {undoAction?.foodId === food.id && (
                  <div className='actions'>
                    <button 
                      className='undo'
                      onClick={() => onUndo()}>
                      Undo
                    </button>

                    <button onClick={() => onConfirm()}>
                      Confirm
                    </button>
                  </div>
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
    </>
  );
}