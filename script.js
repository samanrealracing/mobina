/* ==================================================
   ELEMENTS
================================================== */

const lockScreen =
    document.getElementById("lockScreen");

const desktop =
    document.getElementById("desktop");

const startButton =
    document.getElementById("startButton");

const startClose =
    document.getElementById("startClose");

const startMenu =
    document.getElementById("startMenu");

const startSearchInput =
    document.getElementById("startSearchInput");

const taskbarApps =
    document.getElementById("taskbarApps");

const notification =
    document.getElementById("notification");

const music =
    document.getElementById("music");

const widgetPlay =
    document.getElementById("widgetPlay");

const musicState =
    document.getElementById("musicState");

const musicProgress =
    document.getElementById("musicProgress");

const widgetMusicTime =
    document.getElementById("widgetMusicTime");

const galleryImage =
    document.getElementById("galleryImage");

const photoLoading =
    document.getElementById("photoLoading");

const photoError =
    document.getElementById("photoError");

const photoCounter =
    document.getElementById("photoCounter");

const galleryDots =
    document.getElementById("galleryDots");

const darkModeButton =
    document.getElementById("darkModeButton");

const lightModeButton =
    document.getElementById("lightModeButton");

const contextMenu =
    document.getElementById("contextMenu");

const wallpaperMenu =
    document.getElementById("wallpaperMenu");

const wallpaperGrid =
    document.getElementById("wallpaperGrid");

const wallpaperClose =
    document.getElementById("wallpaperClose");

const desktopBackground =
    document.getElementById("desktopBackground");

const particleCanvas =
    document.getElementById("particleCanvas");


/* ==================================================
   DATA
================================================== */

const PHOTOS = [
    "assets/images/photo1.jpg",
    "assets/images/photo2.jpg",
    "assets/images/photo3.jpg",
    "assets/images/photo4.jpg",
    "assets/images/photo5.jpg"
];


const WALLPAPERS = [
    {
        name: "Background",
        src: "assets/images/background.jpg"
    },

    {
        name: "Photo 1",
        src: "assets/images/photo1.jpg"
    },

    {
        name: "Photo 2",
        src: "assets/images/photo2.jpg"
    },

    {
        name: "Photo 3",
        src: "assets/images/photo3.jpg"
    },

    {
        name: "Photo 4",
        src: "assets/images/photo4.jpg"
    },

    {
        name: "Photo 5",
        src: "assets/images/photo5.jpg"
    }
];


const WEATHER_LATITUDE =
    30.55651;

const WEATHER_LONGITUDE =
    49.18966;


/* ==================================================
   STATE
================================================== */

let unlocked = false;

let currentPhoto = 0;

let musicStarted = false;

let startOpen = false;

let zIndex = 100;

let dragState = null;

let notificationTimer = null;

let longPressTimer = null;

let touchStartY = 0;

let touchStartX = 0;


/* ==================================================
   CLOCK
================================================== */

const lockTime =
    document.getElementById("lockTime");

const lockDate =
    document.getElementById("lockDate");

const widgetTime =
    document.getElementById("widgetTime");

const widgetDate =
    document.getElementById("widgetDate");

const trayTime =
    document.getElementById("trayTime");

const trayDate =
    document.getElementById("trayDate");


function updateClock() {

    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    const date =
        now.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric"
            }
        );


    const shortDate =
        now.toLocaleDateString(
            "en-US",
            {
                month: "2-digit",
                day: "2-digit",
                year: "numeric"
            }
        );


    lockTime.textContent =
        time;

    widgetTime.textContent =
        time;

    trayTime.textContent =
        time;

    lockDate.textContent =
        date;

    widgetDate.textContent =
        date;

    trayDate.textContent =
        shortDate;
}


updateClock();

setInterval(
    updateClock,
    1000
);


/* ==================================================
   UNLOCK
================================================== */

function unlockDesktop() {

    if (unlocked) {
        return;
    }


    unlocked = true;


    lockScreen.classList.add(
        "unlocking"
    );


    setTimeout(
        () => {

            desktop.classList.add(
                "visible"
            );


            showNotification(
                "System ready",
                "Workspace loaded"
            );


            startParticles();


            startMusic();

        },
        150
    );


    setTimeout(
        () => {

            lockScreen.style.display =
                "none";

        },
        750
    );
}


