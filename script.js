let count = localStorage.getItem("clickCount") || 0;
count = parseInt(count);

const shareBtn = document.getElementById("shareBtn");
const clickCounter = document.getElementById("clickCounter");
const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const successMsg = document.getElementById("successMsg");
const toast = document.getElementById("toast");

function updateCounter() {
  clickCounter.textContent = `Click count: ${count}/10`;
  if (count >= 10) {
    clickCounter.textContent = "Sharing complete. Please continue.";
    shareBtn.disabled = true;
  }
}

updateCounter();

shareBtn.addEventListener("click", () => {
  if (count < 10) {
    count++;
    localStorage.setItem("clickCount", count);
    updateCounter();

    const message = encodeURIComponent(
      `Hey Buddy! 👋\n\nI just joined the *Tech For Girls Community* 🚀 and it's amazing!\nCome join us too and grow your tech journey 💻✨\n\n👉 Join here: https://chat.whatsapp.com/KpIdexT77u3GbW1xkGYUbR\n\n(After WhatsApp opens, select friends or groups you want to share this invite with.)`
    );

    window.open(`https://wa.me/?text=${message}`, "_blank");

    toast.className = "show";
    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (count < 10) {
    alert("Please complete 10 WhatsApp shares before submitting.");
    return;
  }

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const college = document.getElementById("college").value;
  const file = document.getElementById("screenshot").files[0];

  if (!file) {
    alert("Please upload a screenshot.");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("phone", phone);
  formData.append("email", email);
  formData.append("college", college);
  formData.append("screenshot", file);

  try {
    // Use CORS proxy to avoid CORS block
    const scriptURL = "https://script.google.com/macros/s/AKfycbzF10V47NscL1M0kctwq8Cv-PIkQxm7SksxFdtE2wIdQmNvRZTUYJY-u1BxsHiO8jPP/exec";
    const proxyURL = "https://corsproxy.io/?" + encodeURIComponent(scriptURL);

    const response = await fetch(proxyURL, {
      method: "POST",
      body: formData,
    });

    const result = await response.text(); // or .json() if your script returns JSON
    console.log("Response from server:", result);

    if (!response.ok || result.toLowerCase().includes("error")) {
      throw new Error("Server returned an error: " + result);
    }

    localStorage.setItem("submitted", "true");
    form.reset();
    form.querySelectorAll("input, button").forEach((el) => (el.disabled = true));
    successMsg.classList.remove("hidden");

  } catch (err) {
    console.error("Fetch error:", err);
    alert("Error submitting form. Try again.");
  }
});

window.onload = () => {
  if (localStorage.getItem("submitted") === "true") {
    form.querySelectorAll("input, button").forEach((el) => (el.disabled = true));
    successMsg.classList.remove("hidden");
  }
};
