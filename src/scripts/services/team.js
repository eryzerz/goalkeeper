import axios from 'axios'
import config from './config.js'

export const getTeam = async (team_id) => {
    if ("caches" in window) {
        const res = await caches.match(`https://api.football-data.org/v2/teams/${team_id}`)
        if (res) {
            const data = await res.json()
            return data
        } else {
            try {
                const res = await axios.get(`https://api.football-data.org/v2/teams/${team_id}`, config)
                return res.data
            } catch (err) {
                return null
            }
        }
    } else {
        console.log('Caches is not supported in this browser')
    }
}