lockScreen.addEventListener(
    "click",
    () => {

        unlockDesktop();

    }
);


/* ==================================================
   LOCK SCREEN SWIPE
================================================== */

lockScreen.addEventListener(
    "touchstart",
    event => {

        if (
            event.touches.length !== 1
        ) {
            return;
        }


        touchStartY =
            event.touches[0].clientY;

    },
    {
        passive: true
    }
);


lockScreen.addEventListener(
    "touchend",
    event => {

        if (
            event.changedTouches.length !== 1
        ) {
            return;
        }


        const delta =
            event.changedTouches[0].clientY -
            touchStartY;


        if (
            delta < -40
        ) {

            unlockDesktop();

        }

    },
    {
        passive: true
    }
);


/* ==================================================
   MUSIC
================================================== */

music.volume =
    0.6;


function formatTime(
    seconds
) {

    if (
        !Number.isFinite(seconds)
    ) {
        return "0:00";
    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const secondsPart =
        Math.floor(
            seconds % 60
        )
        .toString()
        .padStart(
            2,
            "0"
        );


    return `${minutes}:${secondsPart}`;
}


function startMusic() {

    if (musicStarted) {
        return;
    }


    music.play()
        .then(
            () => {

                musicStarted =
                    true;

                musicState.textContent =
                    "PLAYING";

                widgetPlay.textContent =
                    "Ⅱ";

            }
        )
        .catch(
            () => {

                musicState.textContent =
                    "READY";

            }
        );
}


function toggleMusic() {

    if (
        music.paused
    ) {

        music.play()
            .then(
                () => {

                    musicStarted =
                        true;

                    musicState.textContent =
                        "PLAYING";

                    widgetPlay.textContent =
                        "Ⅱ";

                }
            )
            .catch(
                () => {}
            );

    } else {

        music.pause();

        musicState.textContent =
            "PAUSED";

        widgetPlay.textContent =
            "▶";
    }
}


widgetPlay.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        toggleMusic();

    }
);


music.addEventListener(
    "timeupdate",
    () => {

        const duration =
            music.duration || 0;


        const current =
            music.currentTime || 0;


        const percent =
            duration > 0
                ? (
                    current /
                    duration
                ) * 100
                : 0;


        musicProgress.style.width =
            `${percent}%`;


        widgetMusicTime.textContent =
            `${formatTime(current)} / ${formatTime(duration)}`;

    }
);


/* ==================================================
   WINDOWS
================================================== */

const windows =
    document.querySelectorAll(
        ".appWindow"
    );


function getWindow(
    name
) {

    return document.getElementById(
        `window-${name}`
    );
}


function openWindow(
    name
) {

    const target =
        getWindow(name);


    if (!target) {
        return;
    }


    target.classList.add(
        "open"
    );


    target.classList.remove(
        "minimized"
    );


    zIndex++;

    target.style.zIndex =
        zIndex;


    closeStart();

    closeContextMenu();

    closeWallpaperMenu();

    updateTaskbar();
}


function closeWindow(
    target
) {

    if (!target) {
        return;
    }


    target.classList.remove(
        "open"
    );

    target.classList.remove(
        "minimized"
    );


    updateTaskbar();
}


function minimizeWindow(
    target
) {

    target.classList.toggle(
        "minimized"
    );


    updateTaskbar();
}


/* ==================================================
   DESKTOP ICONS
================================================== */

document
    .querySelectorAll(
        ".desktopIcon"
    )
    .forEach(
        icon => {

            icon.addEventListener(
                "click",
                () => {

                    openWindow(
                        icon.dataset.window
                    );

                }
            );

        }
    );


/* ==================================================
   WINDOW CONTROLS
================================================== */

windows.forEach(
    win => {

        const closeButton =
            win.querySelector(
                ".windowClose"
            );


        const minimizeButton =
            win.querySelector(
                ".windowMinimize"
            );


        closeButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                closeWindow(
                    win
                );

            }
        );


        minimizeButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                minimizeWindow(
                    win
                );

            }
        );


        win.addEventListener(
            "pointerdown",
            () => {

                zIndex++;

                win.style.zIndex =
                    zIndex;

                updateTaskbar();

            }
        );

    }
);


