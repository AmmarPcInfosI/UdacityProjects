/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

// Set scroll restoration behavior to manual
history.scrollRestoration = "manual";

// Define global variables
const rootElement = document.documentElement;
const navigationHeader = document.querySelector(".page__header");
const navigationBar = document.getElementById("navbar__list");
const navigationMenuLink = document.querySelectorAll("menu__link");
const sectionsAll = document.querySelectorAll("section");

// Initialize variables
let timerForHeaderDisplay;

/**
 * Helper Functions
 */

// Check if an element is in the viewport
function checkViewport(element) {
    const clientRect = element.getBoundingClientRect();
    return (
        (clientRect.top >= 0 &&
            clientRect.bottom <=
            (window.innerHeight ||
                document.documentElement.clientHeight)) ||
        (clientRect.top <= 70 &&
            clientRect.bottom >=
            (window.innerHeight || document.documentElement.clientHeight))
    );
}

// Add active class to a section and modify its style
function addActiveClass(section, className) {
    if (!section.classList.contains(className)) {
        section.classList.add(className);
        section.style.cssText =
            "background-color: #1d191940; border-radius: 10px;";
    }
}

// Remove active class from a section and reset its style
function removeActiveClass(section, className) {
    section.classList.remove(className);
    section.style.cssText = "";
}

// Show/hide the scroll button based on scroll position
function showScroller() {
    const scrollUpId = document.getElementById("scrollUp");
    const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
    if (rootElement.scrollTop / scrollTotal > 0.3) {
        scrollUpId.classList.remove("scrollerHide");
    } else {
        scrollUpId.classList.add("scrollerHide");
    }
}

// Add active state to a navigation link
function addActiveStateLink(current) {
    const currentTab = document.getElementById(current);
    if (!currentTab.classList.contains("act")) {
        currentTab.classList.remove("nonAct");
        currentTab.classList.add("act");
    }
}

// Remove active state from a navigation link
function removeActiveStateLink(current) {
    const currentTab = document.getElementById(current);
    currentTab.classList.remove("act");
    currentTab.classList.add("nonAct");
}

// Toggle the visibility of a section and update its status
function toggleSection(test, type) {
    const secId = test.dataset.idas;
    const sectionCollapse = document.getElementById(secId);
    const statusChange = sectionCollapse.querySelectorAll("span")[1];
    if (type == "link") {
        if (sectionCollapse.classList.contains("closedSection")) {
            sectionCollapse.classList.toggle("closedSection");
            statusChange.innerText = " - Opened";
        }
    } else {
        sectionCollapse.classList.toggle("closedSection");
        if (sectionCollapse.classList.contains("closedSection")) {
            statusChange.innerText = " - Closed";
        } else {
            statusChange.innerText = " - Opened";
        }
    }
}

/**

Helper Functions
*/
// Function to create the navigation bar
function createNavigationBar() {
    const navigationStack = document.createDocumentFragment();
    // Iterate through each section
    for (const section of sectionsAll) {
        const sectionId = section.id;
        const sectionName = section.dataset.nav;

        // Create list item and anchor element
        const listTab = document.createElement("li");
        const tabLink = document.createElement("a");

        // Set the text and attributes for the anchor element
        tabLink.innerText = sectionName.toUpperCase();
        tabLink.classList = "menu__link notSelect pointer-cursor";
        tabLink.href = `#${sectionId}`;
        tabLink.id = `${sectionId}_link`;
        tabLink.dataset.idas = `${sectionId}`;

        // Set the onclick event for the anchor element
        tabLink.onclick = function() {
            toggleSection(this, "link");
        };

        // Append the anchor element to the list item
        listTab.appendChild(tabLink);
        navigationStack.appendChild(listTab);
    }

    // Append the navigation stack to the navigation bar
    navigationBar.appendChild(navigationStack);
}

