async function getListOfLibraryNames(){
    // This function will return a list of library names from the holdings list
    let names = document.querySelectorAll('li[data-testid*="library-card"]');
    console.log("Library Names: ", names)
    return Array.from(names).map((name) => name.innerText);

async function handleMessage(request, sender, sendResponse){
  console.log(`A content script sent a message: ${request.greeting}`);
  let list = await getListOfLibraryNames();
  sendResponse({ response: list });
};

browser.runtime.onMessage.addListener(handleMessage);