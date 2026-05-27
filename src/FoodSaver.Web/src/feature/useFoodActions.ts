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

    const nextQuantity = Math.max(0, food.quantity - qty);

    const nextIsConsumed = nextQuantity === 0;

    setFoods(prev =>
      prev.map(f =>
        f.id === id
          ? {
              ...f,
              quantity: nextQuantity,
              isConsumed: nextIsConsumed
            }
          : f
      )
    );

    setUndoAction({
      foodId: id,
      previousQuantity: food.quantity,
      previousIsConsumed: food.isConsumed
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

    setFoods(prev => 
      prev.map(f => 
        f.id === undoAction.foodId
        ? {
            ...f,
            quantity: undoAction.previousQuantity,
            isConsumed: undoAction.previousIsConsumed
        }
        : f
      )
    );

    setUndoAction(null);
    setSnackbar(null);
  }

  const confirm = () => {
    setUndoAction(null);
    setSnackbar(null);
  }

  return {
    consumeFood,
    undo,
    confirm,
    snackbar,
    snackbarFoodId: undoAction?.foodId ?? null
  };
}