// Function to check and add 'your-active-class' to sections in view
function checkActiveView() {
    let currentActive = document.querySelector(".your-active-class");
    let notFound = true;
    // Iterate through each section
    for (const section of sectionsAll) {
        const sectionId = section.id;
        const updateMenuTab = `${sectionId}_link`;

        // Check if section is in the viewport
        if (checkViewport(section)) {
            notFound = false;

            if (currentActive) {
                const currentActiveId = currentActive.id;
                const currentActiveIdLink = `${currentActiveId}_link`;

                // Update active class and state for current section
                if (currentActive == section) {
                    if (!section.classList.contains("closedSection")) {
                        addActiveClass(section, "your-active-class");
                        addActiveStateLink(updateMenuTab);
                    }
                } else {
                    // Remove active class and state for current section
                    removeActiveClass(currentActive, "your-active-class");
                    removeActiveStateLink(currentActiveIdLink);

                    // Update active class and state for new section
                    if (!section.classList.contains("closedSection")) {
                        addActiveClass(section, "your-active-class");
                        addActiveStateLink(updateMenuTab);
                    }
                }
            } else {
                // Add active class and state for section
                if (!section.classList.contains("closedSection")) {
                    addActiveClass(section, "your-active-class");
                    addActiveStateLink(updateMenuTab);
                }
            }
        }
    }

    // Remove active class and state for sections not in view
    if (notFound) {
        for (const section of sectionsAll) {
            const sectionId = section.id;
            const updateMenuTab = `${sectionId}_link`;

            removeActiveClass(section, "your-active-class");
            removeActiveStateLink(updateMenuTab);
        }
    }
}

// Function to change scroll behavior
function changeScrollBehavior() {
    const selectHTML = document.querySelector("html");
    selectHTML.style.cssText = "scrollBehavior: smooth;";
}

// Function to scroll to the top of the page
function scrollToTopPage() {
    const pageHref = window.location.href;
    if (pageHref.indexOf("#")) {
        const noHashURL = pageHref.replace(/#.*$/, "");
        window.history.replaceState("", document.title, noHashURL);
    }
    window.scrollTo(0, 0);
}

// Function to create the scroller
function createScroller() {
    const scrollerDiv = document.createElement("div");
    scrollerDiv.id = "scrollUp";
    scrollerDiv.classList = "scrollerElement scrollerHide notSelect pointer-cursor";
    scrollerDiv.onclick = function() {
        scrollToTopPage();
    };
    const scrollerSpan = document.createElement("span");
    scrollerSpan.innerText = "UP";
    scrollerDiv.appendChild(scrollerSpan);
    const applyToHeader = document.querySelector("header");

    document.body.appendChild(scrollerDiv);
}

// Function to show the menu
function showMenu() {
    navigationHeader.classList.remove("hideMenu");
    clearTimeout(timerForHeaderDisplay);
    timerForHeaderDisplay = setTimeout(function() {
        navigationHeader.classList.add("hideMenu");
    }, 3500);
}

// Function to create collapsible section bars
function createSectionCollapsibleBar() {
    for (const section of sectionsAll) {
        const sectionId = section.id;
        const sectionName = section.dataset.nav;
        const titleCustom = section.querySelector("h2");
        titleCustom.dataset.idas = sectionId;
        titleCustom.classList.add("pointer-cursor");
        titleCustom.onclick = function() {
            toggleSection(this, "section");
        };

        titleCustom.innerHTML = "";

        const spanName = document.createElement("span");
        spanName.innerText = sectionName;

        const spanCollapse = document.createElement("span");
        spanCollapse.innerText = " - Opened";

        titleCustom.appendChild(spanName);
        titleCustom.appendChild(spanCollapse);
    }
}

/**

Main Code
*/
// Change scroll behavior
changeScrollBehavior();

// Create navigation bar
createNavigationBar();

// Create scroller
createScroller();

// Activate scroller
showScroller();

// Activate collapsible sections
createSectionCollapsibleBar();

// Activate scrolling monitor
window.addEventListener("scroll", checkActiveView);

// Activate menu hide when not scrolling
window.addEventListener("scroll", showMenu);