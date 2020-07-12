import { getCompetitionScorers } from '../services/competition.js'

class ScorerElem extends HTMLElement {

    async connectedCallback() {
        this.loading()
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code')
        const scorers = await this.loadScorer(code)
        this._list = scorers ? scorers.slice(0, 5) : scorers

        if (this._list) this.render()
        else this.innerHTML = `
        <div class="container center-column">
            <h5>Scorers</h5>
            <h5 style="text-align: center; font-family: var(--font-tertiary);">Oops.. cannot get the scorers. Please try again in a minute</h5>
        </div>
        `
    }

    loading() {
        this.innerHTML = `
        <div class="container center-column">
            <h5>Competition Scorers</h5>
            <div class="progress"><div class="indeterminate"></div></div>
        </div>
        `
    }

    async loadScorer(code) {
        try {
            const res = await getCompetitionScorers(code.toUpperCase())
            return res
        } catch (err) {
            return false
        }
    }

    cardItem(scorer) {
        const { player, team, numberOfGoals } = scorer

        return `
        <li class="scorer">
            <div class="collapsible-header scorer-header">${player.name}</div>
            <div class="collapsible-body scorer-body"><span>${numberOfGoals} Goals for ${team.name}</span></div>
        </li>
        `
    }

    render() {
        this.innerHTML = `
        <div class="container center-column">
            <h5>Scorers</h5>
            <ul class="collapsible">
                ${this._list && this._list.reduce((html, scorer) => html + this.cardItem(scorer), '')}
            </ul>
        </div>
        `

        const elems = document.querySelectorAll('.collapsible');
        M.Collapsible.init(elems);

        const scorers = document.querySelectorAll('.scorer')
        const body = document.querySelectorAll('.scorer-body')

        scorers[0].classList.toggle('active')
        body[0].style.display = 'block'
    }
}

customElements.define('scorer-elem', ScorerElem)