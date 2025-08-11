(() => {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  
  const searchButton = document.querySelector("#search-button");
  searchButton.addEventListener("click", ()=> {
      alert("earch clicked!");
  })

  async function getListOfLibraryNames(){
    // This function will return a list of library names from the holdings list
    let names = document.querySelectorAll('ul[data-testid="holding-list-details"] li strong');
    return Array.from(names).map((name) => name.innerText);
}



  /**
   * Listen for messages from the background script.
   * Call "insertBeast()" or "removeExistingBeasts()".
   */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "beastify") {
      insertBeast(message.beastURL);
    } else if (message.command === "reset") {
      removeExistingBeasts();
    }
  });
})();
