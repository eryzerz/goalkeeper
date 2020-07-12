import '../view/materialize.min.js'
import { getNextMatches, getMatch } from '../services/match.js'
import { saveMatch, getAllMatches, deleteMatch, updateMatch } from '../services/database.js'

class NextElem extends HTMLElement {

    async connectedCallback() {
       
        this.loading()
        this._list = await this.getMatches()
       
        const page = window.location.hash.slice(1)

        if (this._list && this._list.length !== 0) this.render()
        else this.innerHTML = `
        <div class="container centering">
            <h5>Next Matches</h5>
            <div class="today-container">
            ${page === "home" ?
                `<h5 style="text-align: center; font-family: var(--font-tertiary);">Oops.. cannot get all matches. Please try again in a minute</h5>`
                :
                `<h5 style="text-align: center; font-family: var(--font-tertiary);">There's no match saved yet!</h5>`}
            </div>
        </div>
        `
    }

    loading() {
        this.innerHTML = `
        <div class="container centering">
            <h5>Next Matches</h5>
            <div class="today-container">
                <div class="progress"><div class="indeterminate"></div></div>
            </div>
        </div>
        `
    }

    async getMatches() {
        const page = window.location.hash.slice(1)

        if (page === "home") {
            try {
                const todayMatches = await getNextMatches()
                return todayMatches
            } catch (err) {
                return err
            }
        } else {
            try {
                const todayMatches = await getAllMatches()
                return todayMatches
            } catch (err) {
                return err
            }
        }

    }

    // loadUpdateBtn to make conditional display to synchronize button
    // Synchronizing match only available when the match already in play or done
    // So, user can see score in Keeper
    loadUpdateBtn(date, id) {
        const page = window.location.hash.slice(1)
        const now = new Date()
        const kickOff = date

        if (page === "keeper" && now > kickOff) {
            return `<div class="update-match-btn" id="update-match" data-id="${id}">
                <i class="fad fa-sync"></i>
            </div>`
        } else {
            return ``
        }

    }

    cardItem(match) {
        const { id, homeTeam, awayTeam, utcDate } = match

        const date = new Date(utcDate)
        const [hour, min] = [date.getHours().toLocaleString(), date.getMinutes().toLocaleString().length === 1 ? "0" + date.getMinutes().toLocaleString() : date.getMinutes().toLocaleString()]
        const time = hour + ":" + min

        const page = window.location.hash.slice(1)

        return `
        <div class="today-card">
            <div>
                <p>${homeTeam.name}</p>
            </div>
            <div class="score">
                <p id="score-${id}">${time}</p>
            </div>
            <div>
                <p>${awayTeam.name}</p>
            </div>
            <div class="save-match-btn" id="save-match" data-id="${id}" data-target="delete-modal">
                ${page === "home" ? `<i class="fad fa-save"></i>` : `<i class="fad fa-trash"></i>`}
            </div>
            ${this.loadUpdateBtn(date, id)}
        </div>
        `
    }

    render() {
        this.innerHTML = `
        <div class="container centering">
            <h5>Next Matches</h5>
            <div class="today-container">
                ${this._list.filter(match => match.status !== "POSTPONED").reduce((html, match) => html + this.cardItem(match), '')}
            </div>
            <div id="delete-modal" class="modal">
                <div class="modal-content">
                    <h4>Remove Saved Match</h4>
                    <p>Are you sure you want to remove this match from Keeper?</p>
                </div>
                <div class="modal-footer">
                    <button id="agree-btn" class="modal-close waves-effect waves-green btn-flat">Yep</button>
                    <button id="cancel-btn" class="modal-close waves-effect waves-green btn-flat">Nope</button>
                </div>
            </div>
        </div>
        `

        const page = window.location.hash.slice(1)

        if (page === "home") {
            const allBtn = document.querySelectorAll('.save-match-btn')
            allBtn.forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id')

                    const waitToast = M.toast({ html: "Wait a sec..", classes: "save-toast" })

                    const match = await getMatch(id)
                    if (match) {
                        const res = await saveMatch(match)

                        waitToast.dismiss()
                        if (res) {
                            if (`${res}`.match("Key already exists")) M.toast({ html: "Match already saved!", classes: "save-toast" })
                            else M.toast({ html: "You can't save while offline!", classes: "save-toast" })
                        } else {
                            M.toast({ html: "Match saved!", classes: "save-toast" })
                        }
                        
                        
                    } else {
                        waitToast.dismiss()
                        M.toast({ html: "Something went wrong. Try again later!", classes: "save-toast" })
                    }

                })
            })
        } else {
            const allBtn = document.querySelectorAll('.save-match-btn')
            const elems = document.querySelector('.modal');
            const instances = M.Modal.init(elems);
            const agree = document.querySelector('#agree-btn');
            const cancel = document.querySelector('#cancel-btn');
            allBtn.forEach(btn => {
                btn.addEventListener('click', () => {
                    instances.open()
                    agree.addEventListener('click', async() => {
                        const id = btn.getAttribute('data-id')

                        
                        const waitToast = M.toast({ html: "Wait a sec..", classes: "save-toast" })



                        const res = await deleteMatch(id)

                        waitToast.dismiss()

                        M.toast({ html: "Match deleted!", classes: "save-toast" })
                        window.location.reload()
                        
                        instances.destroy()
                    })

                })
            })

            const upBtn = document.querySelectorAll('.update-match-btn')
            upBtn.forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.getAttribute('data-id')

                    const waitToast = M.toast({ html: "Wait a sec..", classes: "save-toast" })

                    const match = await getMatch(id)

                    if (match && match.score) {
                        const { homeTeam, awayTeam } = match.score.fullTime

                        const res = await updateMatch(match)

                        waitToast.dismiss()

                        const score = document.querySelector(`#score-${id}`)
                        score.innerHTML = `⬆️ ${homeTeam === null ? 0 : homeTeam}:${awayTeam === null ? 0 : awayTeam} ⬇️`
                        
                    } else {
                        waitToast.dismiss()
                        M.toast({ html: "Something went wrong. Try again later!", classes: "save-toast" })
                    }
                })
            })
        }
    }
}

customElements.define('next-elem', NextElem)