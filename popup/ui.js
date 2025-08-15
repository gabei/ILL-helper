// working from here: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_second_WebExtension
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage

function main(){
  console.log("Script injected! Running main()");

  let searchButton = document.querySelector("#search-button");
  let clearButton = document.querySelector("#clear-button");
  let searchResults = document.querySelector("#search-results");
  let lenderList = document.querySelector("#search-results__list");
  let loading = document.querySelector("#loading");

  let hasRun = false;

  searchButton.addEventListener("click", async ()=> {
    hideSearchResults();
    showLoadingDiv();
    notifyBackgroundPage();
    searchButton.disabled = true;
  })

  clearButton.addEventListener("click", async ()=> {
      reset();
  })

  function search(tabs){
    browser.tabs.sendMessage(tabs[0].id, {
      command: "search",
    })
    .then((response) => {
      console.log(response.list);
      populateList(response.list);
    });
  }

  function notifyBackgroundPage(e) {
    browser.tabs
        .query({ active: true, currentWindow: true })
        .then(search)
        .catch(reportError);
  }

  function populateList(lenderData) {
    showSearchResults();
    hideLoadingDiv();

    for(const item of lenderData){
      let li = document.createElement("li");
      li.innerText = item;
      lenderList.append(li)
    }
  }

  function showSearchResults(){
    searchResults.classList.remove("hidden");
    hasRun = true;
  }

  function hideSearchResults(){
    searchResults.classList.add("hidden");
  }

  function showLoadingDiv() {
    loading.classList.remove("hidden");
    loading.classList.add("flex");
  }

  function hideLoadingDiv() {
    loading.classList.remove("flex");
    loading.classList.add("hidden");
  }

  function reset() {
    window.location.reload(true);
    hasRun = false;
    searchButton.disabled = false
    searchResults.innerHTML = "";
  }
}





/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute content script: ${error.message}\n${error.stack}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs
  .executeScript({ file: "/dist/main.js" })
  .then(main)
  .catch(reportExecuteScriptError);