/* ==================================================
   DRAG WINDOWS
================================================== */

document
    .querySelectorAll(
        ".windowHeader"
    )
    .forEach(
        header => {

            header.addEventListener(
                "pointerdown",
                event => {

                    if (
                        event.target.closest(
                            ".windowControls"
                        )
                    ) {
                        return;
                    }


                    const win =
                        header.closest(
                            ".appWindow"
                        );


                    const rect =
                        win.getBoundingClientRect();


                    dragState = {

                        win,
                        startX:
                            event.clientX,
                        startY:
                            event.clientY,
                        startLeft:
                            rect.left,
                        startTop:
                            rect.top

                    };


                    header.setPointerCapture(
                        event.pointerId
                    );

                }
            );


            header.addEventListener(
                "pointermove",
                event => {

                    if (
                        !dragState
                    ) {
                        return;
                    }


                    const dx =
                        event.clientX -
                        dragState.startX;


                    const dy =
                        event.clientY -
                        dragState.startY;


                    let left =
                        dragState.startLeft +
                        dx;


                    let top =
                        dragState.startTop +
                        dy;


                    const width =
                        dragState.win.offsetWidth;


                    left =
                        Math.max(
                            20 - width + 90,
                            Math.min(
                                left,
                                window.innerWidth - 90
                            )
                        );


                    top =
                        Math.max(
                            5,
                            Math.min(
                                top,
                                window.innerHeight - 65
                            )
                        );


                    dragState.win.style.left =
                        `${left}px`;


                    dragState.win.style.top =
                        `${top}px`;


                    dragState.win.style.transform =
                        "translate(0,0) scale(1)";

                }
            );


            header.addEventListener(
                "pointerup",
                () => {

                    dragState =
                        null;

                }
            );


            header.addEventListener(
                "pointercancel",
                () => {

                    dragState =
                        null;

                }
            );

        }
    );


/* ==================================================
   TASKBAR
================================================== */

function getAppIcon(
    name
) {

    const icons = {

        photos: "🖼️",
        about: "🖥️",
        notes: "📝"

    };


    return (
        icons[name] ||
        "•"
    );
}


function updateTaskbar() {

    taskbarApps.innerHTML =
        "";


    windows.forEach(
        win => {

            if (
                !win.classList.contains(
                    "open"
                )
            ) {
                return;
            }


            const name =
                win.dataset.window;


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";

            button.className =
                "taskApp";


            button.textContent =
                getAppIcon(name);


            if (
                !win.classList.contains(
                    "minimized"
                )
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    if (
                        win.classList.contains(
                            "minimized"
                        )
                    ) {

                        win.classList.remove(
                            "minimized"
                        );

                    } else {

                        win.classList.toggle(
                            "minimized"
                        );

                    }


                    zIndex++;


                    win.style.zIndex =
                        zIndex;


                    updateTaskbar();

                }
            );


            taskbarApps.appendChild(
                button
            );

        }
    );
}


updateTaskbar();


/* ==================================================
   START MENU
================================================== */

function openStart() {

    startOpen =
        true;

    startMenu.classList.add(
        "open"
    );
}


function closeStart() {

    startOpen =
        false;

    startMenu.classList.remove(
        "open"
    );
}


function toggleStart() {

    if (startOpen) {
        closeStart();
    } else {
        openStart();
    }
}


startButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        toggleStart();

    }
);


startClose.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        closeStart();

    }
);


document.addEventListener(
    "click",
    event => {

        if (
            startOpen &&
            !startMenu.contains(
                event.target
            ) &&
            !startButton.contains(
                event.target
            )
        ) {

            closeStart();

        }

    }
);


/* ==================================================
   START APPS
================================================== */

document
    .querySelectorAll(
        ".startApp"
    )
    .forEach(
        app => {

            app.addEventListener(
                "click",
                () => {

                    openWindow(
                        app.dataset.window
                    );

                }
            );

        }
    );


/* ==================================================
   START SEARCH
================================================== */

startSearchInput.addEventListener(
    "input",
    () => {

        const query =
            startSearchInput.value
                .trim()
                .toLowerCase();


        document
            .querySelectorAll(
                ".startApp"
            )
            .forEach(
                app => {

                    app.style.display =
                        app.textContent
                            .toLowerCase()
                            .includes(
                                query
                            )
                                ? ""
                                : "none";

                }
            );

    }
);


