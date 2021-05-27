
const navbtn = document.getElementsByClassName("fa-align-justify")[0].addEventListener("click", toggleView)
const navDrop = document.getElementById("NavDropDown")

function toggleView (){
    if(navDrop.style.display === "none"){
        navDrop.style.display = "flex"
    }else {
        navDrop.style.display = "none"
    }
}

    const NavLeft = document.getElementById("NavUpperLeft")
    const search = document.createElement("form")
    search.setAttribute("id", "NavSearch")

    const inputSearch = document.createElement("input")
    inputSearch.setAttribute("type", "text")
    inputSearch.setAttribute('id', 'SearchUser')
    inputSearch.setAttribute("placeholder", "Search...")

    const btn = document.createElement("p")
    btn.innerHTML = "/"

    search.appendChild(inputSearch)
    search.appendChild(btn)

    const pull = document.createElement("h3")
    pull.innerHTML = "Pull Requests"
    pull.setAttribute("id", "NavUpperText")

    const issue = document.createElement("h3")
    issue.innerHTML = "Issues"
    issue.setAttribute("id", "NavUpperText")

    const market = document.createElement("h3")
    market.innerHTML = "Market place"
    market.setAttribute("id", "NavUpperText")

    const explore = document.createElement("h3")
    explore.innerHTML = "Explore"
    explore.setAttribute("id", "NavUpperText")


if(window.innerWidth >= 570) {
    NavLeft.appendChild(search)
    NavLeft.appendChild(pull)
    NavLeft.appendChild(issue)
    NavLeft.appendChild(market)
    NavLeft.appendChild(explore)
}

window.addEventListener("resize", () =>{

    if(window.innerWidth >= 570 ){
        navDrop.style.display = "none"

        NavLeft.appendChild(search)
        NavLeft.appendChild(pull)
        NavLeft.appendChild(issue)
        NavLeft.appendChild(market)
        NavLeft.appendChild(explore)

    }else {
        NavLeft.removeChild(search)
        NavLeft.removeChild(pull)
        NavLeft.removeChild(issue)
        NavLeft.removeChild(market)
        NavLeft.removeChild(explore)
    }

    if(window.innerWidth >= 800){
        pull.innerHTML = "Pull Requests"
    }else {
        pull.innerHTML = "Pulls"
    }
})


// for api fetching

let username = "dayveed-repo"
const search_input = document.querySelectorAll("#SearchUser")

search_input.forEach(input => {
    input.addEventListener('keyup', (e) =>{
        username = e.target.value
        console.log(username)
    })
})



const headers = {
    "content-type": "application/json",
    Authorization: "Bearer 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"
}

const handleFetchUser = () =>{
    let query = `
    query { 
    user(login: ${JSON.stringify(username.trim())}){
        name,
        login,
        avatarUrl,
        bio,
        repositories(first: 20){
            totalCount,
          nodes {
            name,
            updatedAt,
            stargazerCount,
            forkCount,
            primaryLanguage{
                name
            }
          }
        }
      }
    }

`
const mapRepo = (arr) =>{
    arr.map((repo => {
        const repositoryContainer = document.getElementById("repositoryContainer")
        const RepositoryItem = document.createElement('div')
        RepositoryItem.setAttribute('id', 'RepositoryItem')

        const RepositoryUpper = document.createElement('div')
        RepositoryUpper.setAttribute('id', 'RepositoryUpper')
        
        const nameRepo = document.createElement('h3')
        nameRepo.innerHTML = repo.name
        const starBtn = document.createElement('button')
        starBtn.innerHTML = `<i class="far fa-star"></i> Star`

        RepositoryUpper.appendChild(nameRepo)
        RepositoryUpper.appendChild(starBtn)
        RepositoryItem.appendChild(RepositoryUpper)

        const RepositoryLower = document.createElement('div')
        RepositoryLower.setAttribute('id', 'RepositoryLower')

        const elem1 = document.createElement('p')
        const elem2 = document.createElement('p')
        const elem3 = document.createElement('p')
        const elem4 = document.createElement('p')

        if(repo.primaryLanguage) { elem1.innerHTML = `<i class="fas fa-circle"></i> ${repo.primaryLanguage.name}`}
        elem2.innerHTML = `<i class="far fa-star"></i> ${repo.stargazerCount}`
        elem3.innerHTML = `<i class="fas fa-code-branch"></i> ${repo.forkCount}`
        elem4.innerHTML = `Updated on october 1`

        if(repo.primaryLanguage) { RepositoryLower.appendChild(elem1) }
        RepositoryLower.appendChild(elem2)
        RepositoryLower.appendChild(elem3)
        RepositoryLower.appendChild(elem4)

        RepositoryItem.appendChild(RepositoryLower)
        repositoryContainer.appendChild(RepositoryItem)
    }))
}

fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({query})
        })
        .then(response => response.json())
        .then(data => {
            if(data.data.user.avatarUrl){
                console.log(data.data.user)
                const avatars = document.querySelectorAll('img');
                avatars.forEach(ava => ava.setAttribute("src", `${data.data.user.avatarUrl}`))        
            
                const login = document.querySelectorAll("#login")
                const bio = document.querySelectorAll("#bio")
                const name = document.querySelector("#name")
                const repos = document.querySelectorAll("#num_of_repos")

                login.forEach(elem => {
                    elem.innerHTML = data.data.user.login
                });
                bio.forEach(elem => {
                    elem.innerHTML = data.data.user.bio
                });

                repos[0].innerHTML = data.data.user.repositories.totalCount
                repos[1].innerHTML = `${data.data.user.repositories.totalCount} results for repositories`

                name.innerHTML = data.data.user.name

                //for rendering repositories
                document.getElementById("repositoryContainer").innerHTML = ''
                mapRepo(data.data.user.repositories.nodes)
            }else {
                alert("Invalid user (avoid entering names with whitespaces)")
            }
        })
    }

handleFetchUser()

const handleSubmit = (e) =>{
    e.preventDefault();
    handleFetchUser()
}

const SearchBars = document.querySelectorAll('#NavSearch')
SearchBars.forEach(search => search.addEventListener('submit', handleSubmit))


