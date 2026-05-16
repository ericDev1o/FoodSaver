import { useState } from 'react';

import type { CreateFoodRequest } from './types';

type Props = {
  onCreate: (request: CreateFoodRequest) => void;
};

export function FoodForm({ onCreate }: Props) {
  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        onCreate({
          name,
          expiryDate,
        });
      }}
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Food name'
      />

      <input
        type='date'
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
      />

      <button type='submit'>Add</button>
    </form>
  );
}