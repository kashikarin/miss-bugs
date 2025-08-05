
// import { storageService } from './async-storage.service.js'
import { loggerService } from './logger.service.js'
import { readJsonFile, writeJsonFile, makeId } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '//localhost:3030/api/bug'

const bugs = readJsonFile('data/bug.json')

export const bugService = {
    query,
    getById,
    save,
    remove,
}


async function query() {
    return bugs
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) {
        loggerService.error(`Could not get bug with ${bugId}`)
        throw "Couldn't get bug"
    } 
    return bug
}

async function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)
    return _saveBugs(bugs)
}

async function save(bugToSave) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs.splice(idx, 1, bugToSave)
    } else {
        bugToSave._id = makeId()
        bugToSave.createdAt = new Date().getTime()
        bugs.push(bugToSave)
    }
    await _saveBugs(bugs)
    return bugToSave
}

function _saveBugs() {
    return writeJsonFile('data/bug.json', bugs)
}