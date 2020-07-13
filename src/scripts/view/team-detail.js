import 'regenerator-runtime'
import '../../styles/app.css'
import '../components/nav.js'
import '../components/team-desc.js'
import '../view/materialize.min.js'
import axios from 'axios'

let state = {
    content: ''
}

const team = async () => {

    const loadContent = async (id) => {

        const url = process.env.NODE_ENV === "development" ? `/src/pages/team.html` : `/dist/src/pages/team.html`
        try {
            const res = await axios.get(`/src/pages/team.html`);

            if (res.status === 200) {
                state.content = res.data
                const _main = document.querySelector("#main-content")
                history.pushState(state, null, `team-detail.html?id=${id}`)

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
    let id = params.get('id')

    if (id === "" || id === null) id = "1";

    await loadContent(id);

    const back = document.querySelector('.sidenav-back')
    if (back) back.addEventListener('click', () => {
        if (window.location.pathname.match('team-detail.html')) {
            const code = localStorage.getItem('code')
            const isFromSaved = JSON.parse(localStorage.getItem('is-from-keeper'))
            if (isFromSaved) {
                history.replaceState(state, null, `index.html#keeper`)
            } else {
                history.replaceState(state, null, `competition-detail.html?code=${code}`)
            }

            window.location.reload()
        }
    })
}

document.addEventListener('DOMContentLoaded', () => (() => {
    if ("serviceWorker" in navigator) {
        // if (process.env.NODE_ENV === "development") {
            navigator.serviceWorker
                .register("/service-worker.js")
                .then(function () {
                    console.log("Service Worker successfully registered");
                    team()
                })
                .catch(function () {
                    console.log("Failed to register Service Worker");
                });
        // }
        // if (process.env.NODE_ENV === "production") {
        //     navigator.serviceWorker
        //         .register("/dist/service-worker.js")
        //         .then(function () {
        //             console.log("DIST Service Worker successfully registered");
        //             team()
        //         })
        //         .catch(function () {
        //             console.log("Failed to register DIST Service Worker");
        //         });
        // }
    } else {
        console.log("Service Worker isn't supported in this browser.");
    }
})()) 