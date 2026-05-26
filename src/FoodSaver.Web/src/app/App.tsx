import { 
  useEffect,
  useState 
} from 'react';

import { FoodList } from '../feature/FoodList';
import { FoodForm } from '../feature/FoodForm';

import {
  getFoods,
  createFood,
  consumeFood,
} from '../api/food';

import type {
  Food,
  CreateFoodRequest,
} from '../feature/types';

import './App.css';

export default function App() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const activeFoodsCount = foods.filter(food => !food.isConsumed).length;

  const foodLabel = activeFoodsCount === 1 ? "food" : "foods";

  async function handleCreateFood(
    request: CreateFoodRequest
  ) {
    await createFood(request);
    await loadFoods();
  }

  async function handleConsumeFood(id: string) {
    await consumeFood(id);
    await loadFoods();
  }

  useEffect(() => {
    loadFoods()
    .catch(() => setError("Unable to load foods."))
    .finally(() => setIsLoading(false));
  }, []);

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

  if(isLoading)
    return <p>Loading foods...</p>

  if(error)
    return (
    <p
      className='error-text'
      role='alert'
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
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          aria-pressed={theme === 'dark'}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </header>
      <main>
        <FoodForm onCreate={handleCreateFood} />

        <p>
          {activeFoodsCount} {foodLabel}
          {' '}to consume
        </p>

        {foods.length === 0 ? (
            <p>Add your first food to get started.</p>
          ) : (
            <FoodList
              foods={foods}
              onConsume={handleConsumeFood}
            />
          )}
      </main>
      <footer>
        <p>&copy; 2026 FoodSaver. All rights reserved.</p>
      </footer>
    </div>
  );

  async function loadFoods() {
    const foods = await getFoods();
    setFoods(foods);
  }

  function toggleTheme() {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }
}