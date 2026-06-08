import { useSelector } from 'react-redux';

import { 
    selectTotalFoods, 
    selectTotalQuantity, 
    selectExpiringTodayCount, 
    selectExpiringSoonCount, 
    selectNextExpiringFood,
    selectExpiringSoonSummary,
    selectOldestFoodDate
} from './dashboardSelectors';
import { selectLowStockFoods } from '../foods/foodsSelectors';

export default function Dashboard() {
    const visibleTotalFoods = useSelector(selectTotalFoods);
    const visibleTotalQuantity = useSelector(selectTotalQuantity);
    const visibleExpiringToday = useSelector(selectExpiringTodayCount);
    const visibleExpiringSoon = useSelector(selectExpiringSoonCount);

    const globalNextExpiringFood = useSelector(selectNextExpiringFood);
    const globalOldestExpiryDate = useSelector(selectOldestFoodDate);
    const globalExpiringSoonSummary = useSelector(selectExpiringSoonSummary);
    const globalLowStockCount = useSelector(selectLowStockFoods).length;

    return(
        <section>
            <h2>Dashboard</h2>
            <article>
                <h3>Global insights</h3>
                <p>
                    Oldest food: {globalNextExpiringFood?.name ?? 'None'}
                    {globalNextExpiringFood && ` — expires ${globalOldestExpiryDate}`}
                </p>
                <p>Expiring soon: {globalExpiringSoonSummary.percentage}% ({globalExpiringSoonSummary.count} of {globalExpiringSoonSummary.total})</p>
                <p>Low stock foods: {globalLowStockCount}</p>
            </article>

            <article>
                <h3>Inventory summary</h3>
                <p>Total foods: {visibleTotalFoods}</p>
                <p>Total quantity: {visibleTotalQuantity}</p>
                <p>Expiring today: {visibleExpiringToday}</p>
                <p>Expiring soon: {visibleExpiringSoon}</p>
            </article>
        </section>
    );
} 