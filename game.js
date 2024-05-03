document.addEventListener("DOMContentLoaded", function () {
  const images = [
    { file: "chefknife.jpg", name: "Chef Knife" },
    { file: "paringknife.jpg", name: "Paring Knife" },
    { file: "slicingknife.jpg", name: "Slicing Knife" },
    { file: "vegetablepeelder.jpg", name: "Vegetable Peeler" },
    { file: "woodenspoon.jpg", name: "Wooden Spoon" },
    { file: "whisk.jpg", name: "Whisk" },
    { file: "tongs.jpg", name: "Tongs" },
    { file: "ladel.jpg", name: "Ladle" },
    { file: "gradter.jpg", name: "Grater" },
    { file: "melonballer.jpg", name: "Melon Baller" },
  ];
  let score = 0;
  let tries = 0;
  let questionsAsked = 0;
  let currentPlayer = "";

  document.getElementById("startButton").addEventListener("click", startGame);

  function startGame() {
    currentPlayer = document.getElementById("playerName").value.trim();
    if (currentPlayer === "") {
      alert("Please enter your name.");
      return;
    }
    document.getElementById("start-game").style.display = "none";
    document.getElementById("game").style.display = "block";
    nextImage();
  }

  function nextImage() {
    if (questionsAsked >= 10) {
      finishGame();
      return;
    }
    updateImageAndChoices();
  }

  function updateImageAndChoices() {
    tries = 0; // Reset tries for the new image
    const imageElement = document.getElementById("image");
    const choicesDiv = document.getElementById("choices");
    let randomImage = images[Math.floor(Math.random() * images.length)];
    imageElement.src = `./images/${randomImage.file}`;
    imageElement.classList.add("img-fluid");

    const shuffledChoices = shuffleArray(
      images.filter((img) => img.name !== randomImage.name)
    );
    let choices = [randomImage, ...shuffledChoices.slice(0, 3)];
    shuffleArray(choices);

    choicesDiv.innerHTML = "";
    choices.forEach((choice) => {
      const button = document.createElement("button");
      button.className = "btn btn-secondary";
      button.textContent = choice.name;
      button.onclick = () => checkAnswer(choice.name, randomImage.name);
      choicesDiv.appendChild(button);
    });
    questionsAsked++;
  }

  function checkAnswer(guess, correctAnswer) {
    if (guess === correctAnswer) {
      score++;
      alert("Correct! Moving to the next question.");
      setTimeout(nextImage, 1000); // Automatically move to the next image after 1 second
    } else {
      tries++;
      if (tries < 2) {
        alert("Wrong! Try again.");
      } else {
        alert(
          "Still wrong! The correct answer was " +
            correctAnswer +
            ". Moving to the next question."
        );
        setTimeout(nextImage, 1000); // Automatically move to the next image after 1 second
      }
    }
    document.getElementById("score").textContent = score;
  }

  function finishGame() {
    document.getElementById("game").style.display = "none";
    saveScore();
    displayRankings();
    confetti.start(1000); // Celebrate with confetti
    setTimeout(resetGame, 5000); // Allow some time to view scores before resetting
  }

  function saveScore() {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push({ name: currentPlayer, score: score });
    localStorage.setItem("scores", JSON.stringify(scores));
  }

  function displayRankings() {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.sort((a, b) => b.score - a.score);
    let rankings = document.getElementById("rankings");
    rankings.innerHTML = scores
      .map((s) => `<li class="list-group-item">${s.name} - ${s.score}</li>`)
      .join("");
    document.getElementById("leaderboard").style.display = "block";
  }

  function resetGame() {
    document.getElementById("leaderboard").style.display = "none";
    document.getElementById("start-game").style.display = "block";
    document.getElementById("playerName").value = "";
    score = 0;
    questionsAsked = 0;
    document.getElementById("score").textContent = "0";
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
});
