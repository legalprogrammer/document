import React from 'react';
import Header from './Components/app/Header/header';
import Search from './Components/app/Seachbar/Searchbar'
import 'semantic-ui-css/semantic.min.css'
import './App.css';
function App() {
      return (
        <React.Fragment>
          <div>
          <Header/>
          <Search act={undefined}/>
          </div>
        </React.Fragment>
      );
    }
export default App;