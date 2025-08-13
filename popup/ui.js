
const searchButton = document.querySelector("#search-button")
const searchResults = document.querySelector("#search-results__list")
const lenderList = [];

searchButton.addEventListener("click", async ()=> {
    console.log(document.title);
    
})

function reset(){
    browser.tabs.sendMessage(tabs[0].id, {
          command: "reset",
        });
}

function search(){
    browser.tabs.sendMessage(tabs[0].id, {command: "search"})
}

function main(){
    if (e.target.type === "search") {
        browser.tabs
        .query({ active: true, currentWindow: true })
        .then(search)
        .catch(reportError);
    } else if (e.target.type === "reset") {
        browser.tabs
        .query({ active: true, currentWindow: true })
        .then(reset)
        .catch(reportError);
    }

    browser.tabs
        .executeScript({ file: "/content_scripts/lender-search.js" })
        .then(main)
        .then((data) => {
            console.log(data);
            data.forEach((item) => {
            let li = new HTMLElement("li");
            li.textContent = item;
            searchResults.append(li);
        })
    })
    .catch(reportExecuteScriptError);
}



