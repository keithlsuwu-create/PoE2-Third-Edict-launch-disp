document.addEventListener('DOMContentLoaded', function() {
    const leaguesContainer = document.getElementById('leaguesContainer');
    const statusText = document.getElementById('statusText');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-controls button');
    
    let allLeagues = [];
    let filteredLeagues = [];
    
    // Fetch league data from the PoE API
    async function fetchLeagues() {
        try {
            statusText.textContent = 'Loading league data from Path of Exile API...';
            statusText.className = 'loading';
            
            // Using the official Path of Exile API endpoint for leagues
            const response = await fetch('https://api.pathofexile.com/leagues?type=main&realm=poe2');
            
            // Handle API rate limiting
            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After') || 10;
                statusText.textContent = `Rate limited. Please try again in ${retryAfter} seconds.`;
                statusText.className = 'error';
                return;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Filter out some unnecessary leagues for cleaner display
            allLeagues = data.filter(league => 
                !league.id.toLowerCase().includes("ssf") && 
                !league.id.toLowerCase().includes("hardcore") &&
                !league.id.toLowerCase().includes("voided") &&
                league.id !== "Standard" &&
                league.id !== "Hardcore"
            );
            
            displayLeagues(allLeagues);
            statusText.textContent = `Loaded ${allLeagues.length} leagues from API`;
            statusText.className = '';
            
        } catch (error) {
            console.error('Error fetching league data:', error);
            statusText.textContent = 'Error loading data from API. Using sample data.';
            statusText.className = 'error';
            
            // Display sample data as fallback
            displaySampleData();
        }
    }
    
    // Display leagues in the UI
    function displayLeagues(leagues) {
        leaguesContainer.innerHTML = '';
        
        if (leagues.length === 0) {
            leaguesContainer.innerHTML = '<p class="error">No leagues found matching your criteria</p>';
            return;
        }
        
        leagues.forEach(league => {
            const leagueCard = document.createElement('div');
            leagueCard.className = 'league-card';
            
            const startDate = league.startAt ? new Date(league.startAt).toLocaleDateString() : 'N/A';
            const endDate = league.endAt ? new Date(league.endAt).toLocaleDateString() : 'Ongoing';
            const description = league.description || 'No description available';
            
            leagueCard.innerHTML = `
                <h3 class="league-name">${league.id}</h3>
                <div class="league-info">
                    <span class="info-label">Start Date:</span>
                    <span class="info-value">${startDate}</span>
                </div>
                <div class="league-info">
                    <span class="info-label">End Date:</span>
                    <span class="info-value">${endDate}</span>
                </div>
                <div class="league-info">
                    <span class="info-label">League Type:</span>
                    <span class="info-value">${league.rules ? league.rules.map(rule => rule.name).join(', ') : 'Standard'}</span>
                </div>
                <div class="league-info">
                    <span class="info-label">Description:</span>
                    <span class="info-value">${description}</span>
                </div>
                ${league.rules && league.rules.length > 0 ? `
                <div class="rules-list">
                    <div class="info-label">Special Rules:</div>
                    ${league.rules.map(rule => `
                        <div class="rule-item">${rule.name}: ${rule.description || 'No description available'}</div>
                    `).join('')}
                </div>
                ` : ''}
                <div class="api-info">
                    <i class="fas fa-database"></i> Data fetched from Path of Exile API
                </div>
            `;
            
            leaguesContainer.appendChild(leagueCard);
        });
    }
    
    // Display sample data (fallback)
    function displaySampleData() {
        const sampleLeagues = [
            {
                id: "The Third Edict",
                startAt: "2024-12-06T00:00:00Z",
                endAt: "2025-03-10T00:00:00Z",
                description: "A new challenge league with unique mechanics",
                rules: [
                    {
                        name: "Hardcore",
                        description: "Characters who die are moved to Standard league"
                    }
                ]
            },
            {
                id: "Ancestor League",
                startAt: "2024-09-06T00:00:00Z",
                endAt: "2024-12-02T00:00:00Z",
                description: "Battle alongside your ancestors in this league",
                rules: [
                    {
                        name: "Ancestor",
                        description: "Fight alongside your ancestral spirits"
                    }
                ]
            },
            {
                id: "Necropolis League",
                startAt: "2024-03-29T00:00:00Z",
                endAt: "2024-07-29T00:00:00Z",
                description: "Manage your own graveyard and raise the dead",
                rules: [
                    {
                        name: "Necropolis",
                        description: "Build and manage your own graveyard"
                    }
                ]
            }
        ];
        
        let html = '';
        sampleLeagues.forEach(league => {
            const startDate = league.startAt ? new Date(league.startAt).toLocaleDateString() : 'TBA';
            const endDate = league.endAt ? new Date(league.endAt).toLocaleDateString() : 'Ongoing';
            
            html += `
                <div class="league-card">
                    <h3 class="league-name">${league.id}</h3>
                    <div class="league-info">
                        <span class="info-label">Start Date:</span>
                        <span class="info-value">${startDate}</span>
                    </div>
                    <div class="league-info">
                        <span class="info-label">End Date:</span>
                        <span class="info-value">${endDate}</span>
                    </div>
                    <div class="league-info">
                        <span class="info-label">Description:</span>
                        <span class="info-value">${league.description}</span>
                    </div>
                    <div class="rules-list">
                        <div class="info-label">Special Rules:</div>
                        ${league.rules.map(rule => `
                            <div class="rule-item">${rule.name}: ${rule.description}</div>
                        `).join('')}
                    </div>
                    <div class="api-info">
                        <i class="fas fa-exclamation-triangle"></i> Sample data (API unavailable)
                    </div>
                </div>
            `;
        });
        
        leaguesContainer.innerHTML = html;
    }
    
    // Filter leagues based on search input
    function filterLeagues() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-controls button.active').id;
        
        filteredLeagues = allLeagues.filter(league => {
            // Apply active filter
            let matchesFilter = true;
            if (activeFilter === 'mainLeagues') {
                matchesFilter = league.id.toLowerCase().includes('standard') || 
                                league.id.toLowerCase().includes('hardcore') ||
                                !league.id.includes('(');
            } else if (activeFilter === 'eventLeagues') {
                matchesFilter = league.id.toLowerCase().includes('event') || 
                                league.id.toLowerCase().includes('race');
            }
            
            // Apply search term
            const matchesSearch = league.id.toLowerCase().includes(searchTerm) ||
                                  (league.description && league.description.toLowerCase().includes(searchTerm)) ||
                                  (league.rules && league.rules.some(rule => 
                                      rule.name.toLowerCase().includes(searchTerm) ||
                                      (rule.description && rule.description.toLowerCase().includes(searchTerm))
                                  ));
            
            return matchesFilter && matchesSearch;
        });
        
        displayLeagues(filteredLeagues);
        statusText.textContent = `Showing ${filteredLeagues.length} of ${allLeagues.length} leagues`;
    }
    
    // Add event listeners
    searchInput.addEventListener('input', filterLeagues);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterLeagues();
        });
    });
    
    // Initialize the app
    fetchLeagues();
});
