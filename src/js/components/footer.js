import { addClassName, removeClassName, queryMatches } from "./utils.js";
export function footer() {
  const mob = queryMatches(767.98, "max");
  document.querySelector(".current-year").innerHTML = new Date().getFullYear();



  gsap.timeline({
    scrollTrigger: {
      trigger: ".footer__container",
      start: "top center",
      onEnter: () => {
        document.querySelector(".footer").classList.add("active");
      },
    },
  })


  const footerBtn = document.querySelector(".footer__btn");
  const contactPopup = document.querySelector(".contact-popup");
  const contactCloseBtn = document.querySelector(".popup__close");
  const contactOverlay = document.querySelector(".popup__overlay");

  footerBtn.addEventListener("click", () => {
    addClassName(contactPopup);
    addClassName(document.documentElement, "popup-open");
    lenisScroll.stop();
  });

  contactPopup.addEventListener("click", (event) => {
    if (event.target === contactCloseBtn || event.target === contactOverlay) {
      removeClassName(contactPopup);
      removeClassName(document.documentElement, "popup-open");
      lenisScroll.start();
    }
  });

}


