(clientJsFunction = () => {
    let counter = 20;
    let indiatvInterval = setInterval(function () {
        if (counter--) {
            const plDiv = document.getElementById("div-ub-republicworld.com_1695278106394");
            if (location.href == 'https://bharat.republicworld.com/') {
                plDiv.remove();
                console.log("Player removed from home page")
                clearInterval(indiatvInterval);
                return 0;
            }
            let targetDiv = null;
            //CP
            if (window.location.pathname.length < 36) {
                plDiv.remove();
                console.log("Player removed from category page")
                clearInterval(indiatvInterval);
                return 0;
            }
            //AP
            if (window.location.pathname != "/") {
                if (document.querySelector("#live-blog-container") || document.querySelector(".liveDate") || document.querySelectorAll(".newshour-video").length > 2) {
                    //|| document.querySelector(".jw-media.jw-reset")
                    plDiv.remove();
                    clearInterval(indiatvInterval);
                    return 0;
                }
                if (window.mobileCheck) {
                    if (document.querySelector("#div-gpt-ad-1736322017342-0")) {
                        targetDiv = document.querySelector("#div-gpt-ad-1736322017342-0");
                        if (targetDiv) {
                            targetDiv.insertBefore(plDiv, targetDiv.firstChild);
                            clearInterval(indiatvInterval);
                            return 0;
                        }
                    }
                    else if (document.querySelector(".content_div")) {
                        targetDiv = document.querySelector(".content_div");
                        if (targetDiv) {
                            targetDiv = targetDiv.querySelectorAll("p")[2];
                        }
                    }
                    else if (targetDiv = document.querySelector(".storytext")) {
                        targetDiv = document.querySelector(".storytext")
                        if (targetDiv) {
                            targetDiv = targetDiv.querySelectorAll("p")[2];
                        }
                    }
                    else if (targetDiv = document.querySelector(".storyContent")) {
                        targetDiv = document.querySelector(".storyContent")
                        if (targetDiv) {
                            targetDiv = targetDiv.querySelectorAll("p")[2];
                        }
                    }

                }
                else if (document.querySelector("#div-gpt-ad-1736319755580-0")) {
                    targetDiv = document.querySelector("#div-gpt-ad-1736319755580-0");
                    if (targetDiv) {
                        targetDiv.insertBefore(plDiv, targetDiv.firstChild);
                        clearInterval(indiatvInterval);
                        return 0;
                    }
                }

                else if (document.querySelector(".storytext")) {
                    //targetDiv = document.querySelector(".story-wrapper");
                    targetDiv = document.querySelector(".storytext")
                    if (targetDiv) {
                        targetDiv = targetDiv.querySelectorAll("p")[2];
                    }
                }
                else if (document.querySelector(".storyContent")) {
                    targetDiv = document.querySelector(".storyContent")
                    if (targetDiv) {
                        targetDiv = targetDiv.querySelectorAll("p")[2];
                    }
                }
                // let count = 0
                // let Player_pTag = [...plDiv.querySelectorAll("p")];
                // let thirdPartyPlayer = targetDiv.querySelector("vdo")
                // let playerPositionOption = null;
                // if (thirdPartyPlayer) {
                //     thirdPartyPlayer = [...thirdPartyPlayer.querySelectorAll("p")];
                // } else {
                //     thirdPartyPlayer = []
                // }
                // targetDiv = targetDiv.querySelectorAll("p, .twitter-tweet")
                // var indexTwitterDIV = null;
                // for (var i = 0; i < targetDiv.length; i++) {
                //     if (targetDiv[i].classList.contains("twitter-tweet")) {
                //         indexTwitterDIV = i;
                //         break;
                //     }
                // }

                // for (let i = 0; i < targetDiv.length; i++) {
                //     if (!Player_pTag.includes(targetDiv[i]) && targetDiv[i].innerText.length > 10 && !thirdPartyPlayer.includes(targetDiv[i])) {
                //         count++
                //         if (count >= 1) {
                //             playerPositionOption = targetDiv[i]
                //         }
                //         if (indexTwitterDIV) {
                //             targetDiv = targetDiv[indexTwitterDIV + 2]
                //             break;
                //         }
                //         if (count >= 3) {
                //             targetDiv = targetDiv[i]
                //         }
                //     }
                // }

                // if (Object.values(targetDiv).length >= 1) {
                //     if (document.querySelector('vdo') && !window.mobileCheck) {
                //         targetDiv = document.querySelector('vdo');
                //         targetDiv = targetDiv.parentElement.parentElement
                //         targetDiv = targetDiv.nextElementSibling.nextElementSibling.nextElementSibling
                //     }
                //     else {
                //         targetDiv = playerPositionOption
                //     }
                // }
            }
            if (plDiv && targetDiv) {
                targetDiv.insertAdjacentElement("afterend", plDiv);
                clearInterval(indiatvInterval);
            }
        }
        if (counter < 0)
            clearInterval(indiatvInterval);
    }, 500);
})();

