import '../view/materialize.min.js'
import axios from 'axios'

let state = {
    content: ''
}

class NavElem extends HTMLElement {

    connectedCallback() {
        this.render()
    }

    async loadContent(page) {

        try {
            const res = await axios.get(`/src/pages/${page}.html`);

            if (res.status === 200) {
                state.content = res.data
                const _main = document.querySelector("#main-content")
                history.replaceState(state, null, `index.html#${page}`)

                
                _main.innerHTML = state.content
                window.location.reload()

            } else {
                console.error("Something went wrong on load content!");
            }
        } catch (err) {
            console.error(`Something went wrong on load content! ${err}`);
        }
    }

    loadSidenavTrigger() {
        if (window.location.pathname.match('competition-detail.html') || window.location.pathname.match('team-detail.html')) {
            return `<a href="#" class="sidenav-back" data-target="nav-mobile"><i style="height: 56px; line-height: 56px;" class="fad fa-angle-double-left"></i></a>`
        } else {
            return `<a href="#" class="sidenav-trigger" data-target="nav-mobile"><i class="fad fa-layer-group"></i></a>`
        }
    }

    render() {
        this.innerHTML = `
        <div class="navbar-fixed">
            <nav role="navigation">
                <div class="nav-wrapper container">
                    <a href="#home" class="brand-logo">GoalKeeper</a>
                    ${this.loadSidenavTrigger()}
                    <ul class="topnav right hide-on-med-and-down">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#keeper">Keeper</a></li>
                    </ul>
                    <ul class="sidenav" id="nav-mobile">
                        <li><a href="#home" class="brand-logo">GoalKeeper</a></li>
                        <li><a href="#home">Home</a><i class="fad fa-angle-right"></i></li>
                        <li><a href="#keeper">Keeper</a><i class="fad fa-angle-right"></i></li>
                    </ul>
                </div>
            </nav>
        </div>        
        `

        document.querySelectorAll(".topnav a, .sidenav a").forEach((elem) => {
            elem.addEventListener("click", () => {
                const page = elem.getAttribute("href") ? elem.getAttribute("href").slice(1) : "home"

                history.pushState(state, null, `index.html#${page}`)

                this.loadContent(page);

                const sidebar = document.querySelector(".sidenav");
                M.Sidenav.getInstance(sidebar).close();
            });
        });

        const sidebar = document.querySelector(".sidenav");

        M.Sidenav.init(sidebar);
    }
}

customElements.define('nav-elem', NavElem)