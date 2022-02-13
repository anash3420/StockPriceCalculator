import logo from './logo.svg';
import './App.css';
import React, {useState,useEffect} from 'react';

import CsvUpload from './Components/CsvUpload';
import DataDisplay from './Components/DataDisplay';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [onRefresh, setOnRefresh] = useState(false);
  useEffect(() => {
    axios.get('http://localhost:5000/api/data')
    .then(res => {
      console.log(res.data);
      setData(res.data);
    })
    .catch(err => {
      console.log(err);
    });
  }, [onRefresh]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className='heading'>Stock Price Calculator</h1>
      <CsvUpload onReset={() => {setData([])}} onRefresh={() => {setOnRefresh(!onRefresh)}} />
      <DataDisplay data={data} />
      </header>
    </div>
  );
}

export default App;
