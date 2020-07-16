import '../view/materialize.min.js'
import { getTeam } from "../services/team"
import { saveTeam, deleteTeam } from '../services/database.js'
import crest from '../../assets/images/crest.png'

let state = {
    content: ''
}

class TeamDescElem extends HTMLElement {

    async connectedCallback() {
        this.loading()

        this._data = await this.loadTeamData()
        if (this._data) this.render()
        else this.innerHTML = `
                <div class="container" style="height: 100vh; display: flex; justify-content: center; align-items: center;">
                    <h5 style="text-align: center; font-family: var(--font-tertiary);">Oops.. cannot get team data. Please try again in a minute</h5>
                </div>
                `
    }

    loading() {
        this.innerHTML = `
        <div class="container" style="height: 100vh; display: flex; justify-content: center; align-items: center;">
            <div class="progress"><div class="indeterminate"></div></div>
        </div>
        `
    }

    loadPlayer(player) {

        const dob = new Date(player.dateOfBirth).toLocaleDateString()

        return `
        <li class="player">
            <div class="collapsible-header player-header">${player.name}</div>
            <div class="collapsible-body player-body">
                <div class="desc">
                    <h6>Position</h6>
                    <p>${player.position}</p>
                </div>
                <div class="desc">
                    <h6>Nationality</h6>
                    <p>${player.nationality}</p>
                </div>
                <div class="desc">
                    <h6>Date of Birth</h6>
                    <p>${dob}</p>
                </div>
            </div>
        </li>
        `
    }

    loadCoach(coach) {

        const dob = new Date(coach.dateOfBirth).toLocaleDateString()

        return `
        <div class="coach">
            <div class="coach-name">
                <p>${coach.name}</p>
            </div>
            <div class="desc">
                <h6>Nationality</h6>
                <p>${coach.nationality}</p>
            </div>
            <div class="desc">
                <h6>Date of birth</h6>
                <p>${dob}</p>
            </div>
        </div>
        `
    }

    async loadTeamData() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id')
        try {
            const team = await getTeam(id)

            if (team) {
                const {
                    name,
                    shortName,
                    founded,
                    venue,
                    clubColors,
                    address,
                    website,
                    email,
                    crestUrl,
                    squad } = team

                const teamInfo = {
                    name,
                    shortName,
                    founded,
                    venue,
                    clubColors,
                    address,
                    website,
                    email,
                    crestUrl
                }

                const players = squad.filter(person => person.role === "PLAYER")
                const coach = squad.filter(person => person.role === "COACH") ? squad.filter(person => person.role === "COACH")[0] : null

                return [teamInfo, players, coach]
            }
            return team
        } catch (err) {
            return err
        }
    }

    render() {
        const [item, player, coach] = this._data

        const isFromSaved = JSON.parse(localStorage.getItem('is-from-keeper'))
        

        this.innerHTML = `
        <div class="container wrapper">
            <h5>${item.name}</h5>
            <div class="team-container">
                <div class="desc-container">
                    <div class="desc">
                        <h6>Short name</h6>
                        <p>${item.shortName}</p>
                    </div>
                    <div class="desc">
                        <h6>Founded</h6>
                        <p>${item.founded}</p>
                    </div>
                    <div class="desc">
                        <h6>Venue</h6>
                        <p>${item.venue}</p>
                    </div>
                    <div class="desc">
                        <h6>Club colors</h6>
                        <p>${item.clubColors}</p>
                    </div>
                    <div class="desc">
                        <h6>Address</h6>
                        <p>${item.address}</p>
                    </div>
                    <div class="desc">
                        <h6>Website</h6>
                        <p>${item.website}</p>
                    </div>
                    <div class="desc">
                        <h6>E-mail</h6>
                        <p>${item.email}</p>
                    </div>
                </div>
                <img class="team-crest" src="${item.crestUrl}" alt="">
            </div>
        
            <div class="squad-container">
                <h5>Players</h5>
                <ul class="collapsible popout">
                ${player.reduce((html, player) => html + this.loadPlayer(player), '')}
                </ul>
            </div>
        
            <div class="coach-container">
                <h5>Coach</h5>
                ${coach ? this.loadCoach(coach) : `<h5 style="text-align: center; font-family: var(--font-tertiary);">Currently, we have no data about the coach</h5>`}
            </div>

            ${isFromSaved ?
                `<div class="fixed-action-btn">
                <a class="btn-floating btn-large grey darken-4" style="box-shadow: -2px 2px 9px var(--text-primary);" id="delete-save">
                <i class="fad fa-trash"></i>
                </a>
            </div>
            <div class="tap-target" data-target="delete-save">
                <div class="tap-target-content">
                <h5>Delete</h5>
                <p>Remove your favourite team from Keeper</p>
                </div>
            </div>
                `
                :
                `<div class="fixed-action-btn">
                <a class="btn-floating btn-large grey darken-4" style="box-shadow: -2px 2px 9px var(--text-primary);" id="save">
                <i class="fad fa-save"></i>
                </a>
            </div>
            <div class="tap-target" data-target="save">
                <div class="tap-target-content">
                <h5>Your Keeper</h5>
                <p>Save your favourite team with Keeper by clicking the button again after you dismissed this info</p>
                </div>
            </div>
            `}
            <div id="delete-modal" class="modal">
                <div class="modal-content">
                    <h4>Remove Saved Team</h4>
                    <p>Are you sure you want to remove this team from Keeper?</p>
                </div>
                <div class="modal-footer">
                    <button id="agree-btn" class="modal-close waves-effect waves-green btn-flat">Yep</button>
                    <button id="cancel-btn" class="modal-close waves-effect waves-green btn-flat">Nope</button>
                </div>
            </div>
        </div>
        `

        const img = document.querySelector('img.team-crest');

        img.addEventListener('error', () => {
            img.setAttribute('src', crest)
        });

        const target = document.querySelector('.tap-target')
        M.TapTarget.init(target);
        const info = M.TapTarget.getInstance(target);
        if (!localStorage.getItem('isTargetOpen')) {
            info.open()
            localStorage.setItem('isTargetOpen', true)
        }

        if (isFromSaved) {
            const del = document.querySelector('#delete-save')
            const elems = document.querySelector('.modal');
            const instances = M.Modal.init(elems);
            const agree = document.querySelector('#agree-btn');
            const cancel = document.querySelector('#cancel-btn');
            del.addEventListener('click', async () => {
                instances.open()
                agree.addEventListener('click', async () => {
                    const params = new URLSearchParams(window.location.search);
                    const id = params.get('id')
                    await deleteTeam(id)
    
                    M.toast({ html: `Team successfully deleted!`, classes: "save-toast" })
                    info.close()
                    instances.destroy()
                    history.replaceState(state, null, `index.html#keeper`)
                    window.location.reload()
                })
            })
        } else {
            const fab = document.querySelector('#save')
            fab.addEventListener('click', async () => {
                const params = new URLSearchParams(window.location.search);
                const id = params.get('id')
                const team = await getTeam(id)
                const res = await saveTeam(team)
                
                if (res) M.toast({ html: "You already save this poor team!", classes: "save-toast" })
                else M.toast({ html: `${team.name} successfully saved! Check your Keeper`, classes: "save-toast" })
                info.close()
            })
        }




        const elems = document.querySelectorAll('.collapsible');
        M.Collapsible.init(elems);

        const players = document.querySelectorAll('.player')
        const body = document.querySelectorAll('.player-body')

        players[0].classList.toggle('active')
        body[0].style.display = 'block'

    }
}

customElements.define('team-desc-elem', TeamDescElem)