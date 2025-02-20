/**
 ** data-preload="url"
 ** data-preload-query="991.98, max"
 */
import "latest-createjs/lib/preloadjs/preloadjs.js";

import { queryMatches } from "./utils.js";

const animatePreloader = getAnimatePreloaderFn();

export async function preloader(cb) {
  lenisScroll.stop();

  const mediaToLoad = getSortedMediaElements();
  if (!mediaToLoad.length) {
    commonInstructions(cb);
    animatePreloader(1);
    return;
  }
  try {
    const loadedMedia = await getLoadedMedia(getLoadMediaSrc(mediaToLoad));
    setLoadedMedia(loadedMedia, mediaToLoad);
  } catch (error) {
    animatePreloader(1);
    console.log(error);
  }
  // window.dispatchEvent(new CustomEvent("media-loaded"))
  commonInstructions(cb);
}

async function getLoadedMedia(obj) {
  return new Promise((resolve, reject) => {
    const queue = new createjs.LoadQueue(true, null, true);

    queue.on("progress", async (e) => {
      animatePreloader(e.loaded);
    });

    queue.on("complete", () => {
      const urls = obj.reduce((acc, img) => {
        acc[img.id] = URL.createObjectURL(queue.getResult(img.id, true));
        return acc;
      }, {});
      resolve(urls);
    });
    queue.on("error", (error) => {
      reject(error);
    });
    queue.loadManifest(obj);
  });
}

/**
 * untouchable fns
 */
function getSortedMediaElements() {
  const mediaElements = [...document.querySelectorAll("[data-preload]")];
  if (!mediaElements.length) {
    return [];
  }

  const trash = [];
  const sortedMediaElements = mediaElements.filter((mediaElement) => {
    const mediaQuery = mediaElement.getAttribute("data-preload-query");
    if (mediaQuery) {
      const [viewport, constraint] = mediaQuery
        .split(",")
        .map((el) => el.trim());
      const matches = queryMatches(viewport, constraint);
      !matches ? trash.push(mediaElement) : null;
      return matches;
    }
    return true;
  });

  trash.forEach((el) => (el.style.display = "none"));

  return sortedMediaElements;
}

// Script for SAFARI Mobile
function validVideo() { }

function setLoadedMedia(loadedMedia, mediaToLoad) {
  mediaToLoad.forEach((node, i) => {
    const nodeType = node.tagName;
    node.src = loadedMedia[`${i}-${nodeType}`];
  });

  setTimeout(() => {
    document.documentElement.classList.add("loaded");
    document.documentElement.classList.remove("loading");
  }, 500);
}

function getLoadMediaSrc(medias) {
  const res = medias.map((item, i) => {
    const nodeType = item.tagName;
    return new createjs.LoadItem().set({
      id: `${i}-${nodeType}`,
      src: item.getAttribute("data-preload"),
      type: createjs.AbstractLoader.BLOB,
    });
  });
  return res;
}

function getAnimatePreloaderFn() {
  // const preloaderProgressbar = document.querySelector('.preloader__progressbar');
  const preloaderTotal = document.querySelector(".preloader__total span");
  if (preloaderTotal) {
    return function animatePreloader(value) {
      let path = value * 100;
      preloaderTotal.innerHTML = Math.floor(value * 100);
    };
  } else {
    return function animatePreloader(value) {
      console.log(value);
    };
  }
}

/**
 * cb функция должна реализовывать это - document.documentElement.classList.add("loaded");
 */
function commonInstructions(cb) {
  setTimeout(() => {
    document.documentElement.classList.add("loaded");
    setTimeout(() => {
      document.documentElement.classList.add("loaded-one-second");
      lenisScroll.start();
    }, 1200);
    dispatchEvent(new Event("media-loaded"));
    if (typeof cb === "function") {
      cb();
    } else {
      // document.body.style.overflow = '';
      setTimeout(() => {

      }, 1200);

      ScrollTrigger.refresh(true);
    }
  }, 500);

  validVideo();
}
