document.body.style.border = "5px solid red";

// working from here: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_second_WebExtension






async function getListOfLibraryNames(){
    // This function will return a list of library names from the holdings list
    let names = document.querySelectorAll('ul[data-testid="holding-list-details"] li strong');
    return Array.from(names).map((name) => name.innerText);
}