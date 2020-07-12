import { getCompetitionStandings } from "../services/competition.js"

class StandingElem extends HTMLElement {

    async connectedCallback() {
        this.loading()
        this._list = await this.getStandings()
        
        if (this._list) this.render()
        else this.innerHTML = `
        <div class="table-container centering">
            <h5 class="">Standings</h5>
            <h5 style="text-align: center; font-family: var(--font-tertiary);">Oops.. cannot get the standings. Please try again in a minute</h5>
        </div>
        `
    }

    loading() {
        this.innerHTML = `
        <div class="table-container centering">
            <h5 class="">Standings</h5>
            <div class="progress"><div class="indeterminate"></div></div>
        </div>
        `
    }

    async getStandings() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code')
        try {
            const standing = await getCompetitionStandings(code.toUpperCase())
            return standing
        } catch (err) {
            return err
        }
    }

    loadRow(item) {
        return `
        <tr>
            <td>${item.team.name}</td>
            <td>${item.won}</td>
            <td>${item.draw}</td>
            <td>${item.lost}</td>
            <td>${item.points}</td>
        </tr>
        `
    }

    render() {
        this.innerHTML = `
        <div class="table-container centering">
            <h5 class="">Standings</h5>
            <table class="responsive-table striped">
                <thead>
                    <tr>
                        <th>Teams</th>
                        <th>Won</th>
                        <th>Draw</th>
                        <th>Lost</th>
                        <th>Points</th>
                    </tr>
                </thead>

                <tbody>
                    ${this._list && this._list.reduce((html, item) => html + this.loadRow(item), '')}
                </tbody>
            </table>
        </div>
        `
    }
}

customElements.define('standing-elem', StandingElem)