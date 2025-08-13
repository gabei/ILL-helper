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
  
  async function getListOfLibraryNames(){
    // This function will return a list of library names from the holdings list
    let names = document.querySelectorAll('li[data-testid*="library-card"]');
    console.log(names)
    return Array.from(names).map((name) => name.innerText);
}
  function clearList(){

  }

  /**
   * Listen for messages from the background script.
   * Call "insertBeast()" or "removeExistingBeasts()".
   */
  browser.runtime.onMessage.addListener(async (message) => {
    if (message.command === "beastify") {
      let list = await getListOfLibraryNames();
      browser.runtime.sendMessage({
        data: list
      })
    } else if (message.command === "reset") {
      clearList();
    }
  });
})();
