// ==UserScript==
// @name         Power Delete Suite
// @namespace    pds
// @version      2
// @description  Add a power delete suite button to the reddit overview page.
// @author       ObiDriftKenobi
// @match        https://old.reddit.com/user/*/overview
// @grant        none
// ==/UserScript==

// Development/reference aid only. The bookmarklet URL below is generated from
// the pinned release; new releases require regenerating and reinstalling it.
// BEGIN GENERATED BOOKMARKLET
var PD_BOOKMARKLET_URL = "javascript:(function%20()%20%7B%0A%20%20window.bookmarkver%20%3D%20%221.4%22%3B%0A%20%20var%20CANONICAL_REPO%20%3D%20%22JustinHoMi%2FPowerDeleteSuite-updated%22%3B%0A%20%20var%20PINNED_REF%20%3D%20%225d675638a44740412496e23150105f7531f8e569%22%3B%0A%20%20var%20SCRIPT_SHA256%20%3D%0A%20%20%20%20%2290aef45aa10b771bad2e1c4838a001208012ebdc81b22982c2cbe512f0e7a5ce%22%3B%0A%20%20var%20isReddit%20%3D%0A%20%20%20%20document.location.hostname.split(%22.%22).slice(-2).join(%22.%22)%20%3D%3D%3D%20%22reddit.com%22%3B%0A%20%20var%20isOverview%20%3D%20document.location.href.match(%2F%5C%2Foverview%5Cb%2F)%3B%0A%20%20if%20(isReddit%20%26%26%20isOverview)%20%7B%0A%20%20%20%20load()%3B%0A%20%20%7D%20else%20if%20(%0A%20%20%20%20confirm(%0A%20%20%20%20%20%20%22This%20script%20can%20only%20be%20run%20from%20your%20own%20user%20profile%20on%20reddit.%20Would%20you%20like%20to%20go%20there%20now%3F%22%0A%20%20%20%20)%0A%20%20)%20%7B%0A%20%20%20%20document.location%20%3D%20%22https%3A%2F%2Fold.reddit.com%2Fu%2Fme%2Foverview%22%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20alert(%22Please%20go%20to%20your%20reddit%20profile%20before%20running%20this%20script%22)%3B%0A%20%20%7D%0A%0A%20%20async%20function%20load()%20%7B%0A%20%20%20%20var%20url%20%3D%0A%20%20%20%20%20%20%22https%3A%2F%2Fraw.githubusercontent.com%2F%22%20%2B%0A%20%20%20%20%20%20CANONICAL_REPO%20%2B%0A%20%20%20%20%20%20%22%2F%22%20%2B%0A%20%20%20%20%20%20PINNED_REF%20%2B%0A%20%20%20%20%20%20%22%2Fpowerdeletesuite.js%22%3B%0A%20%20%20%20try%20%7B%0A%20%20%20%20%20%20var%20response%20%3D%20await%20fetch(url)%3B%0A%20%20%20%20%20%20if%20(!response.ok)%20%7B%0A%20%20%20%20%20%20%20%20alert(%22Error%20retrieving%20PowerDeleteSuite%20(HTTP%20%22%20%2B%20response.status%20%2B%20%22)%22)%3B%0A%20%20%20%20%20%20%20%20return%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20var%20bytes%20%3D%20await%20response.arrayBuffer()%3B%0A%20%20%20%20%20%20if%20(!window.crypto%20%7C%7C%20!window.crypto.subtle)%20%7B%0A%20%20%20%20%20%20%20%20alert(%22PowerDeleteSuite%20cannot%20verify%20its%20own%20integrity%20in%20this%20browser.%22)%3B%0A%20%20%20%20%20%20%20%20return%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20var%20digest%20%3D%20await%20window.crypto.subtle.digest(%22SHA-256%22%2C%20bytes)%3B%0A%20%20%20%20%20%20var%20digestBytes%20%3D%20new%20Uint8Array(digest)%3B%0A%20%20%20%20%20%20var%20hex%20%3D%20%22%22%3B%0A%20%20%20%20%20%20for%20(var%20i%20%3D%200%3B%20i%20%3C%20digestBytes.length%3B%20i%2B%2B)%20%7B%0A%20%20%20%20%20%20%20%20hex%20%2B%3D%20(%220%22%20%2B%20digestBytes%5Bi%5D.toString(16)).slice(-2)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20if%20(hex%20!%3D%3D%20SCRIPT_SHA256)%20%7B%0A%20%20%20%20%20%20%20%20alert(%22PowerDeleteSuite%20integrity%20check%20failed%3B%20not%20executing.%22)%3B%0A%20%20%20%20%20%20%20%20return%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20var%20existing%20%3D%20document.getElementById(%22pd-script%22)%3B%0A%20%20%20%20%20%20if%20(%0A%20%20%20%20%20%20%20%20existing%20%26%26%0A%20%20%20%20%20%20%20%20existing.getAttribute(%22data-pd-hash%22)%20%3D%3D%3D%20SCRIPT_SHA256%20%26%26%0A%20%20%20%20%20%20%20%20window.pd%20%26%26%0A%20%20%20%20%20%20%20%20typeof%20window.pd.init%20%3D%3D%3D%20%22function%22%0A%20%20%20%20%20%20)%20%7B%0A%20%20%20%20%20%20%20%20window.pd.init()%3B%0A%20%20%20%20%20%20%20%20return%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20if%20(existing)%20%7B%0A%20%20%20%20%20%20%20%20existing.parentNode.removeChild(existing)%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20window.pd%20%3D%20undefined%3B%0A%0A%20%20%20%20%20%20var%20code%20%3D%20new%20TextDecoder(%22utf-8%22).decode(bytes)%3B%0A%20%20%20%20%20%20var%20script%20%3D%20document.createElement(%22script%22)%3B%0A%20%20%20%20%20%20script.id%20%3D%20%22pd-script%22%3B%0A%20%20%20%20%20%20script.setAttribute(%22data-pd-hash%22%2C%20SCRIPT_SHA256)%3B%0A%20%20%20%20%20%20script.textContent%20%3D%20code%3B%0A%20%20%20%20%20%20document.head.appendChild(script)%3B%0A%20%20%20%20%7D%20catch%20(e)%20%7B%0A%20%20%20%20%20%20alert(%22Error%20retrieving%20PowerDeleteSuite%20from%20GitHub%22)%3B%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D)()%3B%0A";
// END GENERATED BOOKMARKLET

(function() {
    'use strict';

    var list = document.querySelector("#header-bottom-right > ul.flat-list");
    if (!list || document.getElementById("pd-delete")) return;
    var separator = list.nextElementSibling;
    if (!separator) return;
    var clone = separator.cloneNode(true);
    var a = document.createElement("a");
    a.id = "pd-delete";
    a.textContent = "PDS";
    a.setAttribute("href", PD_BOOKMARKLET_URL);
    clone.appendChild(a);
    list.parentNode.insertBefore(clone, list.nextSibling);
})();
