import './App.css'
import { OptionsRow } from './sections/OptionsRow'
import { TopBar } from './sections/TopBar'

function App() {

  return (
    <div className='flex flex-col '>
      <TopBar></TopBar>
      <OptionsRow></OptionsRow>
    </div>
  )
}

export default App
