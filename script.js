const CORRECT_PASSWORD = "guukha";
const wrongSound = document.getElementById("wrongSound");
const correctSound = document.getElementById("correctSound");
const loader = document.getElementById("loader");
const msg = document.getElementById("msg");

// Unlock audio on first user interaction (mobile fix)
document.body.addEventListener("touchstart", () => {
  wrongSound.play().then(() => { wrongSound.pause(); wrongSound.currentTime = 0; }).catch(() => {});
  correctSound.play().then(() => { correctSound.pause(); correctSound.currentTime = 0; }).catch(() => {});
}, { once: true });

function login() {
  const input = document.getElementById("password").value.trim();
  msg.textContent = "";
  loader.style.display = "block";

  // Fake 3-second loading
  setTimeout(() => {
    loader.style.display = "none";

    if (input === CORRECT_PASSWORD) {
      msg.textContent = "✅ Login successful!";
      msg.className = "msg success";

      // Play correct password sound
      correctSound.currentTime = 0;
      correctSound.play();

    } else {
      msg.textContent = "❌ Incorrect password";
      msg.className = "msg error";

      // Play wrong password sound
      wrongSound.currentTime = 0;
      wrongSound.play();

      // Vibrate on mobile
      if (navigator.vibrate) navigator.vibrate([300,100,300]);
    }
  }, 3000);
}
