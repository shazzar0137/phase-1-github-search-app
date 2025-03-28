document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("github-form");
    const userList = document.getElementById("user-list");
    const repoList = document.getElementById("repos-list");
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let query = e.target.search.value.trim();
        if (!query) return alert("Please enter a valid search term.");
        fetchUsers(query);
        e.target.reset();
    });
    
    function fetchUsers(query) {
        fetch(`https://api.github.com/search/users?q=${query}`, {
            headers: { "Accept": "application/vnd.github.v3+json" }
        })
        .then(res => res.ok ? res.json() : Promise.reject("API Limit Exceeded or Error"))
        .then(data => {
            userList.innerHTML = "";
            data.items.forEach(user => renderUser(user));
        })
        .catch(err => console.error("Oops!", err));
    }
    
    function renderUser(user) {
        let li = document.createElement("li");
        li.innerHTML = `
            <img src="${user.avatar_url}" width="50" height="50" style="border-radius:50%"> 
            <a href="${user.html_url}" target="_blank">${user.login}</a>
            <button data-username="${user.login}">Show Repos</button>
        `;
        userList.appendChild(li);
        li.querySelector("button").addEventListener("click", () => fetchRepos(user.login));
    }
    
    function fetchRepos(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: { "Accept": "application/vnd.github.v3+json" }
        })
        .then(res => res.ok ? res.json() : Promise.reject("Repo Fetch Error"))
        .then(repos => {
            repoList.innerHTML = "";
            repos.forEach(repo => renderRepo(repo));
        })
        .catch(err => console.error("Repo fetch failed!", err));
    }
    
    function renderRepo(repo) {
        let li = document.createElement("li");
        li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
        repoList.appendChild(li);
    }
});
