const searchResults = document.getElementById("searchResults");

function searchAccounts(event) {
    event.preventDefault();
    
    const query = document.getElementById("search").value.toLowerCase().trim();
    
    if (!query) {
        searchResults.innerHTML = "<p>Please enter a search term.</p>";
        return;
    }
    
    // Fetch and parse the XML file
    fetch('./accounts.xml')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            
            if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                searchResults.innerHTML = "<p>Error parsing XML file.</p>";
                return;
            }
            
            const accounts = xmlDoc.getElementsByTagName("account");
            const matchedAccounts = [];
            
            // Search through accounts for matches
            for (let account of accounts) {
                const username = account.getElementsByTagName("username")[0]?.textContent.toLowerCase() || "";
                const bio = account.getElementsByTagName("bio")[0]?.textContent.toLowerCase() || "";
                const tags = Array.from(account.getElementsByTagName("tag")).map(tag => tag.textContent.toLowerCase());
                
                // Check if query matches any field
                if (username.includes(query) || 
                    bio.includes(query) ||
                    tags.some(tag => tag.includes(query))) {
                    matchedAccounts.push(account);
                }
            }
            
            // Display results
            displayResults(matchedAccounts, query);
        })
        .catch(error => {
            console.error("Error fetching XML:", error);
            searchResults.innerHTML = "<p>Error loading accounts.</p>";
        });
}

function displayResults(accounts, query) {
    searchResults.innerHTML = "";
    
    if (accounts.length === 0) {
        searchResults.innerHTML = "<p>No accounts found matching your search.</p>";
        return;
    }
    
    const resultHTML = accounts.map(account => {
        const username = account.getElementsByTagName("username")[0]?.textContent || "";
        const bio = account.getElementsByTagName("bio")[0]?.textContent || "";
        const tags = Array.from(account.getElementsByTagName("tag")).map(tag => `<span class="tag">${tag.textContent}</span>`).join(" ");
        
        return `
            <div class="account-result">
                <h3>${username}</h3>
                <p><strong>Bio:</strong> ${bio}</p>
                <p><strong>Tags:</strong> ${tags}</p>
            </div>
        `;
    }).join("");
    
    searchResults.innerHTML = `<p>Found ${accounts.length} result(s):</p>${resultHTML}`;
}