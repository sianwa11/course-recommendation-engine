const userSelect = document.getElementById("userSelect");
const recommendationsDiv = document.getElementById("recommendations");

async function loadUsers() {
  const response = await fetch("/users");
  const users = await response.json();

  userSelect.innerHTML = "";

  users.forEach((user) => {
    const option = document.createElement("option");

    option.value = user.id;
    option.textContent = `${user.id} • ${user.role} (${user.industry})`;

    userSelect.appendChild(option);
  });
}

async function loadRecommendations() {
  const userId = userSelect.value;

  const response = await fetch(`/recommendations/${userId}`);

  const recommendations = await response.json();

  recommendationsDiv.innerHTML = "";

  recommendations.forEach((r) => {
    recommendationsDiv.innerHTML += `
            <div class="card">

                <h3>${r.course.title}</h3>

                <p><strong>Topic:</strong> ${r.course.topic}</p>

                <p><strong>Level:</strong> ${r.course.level}</p>

                <p><strong>Duration:</strong> ${r.course.duration_mins} mins</p>

                <p class="score">
                    Score: ${r.score}
                </p>

                <p>${r.reason}</p>

            </div>
        `;
  });
}

document
  .getElementById("loadBtn")
  .addEventListener("click", loadRecommendations);

loadUsers();
