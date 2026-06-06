import { useSelector } from 'react-redux';

import { 
    selectTotalFoods, 
    selectTotalQuantity, 
    selectExpiringTodayCount, 
    selectExpiringSoonCount, 
    selectNextExpiryFood 
} from './dashboardSelectors';

export default function Dashboard() {
    const totalFoods = useSelector(selectTotalFoods);

    const totalQuantity = useSelector(selectTotalQuantity);

    const expiringToday = useSelector(selectExpiringTodayCount);

    const expiringSoon = useSelector(selectExpiringSoonCount);

    const nextExpiryFood = useSelector(selectNextExpiryFood);

    return(
        <section>
            <h2>Dashboard</h2>

            <p>Total foods: {totalFoods}</p>
            <p>Total quantity: {totalQuantity}</p>
            <p>Expiring today: {expiringToday}</p>
            <p>Expiring soon: {expiringSoon}</p>

            <p>
                Next expiry:
                {' '}
                {nextExpiryFood?.name ?? 'None'}
            </p>
        </section>
    );
} 