// (clientJsFunction = () => {
//     // Helper: choose the right node to insert after
//     function getInsertAfterNode(container) {
//         if (!container) return null;
//         const pTags = container.querySelectorAll("p");
//         if (pTags.length >= 3) return pTags[2];                 // after 3rd <p>
//         if (pTags.length >= 1) return pTags[pTags.length - 1];   // else after last <p>
//         return container.lastElementChild || container;          // fallback if no <p>
//     }

//     let counter = 20;
//     let indiatvInterval = setInterval(function () {
//         if (counter--) {
//             const plDiv = document.getElementById("div-ub-republicworld.com_1695278106394");
//             if (location.href == 'https://bharat.republicworld.com/') {
//                 plDiv.remove();
//                 console.log("Player removed from home page")
//                 clearInterval(indiatvInterval);
//                 return 0;
//             }
//             let targetDiv = null;
//             //CP
//             if (window.location.pathname.length < 36) {
//                 plDiv.remove();
//                 console.log("Player removed from category page")
//                 clearInterval(indiatvInterval);
//                 return 0;
//             }
//             //AP
//             if (window.location.pathname != "/") {
//                 if (document.querySelector("#live-blog-container") || document.querySelector(".liveDate") || document.querySelectorAll(".newshour-video").length > 2) {
//                     //|| document.querySelector(".jw-media.jw-reset")
//                     plDiv.remove();
//                     clearInterval(indiatvInterval);
//                     return 0;
//                 }
//                 if (window.mobileCheck) {
//                     if (document.querySelector(".content_div")) {
//                         const container = document.querySelector(".content_div");
//                         if (container) targetDiv = getInsertAfterNode(container);
//                     }
//                     else if (targetDiv = document.querySelector(".storytext")) {
//                         const container = document.querySelector(".storytext");
//                         if (container) targetDiv = getInsertAfterNode(container);
//                     }
//                     else if (targetDiv = document.querySelector(".storyContent")) {
//                         const container = document.querySelector(".storyContent");
//                         if (container) targetDiv = getInsertAfterNode(container);
//                     }
//                 }
//                 else if (document.querySelector(".storytext")) {
//                     //targetDiv = document.querySelector(".story-wrapper");
//                     const container = document.querySelector(".storytext");
//                     if (container) targetDiv = getInsertAfterNode(container);
//                 }
//                 else if (document.querySelector(".storyContent")) {
//                     const container = document.querySelector(".storyContent");
//                     if (container) targetDiv = getInsertAfterNode(container);
//                 }
//             }
//             if (plDiv && targetDiv) {
//                 targetDiv.insertAdjacentElement("afterend", plDiv);
//                 clearInterval(indiatvInterval);
//             }
//         }
//         if (counter < 0)
//             clearInterval(indiatvInterval);
//     }, 500);
// })();
