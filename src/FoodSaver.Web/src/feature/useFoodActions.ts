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

  const [snackbarFoodId, setSnackbarFoodId] =
    useState<string | null>(null);

  const consumeFood = (id: string) => {
    const food = foods.find(f => f.id === id);

    if (!food) return;

    setUndoAction({
      foodId: id,
      previousQuantity: food.quantity,
    });

    setSnackbarFoodId(id);
    setSnackbar(`${food.name} consumed`);

    setTimeout(() => {
      if (snackbarFoodId) {
        setFoods(prev =>
          prev.filter(f =>
            f.id !== snackbarFoodId || f.quantity > 0
          )
        );
      }

      setUndoAction(null);
      setSnackbar(null);
      setSnackbarFoodId(null);
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
        }
        : f
      )
    );

    setUndoAction(null);
    setSnackbar(null);
    setSnackbarFoodId(null);
  }

  const confirm = () => {
    if (snackbarFoodId) {
      setFoods(prev =>
        prev.filter(f =>
          f.id !== snackbarFoodId || f.quantity > 0
        )
      );
    }

    setUndoAction(null);
    setSnackbar(null);
    setSnackbarFoodId(null);
  }

  return {
    consumeFood,
    undo,
    confirm,
    snackbar,
    snackbarFoodId
  };
}