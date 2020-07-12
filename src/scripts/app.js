import 'regenerator-runtime'
import '../scripts/libs/idb.js'
import '../scripts/services/database.js'
import '../styles/app.css'
import '../scripts/components/nav.js'
import '../scripts/components/competition.js'
import '../scripts/components/team.js'
import './components/next.js'
import main from './view/main.js'
import {urlBase64ToUint8Array} from './utils/utility.js'

document.addEventListener("DOMContentLoaded", () => {
    (() => {
        if ("serviceWorker" in navigator) {
            if (process.env.NODE_ENV === "development") {
                navigator.serviceWorker
                    .register("/service-worker.js")
                    .then(function () {
                        console.log("Service Worker successfully registered");
                        requestPermission()
                        main()
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
                        requestPermission()
                        main()
                    })
                    .catch(function () {
                        console.log("Failed to register DIST Service Worker");
                    });
            }
        } else {
            console.log("Service Worker isn't supported in this browser.");
        }

        function requestPermission() {
            if ('Notification' in window) {
              Notification.requestPermission().then(function (result) {
                if (result === "denied") {
                  console.log("Notification blocked by user!");
                  return;
                } else if (result === "default") {
                  console.error("User closed the prompt!");
                  return;
                }
                
                navigator.serviceWorker.getRegistration().then(function(reg) {

                reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array("BGEjTEacb-o9PYEAk2Jz_He_CbuYVm6qpvbdSwi5u8j8Fv1GDz7p_dSMOK3Ka0b3Vak0Pz6ypdsa_nrUO1M5Rs4")
                }).then(function(subscribe) {
                    console.log('Subscription completed with endpoint: ', subscribe.endpoint);
                    console.log('Subscription completed with p256dh key: ', btoa(String.fromCharCode.apply(
                        null, new Uint8Array(subscribe.getKey('p256dh')))));
                    console.log('Subscription completed with auth key: ', btoa(String.fromCharCode.apply(
                        null, new Uint8Array(subscribe.getKey('auth')))));
                }).catch(function(e) {
                    console.error('Subscription cannot be done ', e.message);
                });
                    console.log('Notification Allowed!')
                });
              });
            }
        }
    })()
});