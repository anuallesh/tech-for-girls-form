let count = localStorage.getItem("clickCount") || 0;
count = parseInt(count);

const shareBtn = document.getElementById("shareBtn");
const clickCounter = document.getElementById("clickCounter");
const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const successMsg = document.getElementById("successMsg");
const toast = document.getElementById("toast");

function updateCounter() {
  clickCounter.textContent = `Click count: ${count}/5`;
  if (count >= 5) {
    clickCounter.textContent = "Sharing complete. Please continue.";
    shareBtn.disabled = true;
  }
}

updateCounter();

shareBtn.addEventListener("click", () => {
  if (count < 5) {
    count++;
    localStorage.setItem("clickCount", count);
    updateCounter();

    const message = encodeURIComponent(
      `Hey Buddy! 👋\n\n Join the *Tech For Girls Community* 🚀 and it's amazing!\nCome join us too and grow your tech journey 💻✨\n\n👉 Join here: https://chat.whatsapp.com/KpIdexT77u3GbW1xkGYUbR\n\n(After WhatsApp opens, select friends or groups you want to share this invite with.)`
    );

    window.open(`https://wa.me/?text=${message}`, "_blank");

    toast.className = "show";
    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  }
});

async function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (count < 5) {
    alert("Please complete 5 WhatsApp shares before submitting.");
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

  try {
    const base64File = await toBase64(file);

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwSd5AnT2FhnXP5i9H9smqCFlsPtNWBRp848Y9rkIg-YLTqPF5hp6BaOWsIIU7FaY_M/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          name,
          phone,
          email,
          college,
          screenshot: base64File,
          fileType: file.type,
        }),
      }
    );

    const result = await response.json();
    console.log("Response from server:", result);

    if (!response.ok || result.result !== "success") {
      throw new Error(result.message || "Unknown error");
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