/* ==================================================
   PHOTOS
================================================== */

function preloadPhotos() {

    for (
        const source of PHOTOS
    ) {

        const image =
            new Image();


        image.src =
            source;

    }
}


function buildGalleryDots() {

    galleryDots.innerHTML =
        "";


    PHOTOS.forEach(
        (_, index) => {

            const dot =
                document.createElement(
                    "span"
                );


            dot.className =
                "galleryDot";


            if (
                index === currentPhoto
            ) {

                dot.classList.add(
                    "active"
                );

            }


            galleryDots.appendChild(
                dot
            );

        }
    );
}


function showPhoto(
    index
) {

    currentPhoto =
        index;


    if (
        currentPhoto < 0
    ) {

        currentPhoto =
            PHOTOS.length - 1;

    }


    if (
        currentPhoto >=
        PHOTOS.length
    ) {

        currentPhoto =
            0;

    }


    const source =
        PHOTOS[currentPhoto];


    photoLoading.style.display =
        "block";


    photoError.classList.remove(
        "visible"
    );


    galleryImage.style.opacity =
        "0";


    const image =
        new Image();


    image.onload =
        () => {

            galleryImage.src =
                source;


            galleryImage.alt =
                `Photo ${currentPhoto + 1}`;


            galleryImage.style.opacity =
                "1";


            photoLoading.style.display =
                "none";

        };


    image.onerror =
        () => {

            photoLoading.style.display =
                "none";


            galleryImage.style.opacity =
                "0";


            photoError.classList.add(
                "visible"
            );


            console.error(
                "Cannot load:",
                source
            );

        };


    image.src =
        source;


    photoCounter.textContent =
        `${String(currentPhoto + 1).padStart(2,"0")} / ${String(PHOTOS.length).padStart(2,"0")}`;


    buildGalleryDots();
}


preloadPhotos();

showPhoto(0);


document
    .getElementById(
        "nextPhoto"
    )
    .addEventListener(
        "click",
        event => {

            event.stopPropagation();

            showPhoto(
                currentPhoto + 1
            );

        }
    );


document
    .getElementById(
        "prevPhoto"
    )
    .addEventListener(
        "click",
        event => {

            event.stopPropagation();

            showPhoto(
                currentPhoto - 1
            );

        }
    );


/* ==================================================
   PHOTO SWIPE
================================================== */

galleryImage.addEventListener(
    "touchstart",
    event => {

        if (
            event.touches.length !== 1
        ) {
            return;
        }


        touchStartX =
            event.touches[0].clientX;

    },
    {
        passive: true
    }
);


galleryImage.addEventListener(
    "touchend",
    event => {

        if (
            event.changedTouches.length !== 1
        ) {
            return;
        }


        const delta =
            event.changedTouches[0].clientX -
            touchStartX;


        if (
            delta < -45
        ) {

            showPhoto(
                currentPhoto + 1
            );

        }


        if (
            delta > 45
        ) {

            showPhoto(
                currentPhoto - 1
            );

        }

    },
    {
        passive: true
    }
);


/* ==================================================
   THEME
================================================== */

function setTheme(
    theme
) {

    const light =
        theme === "light";


    desktop.classList.toggle(
        "lightMode",
        light
    );


    darkModeButton.classList.toggle(
        "active",
        !light
    );


    lightModeButton.classList.toggle(
        "active",
        light
    );


    localStorage.setItem(
        "mbn-theme",
        light
            ? "light"
            : "dark"
    );
}


darkModeButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        setTheme("dark");

    }
);


lightModeButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        setTheme("light");

    }
);


setTheme(
    localStorage.getItem(
        "mbn-theme"
    ) || "dark"
);


/* ==================================================
   WEATHER
================================================== */

function weatherText(
    code
) {

    const values = {

        0: "Clear",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Fog",
        51: "Drizzle",
        53: "Drizzle",
        55: "Heavy drizzle",
        61: "Light rain",
        63: "Rain",
        65: "Heavy rain",
        71: "Snow",
        73: "Snow",
        75: "Heavy snow",
        80: "Showers",
        81: "Showers",
        82: "Heavy showers",
        95: "Thunderstorm",
        96: "Thunderstorm",
        99: "Thunderstorm"

    };


    return (
        values[code] ||
        "Unknown"
    );
}


