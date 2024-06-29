let names = ["Ibrahim", "Jasim", "Jisan", "Teebro", "Rifat"];
const spinner = document.getElementById("spinner");
const ctx = spinner.getContext("2d");
const spinButton = document.getElementById("spin");
const updateNamesButton = document.getElementById("update-names");
const namesTextarea = document.getElementById("names");
const winnerModal = document.getElementById("winnerModal");
const winnerText = document.getElementById("winner");
const closeModal = document.getElementsByClassName("close")[0];

let angles = [];
let startAngle = 0;
let arc = Math.PI / (names.length / 2);
let spinTimeout = null;

document.addEventListener("DOMContentLoaded", () => {
    drawSpinner();
});

updateNamesButton.addEventListener("click", () => {
    names = namesTextarea.value.split("\n").filter(name => name.trim() !== "");
    arc = Math.PI / (names.length / 2);
    drawSpinner();
});

spinButton.addEventListener("click", spin);

closeModal.addEventListener("click", () => {
    winnerModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target == winnerModal) {
        winnerModal.style.display = "none";
    }
});

function drawSpinner() {
    ctx.clearRect(0, 0, spinner.width, spinner.height);
    angles = [];
    names.forEach((name, index) => {
        const angle = startAngle + index * arc;
        angles.push(angle);
        drawSegment(name, index, angle);
    });
}

function drawSegment(name, index, angle) {
    const color = `hsl(${index * (360 / names.length)}, 100%, 50%)`;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(spinner.width / 2, spinner.height / 2);
    ctx.arc(spinner.width / 2, spinner.height / 2, spinner.width / 2, angle, angle + arc);
    ctx.lineTo(spinner.width / 2, spinner.height / 2);
    ctx.fill();
    ctx.save();
    ctx.fillStyle = "white";
    ctx.translate(
        spinner.width / 2 + Math.cos(angle + arc / 2) * (spinner.width / 2.5),
        spinner.height / 2 + Math.sin(angle + arc / 2) * (spinner.height / 2.5)
    );
    ctx.rotate(angle + arc / 2 + Math.PI / 2);
    ctx.fillText(name, -ctx.measureText(name).width / 2, 0);
    ctx.restore();
}

function spin() {
    const spinAngleStart = Math.random() * 10 + 10;
    const spinTime = Math.random() * 3000 + 4000;
    let spinTimeTotal = 0;
    rotateSpinner();

    function rotateSpinner() {
        spinTimeTotal += 30;
        if (spinTimeTotal < spinTime) {
            const spinAngle = spinAngleStart * (spinTime - spinTimeTotal) / spinTime;
            startAngle += (spinAngle * Math.PI / 180);
            drawSpinner();
            spinTimeout = setTimeout(rotateSpinner, 30);
        } else {
            stopSpinner();
        }
    }
}

function stopSpinner() {
    clearTimeout(spinTimeout);
    const degrees = startAngle * 180 / Math.PI + 90;
    const arcd = arc * 180 / Math.PI;
    const index = Math.floor((360 - degrees % 360) / arcd);
    const winner = names[index];
    showModal(winner);
}

function showModal(winner) {
    winnerText.textContent = `"${winner}" is Winner!`;
    winnerModal.style.display = "block";
}
