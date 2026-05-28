import { 
  useEffect,
  useState 
} from 'react';

import { FoodList } from '../feature/ui/FoodList';
import { FoodForm } from '../feature/ui/FoodForm';

import {
  getFoods,
  createFood
} from '../api/food';

import { useFoodActions } from '../feature/useFoodActions';

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

  const {
    consumeFood,
    undo,
    confirm,
    undoAction
  } = useFoodActions(foods, setFoods);

  async function handleCreateFood(
    request: CreateFoodRequest
  ) 
  {
    const newFood = await createFood(request);

    setFoods(prev => [...prev, newFood]);
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

        {foods.length === 0 ? (
            <p>Add your first food to get started.</p>
          ) : (
            <FoodList
              foods={foods}
              onConsume={consumeFood}
              onUndo={undo}
              onConfirm={confirm}
              undoAction={undoAction}
            />
          )}
      </main>
      <footer>
        <p>2026 FoodSaver · BSD-2 licensed</p>
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