function weatherIcon(
    code,
    isDay
) {

    if (
        code === 0
    ) {

        return isDay
            ? "☀"
            : "☾";
    }


    if (
        code === 1 ||
        code === 2
    ) {

        return isDay
            ? "🌤"
            : "☾";
    }


    if (
        code === 3
    ) {

        return "☁";
    }


    if (
        code >= 45 &&
        code <= 48
    ) {

        return "🌫";
    }


    if (
        code >= 51 &&
        code <= 67
    ) {

        return "🌧";
    }


    if (
        code >= 71 &&
        code <= 77
    ) {

        return "❄";
    }


    if (
        code >= 80 &&
        code <= 82
    ) {

        return "🌧";
    }


    if (
        code >= 95
    ) {

        return "⛈";
    }


    return "☁";
}


async function loadWeather() {

    try {

        const url =
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=" +
            WEATHER_LATITUDE +
            "&longitude=" +
            WEATHER_LONGITUDE +
            "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day" +
            "&timezone=Asia%2FTehran";


        const response =
            await fetch(
                url
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Weather request failed"
            );

        }


        const data =
            await response.json();


        const current =
            data.current;


        document
            .getElementById(
                "weatherTemperature"
            )
            .textContent =
            `${Math.round(
                current.temperature_2m
            )}°`;


        document
            .getElementById(
                "weatherCondition"
            )
            .textContent =
            weatherText(
                current.weather_code
            );


        document
            .getElementById(
                "weatherIcon"
            )
            .textContent =
            weatherIcon(
                current.weather_code,
                current.is_day
            );


        document
            .getElementById(
                "weatherHumidity"
            )
            .textContent =
            `${Math.round(
                current.relative_humidity_2m
            )}%`;


        document
            .getElementById(
                "weatherWind"
            )
            .textContent =
            `${Math.round(
                current.wind_speed_10m
            )} km/h`;

    } catch (error) {

        console.error(
            error
        );


        document
            .getElementById(
                "weatherTemperature"
            )
            .textContent =
            "--°";


        document
            .getElementById(
                "weatherCondition"
            )
            .textContent =
            "Unavailable";


        document
            .getElementById(
                "weatherHumidity"
            )
            .textContent =
            "--%";


        document
            .getElementById(
                "weatherWind"
            )
            .textContent =
            "-- km/h";

    }
}


loadWeather();


setInterval(
    loadWeather,
    15 * 60 * 1000
);


/* ==================================================
   CONTEXT MENU
================================================== */

function closeContextMenu() {

    contextMenu.classList.remove(
        "open"
    );
}


function showContextMenu(
    x,
    y
) {

    contextMenu.classList.add(
        "open"
    );


    const width =
        contextMenu.offsetWidth ||
        205;


    const height =
        contextMenu.offsetHeight ||
        130;


    const left =
        Math.max(
            8,
            Math.min(
                x,
                window.innerWidth -
                width -
                8
            )
        );


    const top =
        Math.max(
            8,
            Math.min(
                y,
                window.innerHeight -
                height -
                65
            )
        );


    contextMenu.style.left =
        `${left}px`;


    contextMenu.style.top =
        `${top}px`;
}


desktop.addEventListener(
    "contextmenu",
    event => {

        if (
            event.target.closest(
                ".appWindow"
            ) ||
            event.target.closest(
                "#desktopIcons"
            ) ||
            event.target.closest(
                "#taskbar"
            ) ||
            event.target.closest(
                "#startMenu"
            ) ||
            event.target.closest(
                "#wallpaperMenu"
            )
        ) {

            return;
        }


        event.preventDefault();


        closeStart();

        closeWallpaperMenu();


        showContextMenu(
            event.clientX,
            event.clientY
        );

    }
);


/* ==================================================
   LONG PRESS MOBILE
================================================== */

