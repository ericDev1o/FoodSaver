import { useState } from 'react';

import type { CreateFoodRequest } from './types';

type Props = {
  onCreate: (request: CreateFoodRequest) => void;
};

export function FoodForm({ onCreate }: Props) {
  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  function handleSubmit() {
    setError(null);

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Food name is required.');
      return;
    }

    if (!expiryDate) {
      setError('Expiration date is required.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    if (expiryDate < today) {
      setError('Expiration date must be today or in the future.');
      return;
    }

    if (quantity < 1) {
      setError('Quantity must be at least 1. Please try again.')
      return;
    }

    onCreate({
      name: trimmedName,
      expiryDate,
      quantity
    });
  }
  
  return (
    <>
      <div className="error-container">
        <p className="error-text">
          {error ?? "\u00A0"}
        </p>
      </div>
    
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
          value={ name }
          onChange={(e) => {setName(e.target.value)}}
          placeholder='Food name'
          
        />

        <input
          type='date'
          value={ expiryDate }
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
          onChange={(e) => {setQuantity(Number(e.target.value))}}
        />

        <button type='submit'>Add</button>
      </form>
    </>
  );
}