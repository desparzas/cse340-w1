const form = document.querySelector("#updateForm");
form.addEventListener("change", function () {
  const updateBtn = document.querySelector("button");
  
  updateBtn.removeAttribute("disabled");
});

const updatePasswordForm = document.querySelector("#updatePasswordForm");
updatePasswordForm.addEventListener("change", function () {
  const updatePasswordBtn = document.querySelector("#cp-btn");
  
  updatePasswordBtn.removeAttribute("disabled");
});