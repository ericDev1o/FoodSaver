import { 
  useDispatch, 
  useSelector 
} from 'react-redux';
import { useTranslation } from 'react-i18next';

import i18n from '../../i18n';

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

  const { t } = useTranslation();
  
  return (
    <>
      <div className='food-list-controls'>
        <label htmlFor='search'>{t('search')}:</label>
        <input
          id='search'
          type='search'
          placeholder={t('searchPlaceholder')}
          value={query}
          onChange={(event) =>
            dispatch(setSearchQuery(event.target.value))
          }
        />

        <label htmlFor='filter'>{t('filter')}:</label>
        <select
          id='filter'
          value={filter}
          onChange={(e) =>
            dispatch(setFilterType(e.target.value as FoodsFilter))
          }
        >
          <option value='all'>{t('allFoods')}</option>
          <option value='expiringSoon'>{t('expiringSoonFilter')}</option>
          <option value='expiringToday'>{t('expiringTodayFilter')}</option>
          <option value="lowStock">{t('lowStockFilter')}</option>
        </select>

        <label htmlFor='sort'>{t('sort')}:</label>
        <select
          id='sort'
          value={sort}
          onChange={(e) =>
            dispatch(setSortType(e.target.value as FoodsSort))
          }
        >
          <option value='expiryAsc'>
            {t('sortExpiryAsc')}
          </option>

          <option value='nameAsc'>
            {t('sortNameAsc')}
          </option>

          <option value='nameDesc'>
            {t('sortNameDesc')}
          </option>
        </select>
      </div>
      
      <p>{t('foodsToConsume', { count: activeFoodsCount })}</p>

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

          const date = new Date(food.expiryDate);
          const formattedDate = date.toLocaleDateString(i18n.language, {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          return (
            <li key={food.id}>
              <span>
                {food.name} x{food.quantity}
                {' '}
                {food.quantity === 1 && (
                  <span className='low-stock-badge'>
                    {t('badgeLowStock')}
                  </span>
                )}
                {isExpired ? t('expired') : t('expires')} 
                {' '} 
                {formattedDate}
              </span>

              {food.quantity > 0 && (
              <>
                <button onClick={() => {
                  dispatch(consumeFood({id: food.id, qty: 1}));
                }}
                >
                  {food.quantity === 1
                  ? t('consume')
                  : t('consumeOne')}
                </button>

                {food.quantity > 1 && (
                  <button onClick={() => {
                    dispatch(consumeFood({id: food.id, qty: food.quantity}));
                  }}
                  >
                    {t('consumeAll')}
                  </button>
                )}

                {undoAction?.foodId === food.id && (
                  <div className='actions'>
                    <button 
                      className='undo'
                      onClick={() => dispatch(undoFoodAction())}>
                      {t('undo')}
                    </button>

                    <button onClick={() => dispatch(confirmFoodAction())}>
                      {t('confirm')}
                    </button>
                  </div>
                )}
            </>
            )}

              {isSoonToExpire && (
                <span className='soon-badge'>
                  {t('badgeExpiringSoon')}
                </span>
              )}

              {isExpiringToday && (
                <span className='today-badge'>
                  {t('badgeExpiringToday')}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}