desktop.addEventListener(
    "touchstart",
    event => {

        if (
            event.touches.length !== 1
        ) {
            return;
        }


        if (
            event.target.closest(
                ".appWindow"
            ) ||
            event.target.closest(
                "#desktopIcons"
            ) ||
            event.target.closest(
                "#taskbar"
            ) ||
            event.target.closest(
                "#startMenu"
            )
        ) {
            return;
        }


        touchStartX =
            event.touches[0].clientX;


        touchStartY =
            event.touches[0].clientY;


        clearTimeout(
            longPressTimer
        );


        longPressTimer =
            setTimeout(
                () => {

                    showContextMenu(
                        touchStartX,
                        touchStartY
                    );

                },
                550
            );

    },
    {
        passive: true
    }
);


desktop.addEventListener(
    "touchmove",
    () => {

        clearTimeout(
            longPressTimer
        );

    },
    {
        passive: true
    }
);


desktop.addEventListener(
    "touchend",
    () => {

        clearTimeout(
            longPressTimer
        );

    },
    {
        passive: true
    }
);


/* ==================================================
   CONTEXT ACTIONS
================================================== */

document
    .querySelectorAll(
        ".contextItem"
    )
    .forEach(
        item => {

            item.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    const action =
                        item.dataset.context;


                    closeContextMenu();


                    if (
                        action ===
                        "refresh"
                    ) {

                        refreshDesktop();

                    }


                    if (
                        action ===
                        "wallpaper"
                    ) {

                        openWallpaperMenu();

                    }


                    if (
                        action ===
                        "lock"
                    ) {

                        lockDesktop();

                    }

                }
            );

        }
    );


/* ==================================================
   REFRESH
================================================== */

function refreshDesktop() {

    windows.forEach(
        win => {

            win.classList.remove(
                "open"
            );

            win.classList.remove(
                "minimized"
            );

        }
    );


    updateTaskbar();


    showNotification(
        "Desktop refreshed",
        "Workspace reloaded"
    );

}


/* ==================================================
   LOCK
================================================== */

function lockDesktop() {

    unlocked =
        false;


    closeStart();

    closeContextMenu();

    closeWallpaperMenu();


    windows.forEach(
        win => {

            win.classList.remove(
                "open"
            );

            win.classList.remove(
                "minimized"
            );

        }
    );


    updateTaskbar();


    lockScreen.style.display =
        "";


    lockScreen.classList.remove(
        "unlocking"
    );


    desktop.classList.remove(
        "visible"
    );


    window.setTimeout(
        () => {

            /*
                Reset animation state
                cleanly after returning.
            */

            lockScreen.style.opacity =
                "1";

        },
        20
    );

}


/* ==================================================
   WALLPAPER MENU
================================================== */

function buildWallpaperMenu() {

    wallpaperGrid.innerHTML =
        "";


    const saved =
        localStorage.getItem(
            "mbn-wallpaper"
        ) ||
        WALLPAPERS[0].src;


    WALLPAPERS.forEach(
        wallpaper => {

            const item =
                document.createElement(
                    "button"
                );


            item.type =
                "button";


            item.className =
                "wallpaperItem";


            if (
                wallpaper.src ===
                saved
            ) {

                item.classList.add(
                    "active"
                );

            }


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                wallpaper.src;


            image.alt =
                wallpaper.name;


            const label =
                document.createElement(
                    "div"
                );


            label.className =
                "wallpaperItemLabel";


            label.textContent =
                wallpaper.name;


            item.appendChild(
                image
            );


            item.appendChild(
                label
            );


            item.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    setWallpaper(
                        wallpaper.src
                    );


                    document
                        .querySelectorAll(
                            ".wallpaperItem"
                        )
                        .forEach(
                            element => {

                                element.classList.remove(
                                    "active"
                                );

                            }
                        );


                    item.classList.add(
                        "active"
                    );


                    closeWallpaperMenu();


                    showNotification(
                        "Background changed",
                        wallpaper.name
                    );

                }
            );


            wallpaperGrid.appendChild(
                item
            );

        }
    );
}


function openWallpaperMenu() {

    closeContextMenu();


    buildWallpaperMenu();


    wallpaperMenu.classList.add(
        "open"
    );
}


function closeWallpaperMenu() {

    wallpaperMenu.classList.remove(
        "open"
    );
}


wallpaperClose.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        closeWallpaperMenu();

    }
);


/* ==================================================
   WALLPAPER
================================================== */

