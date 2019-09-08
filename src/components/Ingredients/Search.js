import React, { useState, useEffect, useRef } from 'react';
import useHttp from '../../hooks/http';
import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();
  const { isLoading, data, error, sendRequest, clearError } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if(enteredFilter === inputRef.current.value){
        const query = enteredFilter.length === 0 || enteredFilter.trim() === '' ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest(`ingredients.json${query}`, 'get');
      }
    }, 500)
    return () => clearTimeout(timer); // clean up func
  },[enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
      if(!isLoading && !error && data){
          const filteredIngredients = [];
          for(let key in data)
            filteredIngredients.push({id: data[key].id, title: data[key].title, amount: data[key].amount, fireRef: key});
          onLoadIngredients(filteredIngredients);
      }
  }, [data, isLoading, error, onLoadIngredients]);

  const errorState = error != null ? <ErrorModal onClose ={clearError}>{error}</ErrorModal> : null;
  const loadingText = isLoading ? <span>Loading...</span> : null;
  return (
    <section className="search">
      {errorState}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {loadingText}
          <input ref={inputRef} type="text" value={enteredFilter} onChange={(event) => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
