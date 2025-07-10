import './App.css'
import { OptionsRow } from './sections/OptionsRow'
import { TableSection } from './sections/TableSection'
import { TopBar } from './sections/TopBar'

function App() {

  return (
    <div className='flex flex-col '>
      <TopBar></TopBar>
      <OptionsRow></OptionsRow>
      <TableSection></TableSection>
    </div>
  )
}

export default App
