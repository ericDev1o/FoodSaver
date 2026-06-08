import { 
  useDispatch, 
  useSelector 
} from 'react-redux';

import { 
  selectFilter,
  selectSearchQuery,
  selectSort,
  selectUndoAction,
  selectVisibleFoods
} from './foodsSelectors';
import { 
  type FoodsFilter,
  type FoodsSort,
  setSearchQuery,
  setFilterType,
  setSortType,
  consumeFood,
  undoFoodAction,
  confirmFoodAction
} from './foodsSlice';

import './FoodList.css'

export function FoodList() {
  const today = new Date().toISOString().split('T')[0];

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const threeDaysLater = new Date(todayDate);
  threeDaysLater.setDate(todayDate.getDate() + 3);
  const tomorrow = new Date(todayDate);
  tomorrow.setDate(todayDate.getDate() + 1);

  const dispatch = useDispatch();
  const query = useSelector(selectSearchQuery);
  const visibleFoods = useSelector(selectVisibleFoods);
  const filter = useSelector(selectFilter);
  const sort = useSelector(selectSort);
  const undoAction = useSelector(selectUndoAction);

  const activeFoodsCount = visibleFoods.reduce(
    (total, food) => total + food.quantity,
    0
  );
  const foodLabel = activeFoodsCount === 1 
    ? 'food' 
    : 'foods';
  
  return (
    <>
      <div className='food-list-controls'>
        <label htmlFor='search'>Search:</label>
        <input
          id='search'
          type='search'
          placeholder='Search foods...'
          value={query}
          onChange={(event) =>
            dispatch(setSearchQuery(event.target.value))
          }
        />

        <label htmlFor='filter'>Filter:</label>
        <select
          id='filter'
          value={filter}
          onChange={(e) =>
            dispatch(setFilterType(e.target.value as FoodsFilter))
          }
        >
          <option value='all'>All fresh foods</option>
          <option value='expiringSoon'>Expiring soon</option>
          <option value='expiringToday'>Expiring today</option>
          <option value="lowStock">Low stock</option>
        </select>

        <label htmlFor='sort'>Sort:</label>
        <select
          id='sort'
          value={sort}
          onChange={(e) =>
            dispatch(setSortType(e.target.value as FoodsSort))
          }
        >
          <option value='expiryAsc'>
            Expiry date
          </option>

          <option value='nameAsc'>
            Name A → Z
          </option>

          <option value='nameDesc'>
            Name Z → A
          </option>
        </select>
      </div>
      
      <p>
          {activeFoodsCount} {foodLabel}
          {' '}to consume
        </p>
      <ul>
        {visibleFoods.map((food) => {
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
                {food.quantity === 1 && (
                  <span className='low-stock-badge'>
                    Low stock
                  </span>
                )}
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
                  dispatch(consumeFood({id: food.id, qty: 1}));
                }}
                >
                  {food.quantity === 1
                  ? 'Consume'
                  : 'Consume 1'}
                </button>

                {food.quantity > 1 && (
                  <button onClick={() => {
                    dispatch(consumeFood({id: food.id, qty: food.quantity}));
                  }}
                  >
                    Consume all
                  </button>
                )}

                {undoAction?.foodId === food.id && (
                  <div className='actions'>
                    <button 
                      className='undo'
                      onClick={() => dispatch(undoFoodAction())}>
                      Undo
                    </button>

                    <button onClick={() => dispatch(confirmFoodAction())}>
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