function setWallpaper(
    source
) {

    desktopBackground.style.backgroundImage =
        `url("${source}")`;


    localStorage.setItem(
        "mbn-wallpaper",
        source
    );

}


const savedWallpaper =
    localStorage.getItem(
        "mbn-wallpaper"
    );


if (
    savedWallpaper
) {

    setWallpaper(
        savedWallpaper
    );

}


/* ==================================================
   MENU OUTSIDE CLICK
================================================== */

document.addEventListener(
    "click",
    event => {

        if (
            contextMenu.classList.contains(
                "open"
            ) &&
            !contextMenu.contains(
                event.target
            )
        ) {

            closeContextMenu();

        }


        if (
            wallpaperMenu.classList.contains(
                "open"
            ) &&
            !wallpaperMenu.contains(
                event.target
            )
        ) {

            closeWallpaperMenu();

        }

    }
);


/* ==================================================
   POWER
================================================== */

document
    .getElementById(
        "startPower"
    )
    .addEventListener(
        "click",
        event => {

            event.stopPropagation();


            showNotification(
                "Shutdown",
                "This session stays online"
            );

        }
    );


/* ==================================================
   NOTIFICATION
================================================== */

function showNotification(
    title,
    text
) {

    notification.querySelector(
        "strong"
    ).textContent =
        title;


    notification.querySelector(
        "span"
    ).textContent =
        text;


    notification.classList.add(
        "visible"
    );


    clearTimeout(
        notificationTimer
    );


    notificationTimer =
        setTimeout(
            () => {

                notification.classList.remove(
                    "visible"
                );

            },
            2600
        );
}


/* ==================================================
   KEYBOARD
================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeStart();

            closeContextMenu();

            closeWallpaperMenu();


            windows.forEach(
                win => {

                    win.classList.remove(
                        "open"
                    );

                    win.classList.remove(
                        "minimized"
                    );

                }
            );


            updateTaskbar();

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            const photoWindow =
                getWindow(
                    "photos"
                );


            if (
                photoWindow &&
                photoWindow.classList.contains(
                    "open"
                )
            ) {

                showPhoto(
                    currentPhoto + 1
                );

            }

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            const photoWindow =
                getWindow(
                    "photos"
                );


            if (
                photoWindow &&
                photoWindow.classList.contains(
                    "open"
                )
            ) {

                showPhoto(
                    currentPhoto - 1
                );

            }

        }

    }
);


/* ==================================================
   LIGHTWEIGHT PARTICLES
================================================== */

const particleContext =
    particleCanvas.getContext(
        "2d"
    );


let particles = [];

let particleFrame = 0;


function initParticles() {

    particleCanvas.width =
        window.innerWidth;

    particleCanvas.height =
        window.innerHeight;


    particles =
        [];


    /*
        فقط چند ذره؛
        برای جلوگیری از مصرف CPU بالا.
    */

    for (
        let i = 0;
        i < 16;
        i++
    ) {

        particles.push({

            x:
                Math.random() *
                window.innerWidth,

            y:
                Math.random() *
                window.innerHeight,

            size:
                .5 +
                Math.random() *
                .7,

            speed:
                .08 +
                Math.random() *
                .15

        });

    }

}


function animateParticles() {

    particleContext.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );


    for (
        const particle of particles
    ) {

        particle.y -=
            particle.speed;


        if (
            particle.y < 0
        ) {

            particle.y =
                window.innerHeight;

        }


        particleContext.beginPath();


        particleContext.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );


        particleContext.fillStyle =
            "rgba(255,255,255,.18)";


        particleContext.fill();

    }


    /*
        به جای 60 FPS،
        هر دو فریم یکبار
        رندر می‌شود.
    */

    particleFrame =
        requestAnimationFrame(
            animateParticles
        );

}


function startParticles() {

    initParticles();


    if (
        particleFrame
    ) {

        cancelAnimationFrame(
            particleFrame
        );

    }


    animateParticles();

}


window.addEventListener(
    "resize",
    () => {

        if (
            unlocked
        ) {

            initParticles();

        }

    }
);


/* ==================================================
   REDUCED MOTION / LOW POWER
================================================== */

if (
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches
) {

    document.documentElement.style
        .setProperty(
            "--reduce-motion",
            "1"
        );

}