import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if(enteredFilter == inputRef.current.value){
        const query = enteredFilter.length == 0 || enteredFilter.trim() == '' ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
          axios.get(`ingredients.json${query}`).then(r => r.data).then(response => {
          const filteredIngredients = []
          for(let rd in response){
            const key = response[rd];
            const ingredient = {id: key.id, title: key.title, amount: key.amount, fireRef: rd};
            filteredIngredients.push(ingredient);
          }
          onLoadIngredients(filteredIngredients);
        });
      }
    }, 500)
    return () => clearTimeout(timer); // clean up func
  },[enteredFilter, onLoadIngredients, inputRef])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input ref={inputRef} type="text" value={enteredFilter} onChange={(event) => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
