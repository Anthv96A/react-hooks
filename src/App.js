import React, { useContext } from 'react';
import Auth from './components/Auth';
import Ingredients from './components/Ingredients/Ingredients';
import { AuthContext } from './context/auth-context';
const App = props => {
  const authContext = useContext(AuthContext);

  let context = <Auth/>
  if(authContext.isAuth){
    context = <Ingredients/>
  }

  return context;
};

export default App;
