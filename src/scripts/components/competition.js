import '../view/materialize.min.js'
import { getAllCompetitions } from '../services/competition.js'
import bundesliga from '../../assets/images/bundesliga.png'
import eredivise from '../../assets/images/eredivise.png'
import laliga from '../../assets/images/laliga.png'
import ligue from '../../assets/images/ligue.png'
import pl from '../../assets/images/premier-league.png'
import './scorer.js'

let state = {
    content: ''
}

const emblem = {
    BL1: bundesliga,
    DED: eredivise,
    PD: laliga,
    FL1: ligue,
    PL: pl
}

class CompetitionElem extends HTMLElement {

    async connectedCallback() {
        
        this.loading()
        this._list = await this.getCompetitions()
        
        if (this._list.includes(null)) this.innerHTML = `
        <div class="comp-container">
            <h5>Competitions</h5>
            <div class="carousel">
                <h5 style="text-align: center; font-family: var(--font-tertiary);">Oops.. cannot get all competitions. Please try again in a minute</h5>
            </div>
        </div>
        `
        else this.render()
    }

    loading() {
        this.innerHTML = `
        <div class="comp-container">
            <h5>Competitions</h5>
            <div class="carousel">
                <div class="progress"><div class="indeterminate"></div></div>
            </div>
        </div>
        `
    }

    async getCompetitions() {
        this._loading = true
        try {
            const comp = await getAllCompetitions()
            this._loading = false
            return comp
        } catch (err) {
            this._loading = false
            return err
        }
    }

    carouselItem(item) {

        const newItem = {
            ...item,
            emblemUrl: emblem[item.code]
        }

        return `<a class="carousel-item" href="./competition-detail.html?code=${item.code.toLowerCase()}"><img class="responsive-img" src="${newItem.emblemUrl}"></a>`
    }

    render() {
        this.innerHTML = `
        <div class="comp-container">
            <h5>Competitions</h5>
            <div class="carousel">
                ${this._list.reduce((html, item) => html + this.carouselItem(item), '')}
            </div>
        </div>
        `

        const elems = document.querySelectorAll('.carousel');
        M.Carousel.init(elems);
    }
}

customElements.define('comp-elem', CompetitionElem)