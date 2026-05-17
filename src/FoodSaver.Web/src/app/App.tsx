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

  const isDark = theme === 'dark';

  async function loadFoods() {
    const foods = await getFoods();
    setFoods(foods);
  }

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

  function toggleTheme() {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }

  function onScroll() {
    const isScrolled = window.scrollY > 8;
    setScrolled(prev => (prev === isScrolled ? prev : isScrolled));
  }

  useEffect(() => {
    (async () => {
      try{
        const foods = await getFoods();
        setFoods(foods);
      }
      finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className='app-container'>
      <main>
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

        <FoodForm onCreate={handleCreateFood} />

        { isLoading && <p>Loading foods...</p>}
        <FoodList
          foods={foods}
          onConsume={handleConsumeFood}
        />
      </main>
    </div>
  );
}