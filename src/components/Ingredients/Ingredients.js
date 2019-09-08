import React, { useReducer, useEffect, useCallback, useMemo } from 'react';
import useHttp from '../../hooks/http';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

// better state management
const ingredientReducer = (currentState, action) => {
    switch(action.type){
        case 'Set':
          return action.ingredients;
        case 'Add':
          return [...currentState, action.ingredient];
        case 'Delete':
          const newState = [...currentState];
          const index = newState.findIndex(t => t.fireRef === action.fireRef);
          newState.splice(index, 1);
          return newState;
        default:
          throw new Error('Not viable action type');
    }
}

function Ingredients() {

  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, error, data, sendRequest, reqExtra, identifier, clearError} = useHttp();

  useEffect(() => {
      if(reqExtra && !isLoading && identifier === 'Delete_Ingredient')
        dispatch({type: 'Delete', fireRef: reqExtra});
      else if(reqExtra && !isLoading && identifier === 'Add_Ingredient')
        dispatch({type: 'Add', ingredient: {fireRef: data.name , ...reqExtra}})
      
  }, [data, reqExtra, identifier, isLoading])

  const addIngrendientsHandler = useCallback(ingredient => {
      sendRequest('ingredients.json', 'post', ingredient, ingredient, 'Add_Ingredient');
  }, [sendRequest]);

  const deleteIngrendientHandler = useCallback(fireRef => {
      sendRequest(`ingredients/${fireRef}.json`, 'delete', null, fireRef, 'Delete_Ingredient')
  }, [sendRequest]);

  const filterHandler = useCallback(filteredIngredients => {
      dispatch({type: 'Set', ingredients: filteredIngredients});
  }, []);

  const errorState = error != null ? <ErrorModal onClose ={clearError}>{error}</ErrorModal> : null;

  const ingredientList = useMemo(() => {
     return <IngredientList ingredients={ingredients} onRemoveItem={deleteIngrendientHandler}/>
    }, [ingredients, deleteIngrendientHandler]);

  return (
    <div className="App">
      {errorState}
      <IngredientForm addIngredient={addIngrendientsHandler} loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filterHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
 