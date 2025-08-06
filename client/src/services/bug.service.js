
import Axios from 'axios'

const axios = new Axios.create({withCredentials: true})
const BASE_URL = '//localhost:3030/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getFilterFromSearchParams,
    getDefaultFilter
}


async function query(filterBy = {}) {
    const {title, createdAt, severity} = filterBy
    
    try {
        let {data: bugs} = await axios.get(BASE_URL)
        if (title) {
            bugs = bugs.filter((bug) =>
            bug.title.toLowerCase().includes(title.toLowerCase()))
        }
        if (severity) {
            bugs = bugs.filter((bug) => bug.severity >= severity)
        }
        if (createdAt) {
            const createdAtTimestamp = new Date(createdAt).getTime()
            bugs = bugs.filter((bug) => bug.createdAt >= createdAtTimestamp)
        }
        console.log(bugs)
        return bugs
    } catch(err) {
        console.error('Oops', err)
        throw err
    }
}

async function getById(bugId) {
    const {data: bug} = await axios.get(BASE_URL + '/' + bugId)
    return bug
}
async function remove(bugId) {
    const res = await axios.get(BASE_URL + '/' + bugId + '/' + 'remove')
    return res.data
}
async function save(bug) {
    let queryStr = `save?title=${bug.title}&severity=${bug.severity}&description=${bug.description}`
    if (bug._id){
        queryStr += `&_id=${bug._id}&createdAt=${bug.createdAt}`
    }
    const res = await axios.get(BASE_URL + '/' + queryStr)
    return res.data
}

function getFilterFromSearchParams(searchParams) {
  const defaultFilter = getDefaultFilter()
  const filterBy = {}
  for (const field in defaultFilter) {
    filterBy[field] = searchParams.get(field) || ''
  }
  return filterBy
}

function getDefaultFilter() {
  return {
    title: '',
    severity: '',
    createdAt: ''
  }
}