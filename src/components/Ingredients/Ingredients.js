import React, { useReducer, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import axios from 'axios';

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

const httpReducer = (currentState, action) => {
    switch(action.type){
        case 'Send':
          return {loading: true, error: null};
        case 'Response':
           return {...currentState, loading: false};
        case 'Error':
          return {error: action.error};
        case 'Finally':
          return {...currentState, loading: false};
        case 'Clear':
          return {...currentState, error: null};
        default:
          throw new Error('Not viable action type');
    }
}

function Ingredients() {

  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, httpDispatch] = useReducer(httpReducer, {loading: false, error: null});

  useEffect(() => {
    console.log(ingredients)
  }, [ingredients])


  const addIngrendientsHandler = ingredient => {
      httpDispatch({type: 'Send'});
      axios.post('ingredients.json', ingredient)
        .then(r => r.data)
        .then(data =>  dispatch({type: 'Add', ingredient: {fireRef: data.name , ...ingredient}}))
        .catch(e => httpDispatch({type: 'Error',action: e.message}))
        .finally(() => httpDispatch({type: 'Finally'}));
  };

  const deleteIngrendientHandler = fireRef => {
    httpDispatch({type: 'Send'});
    axios.delete(`ingredients/${fireRef}.json`)
        .then(a => {
            httpDispatch({type: 'Response'});
            dispatch({type: 'Delete'}, {fireRef: fireRef}) 
          })
        .catch(e => httpDispatch({type: 'Error', error: e.message}))
        .finally(() => httpDispatch({type: 'Finally'}));
  }
  const filterHandler = useCallback(filteredIngredients => {
      dispatch({type: 'Set', ingredients: filteredIngredients});
  }, []);

  const errorState = httpState.error != null ? <ErrorModal onClose ={() => httpDispatch({type:'Clear'})}>{httpState.error}</ErrorModal> : null;

  return (
    <div className="App">
      {errorState}
      <IngredientForm addIngredient={addIngrendientsHandler} loading={httpState.loading}/>

      <section>
        <Search onLoadIngredients={filterHandler}/>
        <IngredientList ingredients={ingredients} onRemoveItem={deleteIngrendientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
