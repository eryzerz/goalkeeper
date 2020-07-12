import idb from '../libs/idb.js'

// Open DB - Create Store - Create Index
const db = idb.open("goal-keeper", 2, function (upgradeDb) {
    const teamObjectStore = upgradeDb.createObjectStore("team", {
        keyPath: "id"
    });
    const matchObjectStore = upgradeDb.createObjectStore("match", {
        keyPath: "id"
    });
    teamObjectStore.createIndex("name", "name", { unique: false });
});

// Create
export const saveTeam = async (team) => {

    try {
        const _db = await db
        const tx = _db.transaction("team", "readwrite")
        const store = tx.objectStore("team")
        await store.add(team)
        console.log("Team successfully saved")
        return tx.complete
    } catch (err) {
        console.log("Failed to save the team", err)
        return err
    }

}

export const saveMatch = async (match) => {

    try {
        const _db = await db
        const tx = _db.transaction("match", "readwrite")
        const store = tx.objectStore("match")
        await store.add(match)
        console.log("Match successfully saved")
        return tx.complete
    } catch (err) {
        console.log("Failed to save the match", err)
        return err
    }

}

// Read
export const getAllTeams = async () => {

    try {
        const _db = await db
        const tx = _db.transaction("team", "readonly");
        const store = tx.objectStore("team");
        const teams = await store.getAll()
        console.log("Get all saved teams successfully", teams)
        return teams
    } catch (err) {
        console.log("Failed to get all the teams", err)
        return err
    }
}

export const getAllMatches = async () => {

    try {
        const _db = await db
        const tx = _db.transaction("match", "readonly");
        const store = tx.objectStore("match");
        const matches = await store.getAll()
        console.log("Get all saved matches successfully", matches)
        return matches
    } catch (err) {
        console.log("Failed to get all the matches", err)
        return err
    }
}

// Update
export const updateMatch = async (match) => {

    try {
        const _db = await db
        const tx = _db.transaction("match", "readwrite")
        const store = tx.objectStore("match")
        await store.put(match)
        console.log("Match successfully updated")
        return tx.complete
    } catch (err) {
        console.log("Failed to update the match", err)
        return err
    }

}

// Delete
export const deleteTeam = async (id) => {

    try {
        const _db = await db
        const tx = _db.transaction("team", "readwrite")
        const store = tx.objectStore("team")
        await store.delete(parseInt(id))
        console.log("Team successfully deleted")
        return tx.complete
    } catch (err) {
        console.log("Failed to delete the team", err)
        return err
    }

}

export const deleteMatch = async (id) => {

    try {
        const _db = await db
        const tx = _db.transaction("match", "readwrite")
        const store = tx.objectStore("match")
        await store.delete(parseInt(id))
        console.log("Match successfully deleted")
        return tx.complete
    } catch (err) {
        console.log("Failed to delete the match", err)
        return err
    }

}