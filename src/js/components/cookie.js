import { COMMON_MEDIA_QUERIES } from "./utils.js";

export function cookie() {
    const acceptCookieBtns = document.querySelectorAll('.accept-cookie');
    const cookie = document.querySelector('.cookies');

    const nameCookie = 'ax-userCookie';
    const valueCookie = 'hide cookie';

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    acceptCookieBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setCookie(nameCookie, valueCookie, 7);
            cookie.classList.add('hide-cookies');
        });
    });

    if (getCookie(nameCookie) === valueCookie) {
        cookie.classList.add('hide-cookies');
    }



    gsap.timeline({
        scrollTrigger: {
            trigger: '.footer',
            start: COMMON_MEDIA_QUERIES.MOBILE ? 'center 80%' : '20% 80%',
            end: COMMON_MEDIA_QUERIES.MOBILE ? 'center 80%' : '20% 80%',
            scrub: true,
            onEnter: () => {
                cookie.classList.add('space-bottom')
            },
            onLeaveBack: () => {
                cookie.classList.remove('space-bottom')
            }
        }
    })

}