import { useState } from 'react';

import type {
  Food,
  UndoAction,
} from './types';


export function useFoodActions(
  foods: Food[],
  setFoods: React.Dispatch<React.SetStateAction<Food[]>>
) {
  const [undoAction, setUndoAction] =
    useState<UndoAction | null>(null);

  const [snackbar, setSnackbar] =
    useState<string | null>(null);

  const consumeFood = (
      id: string,
      qty: number
  ) => {
    const food = foods.find(f => f.id === id);

    if (!food) return;

    setUndoAction({
      foodId: id,
      previousQuantity: food.quantity,
      qty
    });

    setSnackbar(`${food.name} consumed`);

    setTimeout(() => {
      setUndoAction(null);
      setSnackbar(null);
    }, 5000
    );
  };

  const undo = () => {
    if (!undoAction) return;

    setUndoAction(null);
    setSnackbar(null);
  }

  const confirm = () => {
     if (!undoAction) return;

  setFoods(prev =>
    prev
      .map(f =>
        f.id === undoAction.foodId
          ? {
              ...f,
              quantity: Math.max(
                0,
                f.quantity - undoAction.qty
              ),
            }
          : f
      )
      .filter(f => f.quantity > 0)
  );

    setUndoAction(null);
    setSnackbar(null);
  }

  return {
    consumeFood,
    undo,
    confirm,
    snackbar
  };
}