(() => {
  console.log("Hello from the content script!");

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

function search(library, lenders) {
  let [extract, ratio] = import("fuzzball").then((fuzzball) => {
    return [fuzzball.extract, fuzzball.ratio]
  })

  let match = extract(library, lenders, {
    scorer: ratio,
    limit: 1
  });

  return match[0];
}


async function searchCombindLenderList(searchableLibraries){
  let texasLenders = import("./TXlenders.json").then((tx) => {
    return createLenderCodeDict(tx);
  })

  let allLenders = import("./TXlenders.json").then((all) => {
    return createLenderCodeDict(all);
  })

  let txMatches = runNameMatchSearch(normalizeLibraryNames(searchableLibraries), texasLenders);
  let allMatches = runNameMatchSearch(normalizeLibraryNames(searchableLibraries), allLenders);

  return removeDuplicateEntries(txMatches, allMatches)
}