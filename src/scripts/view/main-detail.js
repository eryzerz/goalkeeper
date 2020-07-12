import 'regenerator-runtime'
import '../../styles/app.css'
import '../components/nav.js'
import '../components/scorer.js'
import '../components/standings.js'
import '../components/team.js'
import '../view/materialize.min.js'
import axios from 'axios'

let state = {
    content: ''
}

const detail = async () => {

    const loadContent = async (code) => {

        const url = process.env.NODE_ENV === "development" ? `/src/pages/detail.html` : `/dist/src/pages/detail.html`
        try {
            const res = await axios.get(url);

            if (res.status === 200) {
                state.content = res.data
                const _main = document.querySelector("#main-content")
                history.pushState(state, null, `competition-detail.html?code=${code}`)

                

                window.onpopstate = e => {

                    if (e.state) {
                        
                        state = e.state
                        _main.innerHTML = state.content
                        
                    }
                }

                _main.innerHTML = state.content

            } else {
                console.error("Something went wrong on load content!");
            }
        } catch (err) {
            console.error(`Something went wrong on load content! ${err}`);
        }
    }

    const params = new URLSearchParams(window.location.search);
    let code = params.get('code')

    if (code === "" || code === null) code = "bl1";

    localStorage.setItem('code', code)

    await loadContent(code);

    const back = document.querySelector('.sidenav-back')
    if (back) back.addEventListener('click', () => {
        if (window.location.pathname.match('competition-detail.html')) {
            history.replaceState(state, null, `index.html#home`)
            window.location.reload()
        }
    })

}

document.addEventListener('DOMContentLoaded', () => (() => {
    if ("serviceWorker" in navigator) {
        if (process.env.NODE_ENV === "development") {
            navigator.serviceWorker
                .register("/service-worker.js")
                .then(function () {
                    console.log("Service Worker successfully registered");
                    detail()
                })
                .catch(function () {
                    console.log("Failed to register Service Worker");
                });
        }
        if (process.env.NODE_ENV === "production") {
            navigator.serviceWorker
                .register("/dist/service-worker.js")
                .then(function () {
                    console.log("DIST Service Worker successfully registered");
                    detail()
                })
                .catch(function () {
                    console.log("Failed to register DIST Service Worker");
                });
        }
    } else {
        console.log("Service Worker isn't supported in this browser.");
    }
})())