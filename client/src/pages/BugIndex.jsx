import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { useState, useEffect } from 'react'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { useFilterSearchParams } from '../customHooks/useFilterSearchParams.js'

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [filterBy, setFilterBy] = useState()
  console.log("🚀 ~ filterBy:", filterBy)
  const setExistSearchParams = useFilterSearchParams(onSetFilterBy)

  useEffect(() => {
    loadBugs(filterBy)
  }, [filterBy])


  function onSetFilterBy(filterObj) {
    setFilterBy(prevFilterBy => ({...prevFilterBy, ...filterObj}))
  }

  async function loadBugs(filterBy) {
    const bugs = await bugService.query(filterBy)     
    setBugs(bugs)
    setExistSearchParams(filterBy)
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      console.log('Deleted Succesfully!')
      setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
      showSuccessMsg('Bug removed')
    } catch (err) {
      console.log('Error from onRemoveBug ->', err)
      showErrorMsg('Cannot remove bug')
    }
  }

  async function onAddBug() {
    const bug = {
      title: prompt('Bug title?'),
      description: prompt('Describe the bug in a few words'),
      severity: +prompt('Bug severity?'),
    }
    try {
      const savedBug = await bugService.save(bug)
      console.log('Added Bug', savedBug)
      setBugs(prevBugs => [...prevBugs, savedBug])
      showSuccessMsg('Bug added')
    } catch (err) {
      console.log('Error from onAddBug ->', err)
      showErrorMsg('Cannot add bug')
    }
  }

  async function onEditBug(bug) {
    const severity = +prompt('New severity?')
    const bugToSave = { ...bug, severity }
    try {

      const savedBug = await bugService.save(bugToSave)
      console.log('Updated Bug:', savedBug)
      setBugs(prevBugs => prevBugs.map((currBug) =>
        currBug._id === savedBug._id ? savedBug : currBug
      ))
      showSuccessMsg('Bug updated')
    } catch (err) {
      console.log('Error from onEditBug ->', err)
      showErrorMsg('Cannot update bug')
    }
  }

  return (
    <main className="main-layout">
      <h3>Bugs App</h3>
      <main>
        <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy}/>
        <button onClick={onAddBug}>Add Bug ⛐</button>
        {!Array.isArray(bugs) ?
          <h1>Loading...</h1> 
            :
          <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />}
      </main>
    </main>
  )
}
