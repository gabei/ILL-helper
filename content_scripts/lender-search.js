import { extract, ratio } from 'fuzzball';
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
    let lenderList = await searchCombindLenderList(libraryNames);
    console.log(lenderList);
    if(lenderList.length === 0) lenderList = [];
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



function runNameMatchSearch(libraries, lenderDict){
  console.log("Running name match search...");;
  const validMatches = new Array();
  const lenders = libraryNameList(lenderDict);
  
  for(let library of libraries) {
    let [name, score] = search(library, lenders);
    if( matchScoresHigherThan(score, 88) ) {
      validMatches.push(lenderDict.find((item) => item.name === name));
    }
  }
  return validMatches;
}

const search = (library, lenders) =>{
  let match = extract(library, lenders, {
    scorer: ratio,
    limit: 1
  });

  return match[0];
}


async function searchCombindLenderList(searchableLibraries){
  let texasLenderList = createLenderCodeDict(TXlenders);
  let allLenderList = createLenderCodeDict(ALLlenders);

  let txMatches = runNameMatchSearch(normalizeLibraryNames(searchableLibraries), texasLenderList);
  let allMatches = runNameMatchSearch(normalizeLibraryNames(searchableLibraries), allLenderList);

  return removeDuplicateEntries(txMatches, allMatches)
}


