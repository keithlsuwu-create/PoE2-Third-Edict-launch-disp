async function loadLeagues() {
  try {
    const response = await fetch("data/leagues.json"); // fetch mock data
    const data = await response.json();

    const statsDiv = document.getElementById("stats");
    statsDiv.innerHTML = "<h1>PoE2 Available Leagues</h1>";

    const ul = document.createElement("ul");

    data.lines.forEach(league => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${league.name}</strong> 
                      ${league.startAt ? ` (Start: ${league.startAt}, End: ${league.endAt})` : ""} 
                      - Characters Created: ${league.charactersCreated.toLocaleString()}`;
      ul.appendChild(li);
    });

    statsDiv.appendChild(ul);

  } catch (error) {
    console.error("Failed to load leagues:", error);
    document.getElementById("stats").innerHTML = "<p>Failed to load leagues.</p>";
  }
}

loadLeagues();

