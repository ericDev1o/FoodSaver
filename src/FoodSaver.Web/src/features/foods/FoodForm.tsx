import { 
  useCallback, 
  useMemo, 
  useState } 
from 'react';

import type { CreateFoodRequest } from '../types';

import './FoodForm.css';

type Props = {
  onCreate: (request: CreateFoodRequest) => void;
};

export function FoodForm({ onCreate }: Props) {
  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const todayString = useMemo(() => getTodayDateString(), []);

  const handleSubmit = useCallback(() => {
    setError(null);

    const validationError = validateFoodInput(name, expiryDate, quantity);

    if (validationError) {
      setError(validationError);
      return;
    }

    onCreate({
      name: name.trim(),
      expiryDate,
      quantity
    });
  }, [name, expiryDate, quantity, onCreate]);
  
  return (
    <>
      <p 
        className='error-text'
        aria-live='assertive'
      >
        {error || ''}
      </p>
    
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <label 
          className='sr-only'
          htmlFor='name'
        >
          Food name
        </label>
        <input
          id='name'
          value={ name }
          onChange={(e) => {setName(e.target.value)}}
          placeholder='Food name'  
        />

        <label
          className='sr-only'
          htmlFor='date'
        >
          Use-by
        </label>
        <input
          id='date'
          type='date'
          value={ expiryDate }
          min={todayString}
          onChange={(e) => {setExpiryDate(e.target.value)}}
        />

        <label 
          className='sr-only' 
          htmlFor='quantity'
        >
          Quantity
        </label>
        <input
          id='quantity' 
          type='number'
          min='1'
          value={ quantity }
          onChange={(e) => {setQuantity(e.target.valueAsNumber)}}
        />

        <button type='submit'>Add</button>
      </form>
    </>
  );
}

function validateFoodInput(
  name: string,
  expiry: string,
  quantity: number
): string | null {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return 'Food name is required.';
  }

  if (!expiry) {
    return 'Expiration date is required.';
  }

  if (expiry < getTodayDateString()) {
    return 'Expiration date must be today or in the future.';
  }

  if (quantity < 1) {
    return 'Quantity must be at least 1.';
  }

  return null;
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}