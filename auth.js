function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(value.trim());
}

function showPanel(panel) {
  const loginPanel = document.getElementById("loginPanel");
  const signupPanel = document.getElementById("signupPanel");
  const tabLogin = document.getElementById("tabLogin");
  const tabSignup = document.getElementById("tabSignup");

  if (!loginPanel || !signupPanel) return;

  loginPanel.style.display = panel === "login" ? "block" : "none";
  signupPanel.style.display = panel === "signup" ? "block" : "none";
  tabLogin?.classList.toggle("active", panel === "login");
  tabSignup?.classList.toggle("active", panel === "signup");

  document.querySelectorAll(".auth-message").forEach((message) => {
    message.textContent = "";
    message.className = "auth-message";
  });
}

function clearFieldErrors(form) {
  form.querySelectorAll(".field-error").forEach((error) => {
    error.textContent = "";
  });
  form.querySelectorAll(".field-shell, .auth-terms").forEach((field) => {
    field.classList.remove("has-error");
  });
}

function setFieldError(control, message) {
  const field = control.closest(".auth-field, .auth-terms");
  if (!field) return;
  field.classList.add("has-error");
  field.querySelector(".field-shell")?.classList.add("has-error");
  const error = field.querySelector(".field-error");
  if (error) error.textContent = message;
}

function showAuthMessage(form, message, type = "error") {
  const panel = form.closest("#loginPanel, #signupPanel");
  const messageBox = panel?.querySelector(".auth-message");
  if (!messageBox) return;
  messageBox.classList.toggle("success", type === "success");
  messageBox.classList.toggle("error", type !== "success");
  messageBox.textContent = message;
}

document.addEventListener("click", (event) => {
  if (event.target.id === "tabLogin") {
    event.preventDefault();
    showPanel("login");
  }

  if (event.target.id === "tabSignup") {
    event.preventDefault();
    showPanel("signup");
  }

  const eyeButton = event.target.closest(".eye-toggle");
  if (eyeButton) {
    const input = eyeButton.parentElement.querySelector("input");
    input.type = input.type === "password" ? "text" : "password";
    eyeButton.classList.toggle("is-visible", input.type === "text");
    eyeButton.setAttribute("aria-label", input.type === "password" ? "Show password" : "Hide password");
    const hiddenText = eyeButton.querySelector(".sr-only");
    if (hiddenText) hiddenText.textContent = input.type === "password" ? "Show password" : "Hide password";
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "signupForm") {
    event.preventDefault();
    const form = event.target;
    clearFieldErrors(form);
    let valid = true;

    const nameInput = document.getElementById("signupName");
    const roleSelect = document.getElementById("signupRole");
    const emailInput = document.getElementById("signupEmail");
    const passwordInput = document.getElementById("signupPassword");
    const confirmInput = document.getElementById("confirmPassword");
    const terms = form.querySelector('input[type="checkbox"]');

    if (!nameInput.value.trim()) {
      setFieldError(nameInput, "Please enter your name.");
      valid = false;
    }

    if (!roleSelect.value) {
      setFieldError(roleSelect, "Please select a role.");
      valid = false;
    }

    if (!emailInput.value.trim()) {
      setFieldError(emailInput, "Please enter your email address.");
      valid = false;
    } else if (!validEmail(emailInput.value)) {
      setFieldError(emailInput, "Please enter a valid email address.");
      valid = false;
    }

    if (!passwordInput.value) {
      setFieldError(passwordInput, "Please create a password.");
      valid = false;
    } else if (!/^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(passwordInput.value)) {
      setFieldError(passwordInput, "Use 8 characters and one special character.");
      valid = false;
    }

    if (!confirmInput.value) {
      setFieldError(confirmInput, "Please confirm your password.");
      valid = false;
    } else if (passwordInput.value !== confirmInput.value) {
      setFieldError(confirmInput, "Password and confirm password must match.");
      valid = false;
    }

    if (!terms.checked) {
      setFieldError(terms, "Please accept the terms and conditions.");
      valid = false;
    }

    if (!valid) return;

    localStorage.setItem("loggedInUser", nameInput.value.trim());
    localStorage.setItem("stacklyEmail", emailInput.value.trim());
    localStorage.setItem("stacklyRole", roleSelect.value);
    showAuthMessage(form, "Signup successful. Redirecting to login...", "success");
    setTimeout(() => showPanel("login"), 900);
  }

  if (event.target.id === "loginForm") {
    event.preventDefault();
    const form = event.target;
    clearFieldErrors(form);
    let valid = true;

    const roleSelect = document.getElementById("loginRole");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const terms = form.querySelector('input[type="checkbox"]');

    if (!roleSelect.value) {
      setFieldError(roleSelect, "Please select a role.");
      valid = false;
    }

    if (!emailInput.value.trim()) {
      setFieldError(emailInput, "Please enter your email address.");
      valid = false;
    } else if (!validEmail(emailInput.value)) {
      setFieldError(emailInput, "Please enter a valid email address.");
      valid = false;
    }

    if (!passwordInput.value) {
      setFieldError(passwordInput, "Please enter your password.");
      valid = false;
    }

    if (!terms.checked) {
      setFieldError(terms, "Please accept the terms and conditions.");
      valid = false;
    }

    if (!valid) return;

    localStorage.setItem("loggedInUser", emailInput.value.trim());
    localStorage.setItem("stacklyEmail", emailInput.value.trim());
    localStorage.setItem("stacklyRole", roleSelect.value);

    window.location.href = roleSelect.value === "admin" ? "admin-dashboard.html" : "student-dashboard.html";
  }
});

showPanel(document.body.dataset.authStart === "signup" ? "signup" : "login");
