import React, { useState } from 'react';
import { v4 } from 'uuid';
import Card from '../UI/Card';
import LoadingIndictor from '../UI/LoadingIndicator';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {

  const [nameState, setNameState] = useState('');
  const [amountState, setAmountState] = useState('');

  const submitHandler = event => {
    event.preventDefault();
    const ingredient = {
        title: nameState,
        amount: amountState,
        id: v4()
    }

    props.addIngredient(ingredient);
  };

  const isLoading = props.loading ? <LoadingIndictor/> : null;

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" value={nameState} id="title"
             onChange={(e) => setNameState(e.target.value)} />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" value={amountState} id="amount"
            onChange={(e) => setAmountState(e.target.value)} />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {isLoading}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
