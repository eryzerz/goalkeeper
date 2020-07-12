import axios from 'axios'
import config from './config.js'

export const getAllCompetitions = async () => {

    const comp_id = [2002, 2003, 2014, 2015, 2021]

    try {
        const res_list = Promise.all(comp_id.map(async (id) => {
            if ("caches" in window) {
                const res = await caches.match("https://api.football-data.org/v2/" + "competitions/" + id)
                if (res) {
                    const data = await res.json()
                    return data
                } else {
                    try {
                        const response = await axios.get(
                            `https://api.football-data.org/v2/competitions/${id}`, config)

                        if (response.status === 200) {
                            return response.data
                        } else {
                            return null
                        }
                    } catch (err) {
                        return null
                    }
                }
            } else {
                console.log("Cache isn't supported in this browser.")
            }
        }))

        return res_list
    } catch (err) {
        return err
    }
}

export const getTeamsInACompetition = async (comp_id) => {
    if ("caches" in window) {
        const res = await caches.match("https://api.football-data.org/v2/" + "competitions/" + comp_id + "/teams")
        if (res) {
            const data = await res.json()
            return data.teams
        } else {
            try {
                const res = await axios.get(`https://api.football-data.org/v2/competitions/${comp_id}/teams`, config)
                
                return res.data.teams
            } catch (err) {
                return null
            }
        }
    } else {
        console.log("Cache isn't supported in this browser.")
    }
}

export const getCompetitionScorers = async (comp_id) => {
    if ("caches" in window) {
        try {
            const res = await axios.get(`https://api.football-data.org/v2/competitions/${comp_id}/scorers`, config)
            
            return res.data.scorers
        } catch (err) {
            const res = await caches.match("https://api.football-data.org/v2/" + "competitions/" + comp_id + "/scorers")
            if (res) {
                const data = await res.json()
                return data.scorers
            } 
            return null
        }
    } else {
        console.log("Cache isn't supported in this browser.")
    }
}

export const getCompetitionStandings = async (comp_id) => {
    if ("caches" in window) {
        try {
            const res = await axios.get(`https://api.football-data.org/v2/competitions/${comp_id}/standings`, config)
            
            return res.data.standings[0].table
        } catch (err) {
            const res = await caches.match("https://api.football-data.org/v2/" + "competitions/" + comp_id + "/standings")
            if (res) {
                const data = await res.json()
                return data.standings[0].table
            }
            return null
        }
    } else {
        console.log("Cache isn't supported in this browser.")
    }
}