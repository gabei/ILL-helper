const searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", ()=> {
    alert("earch clicked!");
})

async function getListOfLibraryNames(){
    // This function will return a list of library names from the holdings list
    let names = document.querySelectorAll('ul[data-testid="holding-list-details"] li strong');
    return Array.from(names).map((name) => name.innerText);
}
