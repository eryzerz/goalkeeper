import '../view/materialize.min.js'
import { getTeamsInACompetition } from "../services/competition.js"
import crest from '../../assets/images/crest.png'
import { getAllTeams } from '../services/database.js'

class TeamElem extends HTMLElement {

    async connectedCallback() {
        this.loading()
        this._list = await this.getTeams()

        if (this._list && this._list.length !== 0) this.render()
        else {
            const isFromSaved = window.location.hash.slice(1) === "keeper" ? true : false
            
            if (isFromSaved) {
                this.innerHTML = `
                <div class="comp-container">
                    <h5>Teams</h5>
                    <h5 style="text-align: center; font-family: var(--font-tertiary);">There's no team saved yet!</h5>
                </div>
                `
            } else {
                this.innerHTML = `
                <div class="comp-container">
                    <h5>Competitions</h5>
                    <div class="carousel">
                        <h5 style="text-align: center; font-family: var(--font-tertiary);">Oops.. cannot get the teams. Please try again in a minute</h5>
                    </div>
                </div>
                `
            }
        }
    }

    loading() {
        this.innerHTML = `
        <div class="comp-container">
            <h5>Teams</h5>
            <div class="carousel">
                <div class="progress"><div class="indeterminate"></div></div>
            </div>
        </div>
        `
    }

    async getTeams() {
        let page = window.location.hash.slice(1);
        
        if (!page) {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code')
            try {
                const teams = await getTeamsInACompetition(code.toUpperCase())
                return teams
            } catch (err) {
                return null
            }
        } else {
            try {
                let saved = await getAllTeams()
                
                return saved
            } catch (err) {
                
                return null
            }
        }

    }

    carouselItem(item) {
        let page = window.location.hash.slice(1);
        if (page === "keeper") localStorage.setItem('is-from-keeper', true)
        else localStorage.setItem('is-from-keeper', false)

        return `
        <a class="carousel-item team" href="./team-detail.html?id=${item.id}">
            <img class="responsive-img" src="${item.crestUrl}">
            <p class="team-name">${item.shortName}</p>
        </a>`
    }

    render() {
        this.innerHTML = `
        <div class="comp-container">
            <h5>Teams</h5>
            <div class="carousel">
                ${this._list && this._list.reduce((html, item) => html + this.carouselItem(item), '')}
            </div>
        </div>
        `

        const img = document.querySelectorAll('img.responsive-img');

        img.forEach(elem => {
            elem.addEventListener('error', () => {
                elem.setAttribute('src', crest)
            });
        })


        const elems = document.querySelectorAll('.carousel');
        M.Carousel.init(elems);
    }
}

customElements.define('team-elem', TeamElem)