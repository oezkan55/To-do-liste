"use strict";

const btnTitle = document.querySelector(".btn-title");

const btnTitleAnimation = function () {
  const chars = btnTitle.textContent.split("");
  btnTitle.textContent = "";

  chars.forEach((p_char, p_i) => {
    const markup = `<span style="transition-delay: ${
      p_i * 30
    }ms">${p_char}</span>`;
    btnTitle.innerHTML += markup;
  });
};
btnTitleAnimation();
