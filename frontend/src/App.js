import './App.css'
import React, {useEffect, useState} from 'react'
import axios from 'axios'

const App = () => {

    const [data, setData] = useState(null)

    useEffect( () => {
        const res = async () => {
            const { data } = await axios.get('/api')

            setData(data)
        }

        res()
    }, [])
    
    data && console.log( data.service)
    
    return (
      <div className="App">
        <header className="App-header">

        </header>
      </div>
    );
}

export default App;
