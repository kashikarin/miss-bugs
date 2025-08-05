import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { bugService } from "../services/bug.service.js"
import { utilService } from "../services/util.service.js"


export function useFilterSearchParams(onSetFilterBy) {
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        onSetFilterBy(bugService.getFilterFromSearchParams(searchParams))
    }, [])

    function setExistFilterSearchParams(filterBy) {
        setSearchParams(utilService.getExistingProperties(filterBy))
    }

    return setExistFilterSearchParams
}