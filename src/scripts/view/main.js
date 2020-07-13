import '../components/next.js'
import axios from 'axios'

const main = async () => {

    const loadContent = async (page) => {
        let state = {
            content: ''
        }
        const url = process.env.NODE_ENV === "development" ? `/src/pages/${page}.html` : `/dist/src/pages/${page}.html`
        try {
            const res = await axios.get(`/src/pages/${page}.html`);

            if (res.status === 200) {
                state.content = res.data
                const _main = document.querySelector("#main-content")
                history.pushState(state, null, `index.html#${page}`)

                

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

    let page = window.location.hash.slice(1);

    if (page === "") page = "home";

    await loadContent(page);


}

export default main