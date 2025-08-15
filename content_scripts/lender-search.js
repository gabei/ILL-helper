import Fuse from 'fuse.js'
import TXlenders from "./TXlenders.json" with {type: 'json'};
import ALLlenders from "./ALLlenders.json" with {type: 'json'};

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
    console.log("Received message. Searching...");

    let libraryNames = await getListOfLibraryNames();
    let lenderList = await fuzzySearch(libraryNames, ALLlenders);
    if(lenderList.length === 0) lenderList = [];
    console.log(lenderList)
    return Promise.resolve({ list: lenderList });
  };

  browser.runtime.onMessage.addListener(handleMessage);

})();




/*
* search
____________________________________*/

function normalizeString(str){
  return String(str).toLowerCase();
}

function normalizeLibraryNames(libraries){
  return libraries.map((name) => {
    return normalizeString(name);
  });
}

function libraryNameList(libraryNames){
  return libraryNames.map((item) => {
    return item.name;
  });
}

function createLenderCodeDict(lenderCodes){
  let dict = lenderCodes.map((item) => {
    return {
      name: normalizeString(item["LIBRARY NAME"]),
      code: item["AGEXTERNAL CODE"],
    };
  });

  return dict;
}

function matchScoresHigherThan(match, threshold){
  return match >= threshold;
}


function removeDuplicateEntries(list1, list2){
  // Combine both lists and remove duplicates based on the 'code' property
  // Set ensures uniqueness if a code is added twice
  let combined = [...list1, ...list2];
  return Array.from(new Set(combined.map(item => item.code)));
}


// export default async function initFuzzysearch(searchableLibraries){
//   let texasLenderList = createLenderCodeDict(TXlenders);
//   let allLenderList = createLenderCodeDict(ALLlenders);

//   let txMatches = runNameMatchSearch(normalizeLibraryNames(searchableLibraries), texasLenderList);
//   let allMatches = runNameMatchSearch(normalizeLibraryNames(searchableLibraries), allLenderList);

//   return removeDuplicateEntries(txMatches, allMatches)
// }


async function fuzzySearch(libraries, lenderDict){
  console.log("fuzzySearch()");

  const validMatches = new Array();
  const lenders = libraryNameList(lenderDict);


  const fuseOptions = {
    isCaseSensitive: false,
    // includeScore: false,
    // ignoreDiacritics: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    // threshold: 0.6,
    // distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys: [
      "LIBRARY NAME",
      "AGEXTERNAL CODE"
    ]
  };


  for(let library of libraries) {
    console.log(library);
    let fuse = new Fuse(lenders, fuseOptions);
    let searchPattern = library;
    let result = fuse.search(searchPattern)
    console.log(result);
    validMatches.push(searchPattern);
  }

  return validMatches;
}



