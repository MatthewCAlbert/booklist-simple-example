// Modal Setup
function toggleModal(id, status) {
  const modal = document.getElementById(id);
  const blackOverlay = modal.querySelector(".black-overlay");
  if (status) {
    modal.classList.remove("d-none");
    blackOverlay.classList.remove("d-none");
    blackOverlay.onclick = () => {
      toggleModal(id, false);
    };
    document.body.style.overflow = "hidden";
  } else {
    modal.classList.add("d-none");
    blackOverlay.classList.add("d-none");
    document.body.style.overflow = "auto";
  }
}

document.querySelectorAll(".modal").forEach((e) => {
  if (!e.querySelector(".black-overlay")) {
    const boV = document.createElement("div");
    boV.className = "black-overlay d-none";
    e.appendChild(boV);
  }
  e.querySelectorAll(`*[data-toggle="close"]`).forEach((clButton) => {
    clButton.addEventListener("click", () => {
      toggleModal(e.id, false);
    });
  });
  document
    .querySelectorAll(`*[data-modal-target=${e.id}]`)
    .forEach((opButton) => {
      opButton.addEventListener("click", () => {
        toggleModal(e.id, true);
      });
    });
});
