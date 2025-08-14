import initFuzzySearch from '../search/fuzzySearch.js';

(() => {
  console.log("Hello from the content script!");

  // check if this script has run in this window yet
  if(window.hasRun) return;
  window.hasRun = true;

  async function getListOfLibraryNames(){
    // This function will return a list of library names from the holdings list
    let names = document.querySelectorAll('li[data-testid*="library-card"] strong');
    let nameArray = Array.from(names).map((name) => name.innerText);
    return nameArray
}

  async function handleMessage(request, sender, sendResponse){
    console.log(`A content script sent a message: ${request.command}`);
    let libraryNames = await getListOfLibraryNames();
    let lenderList = await initFuzzySearch(libraryNames);
    if(lenderList.length === 0) lenderList = [];
    console.log(lenderList)
    return Promise.resolve({ list: lenderList });
  };

  browser.runtime.onMessage.addListener(handleMessage);

})();


