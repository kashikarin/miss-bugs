import { useState } from "react"
import { bugService } from "../services/bug.service"
import { utilService } from "../services/util.service"


export function BugFilter({filterBy, onSetFilterBy}) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    console.log("🚀 ~ filterByToEdit:", filterByToEdit)

    function handleChange({target}){
        let {name: field, value} = target
        console.log(field, value)
        setFilterByToEdit(prevFilterByToEdit => ({...prevFilterByToEdit, [field]: value}))
    }

    function handleSubmit(ev){
        ev.preventDefault()
        ev.stopPropagation()
        onSetFilterBy(filterByToEdit)
    }
    
    return(
        <form onSubmit={handleSubmit} className="bug-filter-form">
            <h1>Filter Our Bugs</h1>
            <div className="bug-filter-category title">
                <label htmlFor="title">Title: </label>
                <input type="text" id='title' name='title' value={filterByToEdit?.title ?? ''} onChange={handleChange}/>
            </div>
            <div className="bug-filter-category severity">
                <label htmlFor="severity">Severity: </label>
                <input type="number" id='severity' name='severity' value={filterByToEdit?.severity ?? ''} onChange={handleChange}/>
            </div>
            <div className="bug-filter-category createdAt">
                <label htmlFor="createdAt">Creation Date: </label>
                <input type="date" id='createdAt' name='createdAt' value={filterByToEdit?.createdAt ?? ''} onChange={handleChange}/>
            </div>
            <div className="filter-buttons-containter">
                <button>Set Filter</button>
                <button onClick={() => setFilterByToEdit(bugService.getDefaultFilter())}>Reset Filter</button>
            </div>
            

        </form>
    )
}