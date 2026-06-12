import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

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

    const { i18n, t } = useTranslation();

    const formatted = globalOldestExpiryDate
    ? globalOldestExpiryDate.toLocaleDateString(i18n.language, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
        })
    : 'None';

    return(
        <section>
            <h2>{t('dashboard')}</h2>
            <article>
                <h3>{t('globalInsights')}</h3>
                <p>
                    {t('nextExpiry')}: {globalNextExpiringFood?.name ?? t('none')}
                    {globalNextExpiringFood && ` — ${t('expires')} ${formatted}`}
                </p>
                <p>
                    {t('expiringSoon')}: {' '}
                        {globalExpiringSoonSummary.percentage}% 
                        (
                            {globalExpiringSoonSummary.count} 
                            {' '} {t('of')} {' '}
                            {globalExpiringSoonSummary.total}
                        )
                </p>
                <p>{t('lowStockFoods')}: {globalLowStockCount}</p>
            </article>

            <article>
                <h3>{t('inventorySummary')}</h3>
                <p>{t('totalFoods')}: {visibleTotalFoods}</p>
                <p>{t('totalQuantity')}: {visibleTotalQuantity}</p>
                <p>{t('expiringToday')}: {visibleExpiringToday}</p>
                <p>{t('expiringSoon')}: {visibleExpiringSoon}</p>
            </article>
        </section>
    );
} 