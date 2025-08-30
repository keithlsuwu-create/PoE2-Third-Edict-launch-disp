async function loadStats() {
  const response = await fetch("data/stats.json");
  const stats = await response.json();

  document.getElementById("players").textContent = stats.players_online;

  const classList = document.getElementById("classes");
  stats.top_classes.forEach(c => {
    const li = document.createElement("li");
    li.textContent = `${c.class}: ${c.count}`;
    classList.appendChild(li);
  });

  document.getElementById("skill").textContent = stats.most_used_skill;
}

loadStats();