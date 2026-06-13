import { 
  useCallback,
  useEffect,
  useState 
} from 'react';

import { useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';

import { addFood } from '../features/foods/foodsSlice';

import { FoodList } from '../features/foods/FoodList';
import { FoodForm } from '../features/foods/FoodForm';
import Dashboard from '../features/dashboard/Dashboard';

import {
  getFoods,
  createFood
} from '../api/food';

import type { CreateFoodRequest } from '../features/types';

import './App.css';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const { i18n, t } = useTranslation();

  const setLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'fr' : 'en';
    setLanguage(next);
  };

  const dispatch = useDispatch();

  const handleCreateFood = useCallback(async (
    request: CreateFoodRequest
  ) =>
  {
    try{
      const newFood = await createFood(request);

      dispatch(addFood({
      ...newFood,
      id: newFood.id ?? crypto.randomUUID(),
      }));
    } catch {
      setError('Failed to create food.')
    }
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.lang = i18n.language;

    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('metaDescription'));
  }, [i18n.language, t]);

  useEffect(() => {
    (async () =>  {
      try {
        const fetchedFoods = await getFoods();

        fetchedFoods.forEach(food =>
          dispatch(addFood({
            ...food,
            id: food.id ?? crypto.randomUUID()
          }))
        );
      } catch { 
        setError('Unable to load foods.'); 
      } finally {
        setIsLoading(false);
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

   if(error)
    return (
    <p
      className='error-text'
      aria-live='assertive'
    >
      {error}
    </p>
    );

  return (
    <div className='app-container'>
      <header className={`app-header ${scrolled ? 'scrolled' : ''}`}>
        <h1>FoodSaver</h1>
         <button 
          className='theme-toggle'
          onClick={toggleLanguage}>
          {i18n.language === 'en' ? '🇫🇷 Français' : '🇬🇧 English'}
        </button>
        <button
          className='theme-toggle'
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          aria-pressed={theme === 'dark'}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </header>
      <main>
         <p>{t('tagLine')}</p>
        {isLoading ? (
          <p>Loading foods...</p>
        ) : error ? (
          <p
            className='error-text'
            aria-live='assertive'
          >
            {error}
          </p>
        ) : (
          <>
            <FoodForm onCreate={handleCreateFood} />
            <Dashboard />
            <FoodList />
          </>
        )}
      </main>
      <footer>
        <p>2026 FoodSaver · BSD-2 licensed</p>
      </footer>
    </div>
  );

  function toggleTheme() {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }
}