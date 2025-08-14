// working from here: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_second_WebExtension
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage

function main(){
  console.log("Script injected! Running main()");

  const searchButton = document.querySelector("#search-button")
  const searchResults = document.querySelector("#search-results__list")
  const lenderList = [];

  searchButton.addEventListener("click", async ()=> {
      notifyBackgroundPage();
  })

  function search(tabs){
    browser.tabs.sendMessage(tabs[0].id, {
      command: "search",
    })
    .then((response) => {
      console.log(response.list);
    });
  }

  function notifyBackgroundPage(e) {
    browser.tabs
        .query({ active: true, currentWindow: true })
        .then(search)
        .catch(reportError);
  }

}
/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs
  .executeScript({ file: "/content_scripts/lender-search.js" })
  .then(main)
  .catch(reportExecuteScriptError);
