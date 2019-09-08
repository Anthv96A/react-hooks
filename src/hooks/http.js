import { useReducer, useCallback } from 'react';
import axios from 'axios';

const initialHttpState =  {
    loading: false,
    error: null,
    data: null, 
    extra: null,
    identifier: null
 };

const httpReducer = (currentState, action) => {
    switch(action.type){
        case 'Send':
          return { loading: true, error: null, data: null, extra: null, identifier: action.identifier };
        case 'Response':
           return { ...currentState, loading: false, data: action.response, extra: action.extra };
        case 'Error':
          return { error: action.error };
        case 'Finally':
          return { ...currentState, loading: false };
        case 'Clear':
          return initialHttpState;
        default:
          throw new Error('Not viable action type');
    }
}

const useHttp = () => {
    const [httpState, httpDispatch] = useReducer(httpReducer, initialHttpState);

    const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
        httpDispatch({type: 'Send', identifier: reqIdentifier});
        axios[method](url, body)
            .then(r => r.data)
            .then(a => httpDispatch({type: 'Response', response: a, extra: reqExtra}))
            .catch(e => httpDispatch({type: 'Error', error: e.message}))
            .finally(() => httpDispatch({type: 'Finally'}));
    },[]);

    const clearError = () => httpDispatch({ type: 'Clear'});

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest,
        reqExtra: httpState.extra,
        identifier: httpState.identifier,
        clearError: clearError
    };
}

export default useHttp;