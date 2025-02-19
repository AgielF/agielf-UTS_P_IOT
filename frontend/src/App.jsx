import { useState } from 'react'
import Dashboard from './components/Dashboard/Dashboard'
import {Sidebar} from './components/Sidebar/Sidebar'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <main className='grid gap-4 p-4 grid-cols-[220px,_1fr]'>

    <Sidebar/>
    <Dashboard/>

    </main>

     </>
  )
}

export default App
