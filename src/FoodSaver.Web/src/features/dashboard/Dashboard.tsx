import { useSelector } from 'react-redux';

import { 
    selectTotalFoods, 
    selectTotalQuantity, 
    selectExpiringTodayCount, 
    selectExpiringSoonCount, 
    selectNextExpiryFood, 
    selectOldestFood,
    selectExpiringSoonSummary,
    selectOldestFoodDate
} from './dashboardSelectors';

export default function Dashboard() {
    const visibleTotalFoods = useSelector(selectTotalFoods);
    const visibleTotalQuantity = useSelector(selectTotalQuantity);
    const visibleExpiringToday = useSelector(selectExpiringTodayCount);
    const visibleExpiringSoon = useSelector(selectExpiringSoonCount);
    const visibleNextExpiryFood = useSelector(selectNextExpiryFood);

    const globalOldestFood = useSelector(selectOldestFood);
    const globalOldestExpiryDate = useSelector(selectOldestFoodDate);
    const globalExpiringSoonSummary = useSelector(selectExpiringSoonSummary);

    return(
        <section>
            <h2>Dashboard</h2>
            <article>
                <h3>Global insights</h3>
                <p>
                    Oldest food: {globalOldestFood?.name ?? 'None'}
                    {globalOldestFood && ` — expires ${globalOldestExpiryDate}`}
                </p>
                <p>Expiring soon: {globalExpiringSoonSummary.percentage}% ({globalExpiringSoonSummary.count} of {globalExpiringSoonSummary.total})</p>
            </article>

            <article>
                <h3>Inventory summary</h3>
                <p>Total foods: {visibleTotalFoods}</p>
                <p>Total quantity: {visibleTotalQuantity}</p>
                <p>Expiring today: {visibleExpiringToday}</p>
                <p>Expiring soon: {visibleExpiringSoon}</p>
                <p>
                    Next expiry:
                    {' '}
                    {visibleNextExpiryFood?.name ?? 'None'}
                </p>
            </article>
        </section>
    );
} 