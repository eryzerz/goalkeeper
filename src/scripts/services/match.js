import axios from 'axios'
import config from './config.js'

export const getNextMatches = async () => {
    if ("caches" in window) {
        try {
            const res = await axios.get(`https://api.football-data.org/v2/matches?status=SCHEDULED`, config)
            
            return res.data.matches
        } catch (err) {
            const res = await caches.match("https://api.football-data.org/v2/matches?status=SCHEDULED")
            if (res) {
                const data = await res.json()
                
                return data.matches
            }
            return null
        }
    }
}

export const getMatch = async (id) => {
    if ("caches" in window) {
        try {
            const res = await axios.get(`https://api.football-data.org/v2/matches/${id}`, config)
            
            return res.data.match
        } catch (err) {
            const res = await caches.match("https://api.football-data.org/v2/matches/" + id)
            if (res) {
                const data = await res.json()
                return data.match
            }
            return null
        }
    }
}