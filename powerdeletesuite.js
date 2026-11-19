var pd = {
  version: "1.4.18",
  bookmarkver: "1.4",
  editStrings: [
    "I love ice cream.",
    "I hate beer.",
    "My favorite color is blue.",
    "I enjoy reading books.",
    "I like to go hiking.",
    "My favorite movie is Inception.",
    "I enjoy playing video games.",
    "I like to travel.",
    "I'm learning to play the guitar.",
    "I enjoy cooking.",
    "I love listening to music.",
    "I enjoy watching the sunset.",
    "I like to explore new places.",
    "I find joy in reading a good book.",
    "I appreciate a good cup of coffee.",
    "I enjoy spending time with my friends.",
    "I like learning new things.",
    "I find peace in long walks.",
    "I enjoy the sound of rain.",
    "I love the smell of fresh bread.",
    "random string 1",
    "random string 2",
    "I like watching movies.",
    "I enjoy learning new languages.",
    "I love painting.",
    "I find joy in gardening.",
    "I like baking cookies.",
    "I enjoy swimming in the ocean.",
    "My favorite hobby is photography.",
    "I like playing chess.",
    "I enjoy going to the gym.",
    "I love spending time with family.",
    "I like riding my bike.",
    "I enjoy writing stories.",
    "My favorite sport is basketball.",
    "I like solving puzzles.",
    "I enjoy camping in the mountains.",
    "I love taking nature walks.",
    "I like listening to podcasts.",
    "I enjoy doing yoga.",
    "My favorite season is autumn.",
    "I like playing board games.",
    "I enjoy star gazing.",
"I love watching documentaries.",
"I like making crafts.",
"I enjoy attending concerts.",
"My favorite food is sushi.",
"I like trying new restaurants.",
"I enjoy going to the beach.",
"I love practicing mindfulness.",
"I like learning about history.",
"I enjoy playing the piano.",
"My favorite drink is tea.",
"I like volunteering in my community.",
"I enjoy visiting museums.",
"I love taking road trips.",
"I like working on DIY projects.",
"I enjoy playing with my pets.",
"My favorite dessert is cheesecake.",
"I like listening to audiobooks.",
"I enjoy doing crossword puzzles.",
"I love spending time in nature.",
"I like visiting art galleries.",
"I enjoy attending theater plays.",
"My favorite flower is the sunflower.",
"I like practicing meditation.",
"I enjoy cooking new recipes.",
"I love exploring national parks.",
"I like collecting stamps.",
"I enjoy attending festivals.",
"My favorite tree is the oak.",
"I like gardening in my backyard.",
"I enjoy learning new skills.",
"I love making pottery.",
"I like watching wildlife.",
"I enjoy going to farmers markets.",
"My favorite animal is the dolphin.",
"I like playing tennis.",
"I enjoy going on picnics.",
"I love watching the stars.",
"I like bird watching.",
"I enjoy making jewelry.",
"My favorite place is the mountains.",
"I like trying new hobbies.",
"I enjoy going on adventures.",
    "I love sailing on the lake.",
"I like attending sports events.",
"I enjoy taking dance classes.",
"My favorite book is Pride and Prejudice.",
"I like doing photography walks.",
"I enjoy visiting historical sites.",
"I love learning about astronomy.",
"I like playing with children.",
"I enjoy taking bubble baths.",
"My favorite band is The Beatles.",
"I like creating digital art.",
"I enjoy practicing archery.",
"I love watching animated movies.",
"I like doing science experiments.",
"I enjoy learning about marine life.",
"My favorite snack is popcorn.",
"I like building model airplanes.",
"I enjoy doing tai chi.",
"I love attending wine tastings.",
"I like knitting scarves.",
"I enjoy going to amusement parks.",
"My favorite TV show is Friends.",
"I like making homemade gifts.",
"I enjoy exploring caves.",
"I love listening to classical music.",
"I like making soap.",
"I enjoy trying new cuisines.",
"My favorite superhero is Spider-Man.",
"I like going to book clubs.",
"I enjoy doing escape rooms.",
"I love learning about different cultures.",
"I like practicing calligraphy.",
"I enjoy attending art workshops.",
"My favorite fruit is mango.",
"I like making candles.",
"I enjoy playing frisbee.",
"I love visiting botanical gardens.",
"I like going to the zoo.",
"I enjoy watching ballet.",
"My favorite author is J.K. Rowling.",
"I like practicing magic tricks.",
"I enjoy rock climbing.",
"I love learning about physics.",
"I like doing community service.",
"I enjoy making flower arrangements.",
"My favorite comedian is Robin Williams.",
"I like doing woodwork.",
"I enjoy going on nature hikes.",
"I love listening to jazz.",
"I like playing with Legos.",
"I enjoy attending live shows.",
"My favorite instrument is the violin.",
"I like learning new software.",
"I enjoy doing pottery classes.",
"I love participating in trivia nights.",
"I like going to the planetarium.",
"I enjoy learning about geology.",
"My favorite holiday is Christmas.",
"I like watching foreign films.",
"I enjoy writing poetry.",
"I love exploring abandoned places.",
    "I like practicing martial arts.",
"I enjoy doing mindfulness exercises.",
"I love learning about space exploration.",
"I like going to flea markets.",
"I enjoy collecting vintage items.",
"My favorite painter is Van Gogh.",
"I like making origami.",
"I enjoy going to car shows.",
"I love learning about ancient civilizations.",
"I like watching magic shows.",
"I enjoy doing jigsaw puzzles.",
"My favorite vegetable is broccoli.",
"I like attending science fairs.",
"I enjoy playing card games.",
"I love visiting aquariums.",
"I like practicing playing drums.",
"I enjoy making scrapbooks.",
"My favorite poet is Robert Frost.",
"I like visiting bookstores.",
"I enjoy doing improv comedy.",
"I love learning about psychology.",
"I like attending lectures.",
"I enjoy going on scenic drives.",
"My favorite cuisine is Italian.",
"I like creating comic strips.",
"I enjoy going to the opera.",
"I love watching musicals.",
"I like practicing parkour.",
"I enjoy learning about architecture.",
"My favorite drink is hot chocolate.",
"I like attending workshops.",
"I enjoy playing darts.",
"I love exploring forests.",
"I like learning about meteorology.",
"I enjoy going to the circus.",
"My favorite gemstone is sapphire.",
"I like practicing public speaking.",
"I enjoy doing charity work.",
"I love watching wildlife documentaries.",
"I like learning about mythology.",
"I enjoy doing metalworking.",
"My favorite planet is Saturn.",
"I like creating graphic designs.",
"I enjoy going to comedy clubs.",
"I love learning about economics.",
"I like making quilts.",
"I enjoy going to music festivals.",
"My favorite sculpture is The Thinker.",
"I like practicing yoga.",
"I enjoy attending cultural festivals.",
"I love learning about world history.",
"I like visiting libraries.",
"I enjoy doing voice acting.",
"My favorite dance is the tango.",
"I like making paper crafts.",
"I enjoy going to food tastings.",
"I love learning about anthropology.",
"I like attending art exhibitions.",
"I enjoy going to street fairs.",
"My favorite insect is the butterfly.",
"I like creating video content.",
"I enjoy participating in hackathons."
  ],
  init: function () {
    pd.checks.versions();
    if (window.pd_processing !== true) {
      if (pd.checks.location()) {
        $("#pd__central").find(".complete,.processing").hide();
        $("#pd__form").show();
        pd.setup.basicSettings();
        pd.setup.applyDom();
      } else {
        if (
          confirm(
            "This script can only be run from your own user profile on reddit. Would you like to go there now?"
          )
        ) {
          document.location = "https://old.reddit.com/u/me/overview";
        }
      }
    }
  },
  checks: {
    versions: function () {
      function checkBookmarkletVersion() {
        if (
          typeof window.bookmarkver === "undefined" ||
          window.bookmarkver !== pd.bookmarkver
        ) {
          if (
            confirm(
              "There's been an update to the bookmarklet. Would you like to go to the canonical GitHub repository to get the current pinned version?"
            )
          ) {
            alert(
              "A new pinned release requires replacing your current bookmark with the one from the canonical repository. The bookmarklet does not update itself."
            );
            document.location.href =
              "https://github.com/JustinHoMi/PowerDeleteSuite-updated";
            return false;
          }
        }
        return true;
      }
      function checkAppVersion() {
        pd.prevRunVersion = localStorage.getItem("pd_ver")
          ? localStorage.getItem("pd_ver")
          : "0";
        localStorage.setItem("pd_ver", pd.version);
        if (pd.version !== pd.prevRunVersion) {
          if (
            confirm(
              "You are now running PowerDeleteSuite v" +
                pd.version +
                ". Would you like to open the canonical repository in a new tab?"
            )
          ) {
            window.open(
              "https://github.com/JustinHoMi/PowerDeleteSuite-updated"
            );
          }
        }
        return true;
      }
      return pd.debugging || (checkBookmarkletVersion() && checkAppVersion());
    },
    location: function () {
      return (
        document.location.hostname.split(".").slice(-2).join(".") ==
          "reddit.com" &&
        document.location.href.match("/user/") &&
        document.location.href.match("/overview") &&
        $(".titlebox h1").first().text() ===
          $("#header-bottom-right .user a").first().text()
      );
    },
  },
  setup: {
    basicSettings: function () {
      pd.config = {
        uh: pd.helpers.modhash(),
        user: $("#header-bottom-right .user a").first().text(),
      };
      pd.endpoints = {
        comments: "/user/" + pd.config.user + "/comments/.json",
        submissions: "/user/" + pd.config.user + "/submitted/.json",
        search: "/search.json",
      };
    },
    applyDom: function () {
      if (pd.debugging) {
        $("#pd__central,#pd__style").remove("");
      }
      document.title = pd.config.user + " | Power Delete Suite";
      $(window).on("error", pd.error);

      $(".sitetable,.neverEndingReddit").remove();
      if ($("#pd__central").length === 0) {
        $("body>.content[role='main']").append("<div id='pd__central' />");
      }
      if ($("#pd__style").length === 0) {
        $("head").first().append("<style id='pd__style' />");
      }
      if (pd.setup.applyStyles() === false) return;
      pd.setup.applyCentral();
    },
    applyStyles: function () {
      var style = document.getElementById("pd__style");
      if (
        !style ||
        typeof pd.stylesheet !== "string" ||
        pd.stylesheet.length === 0
      ) {
        alert("PowerDeleteSuite stylesheet is missing; aborting.");
        return false;
      }
      style.textContent = pd.stylesheet;
      $("#pd__central").show();
      return true;
    },
    applyCentral: function () {
      if (!pd.centralForm) {
        alert("PowerDeleteSuite form failed to load; aborting.");
        return;
      }
      $("#pd__central").html(pd.centralForm);
      if ($("#pd__form").length === 0) {
        alert("PowerDeleteSuite form failed to load; aborting.");
        return;
      }
      if ($("#pd__style").html() === "") {
        $("#pd__central").hide();
      }
      if (pd.debugging) {
        $("#pd__central").find(".debugging").removeClass("debugging");
      }
      $("#pd__central")
        .find("h2")
        .first()
        .text("Power Delete Suite v" + pd.version);
      pd.setup.applySubList();
      pd.setup.bindUI();
      pd.helpers.restoreSettings();
    },
    applySubList: function () {
      var sub_arr = [],
        i,
        sid;
      $("#per-sr-karma tbody th").each(function () {
        sub_arr.push($(this).text());
      });
      sub_arr = sub_arr.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });
      $("#pd__sub-list").append(
        '<div><a class="ind mass_sel sel_all">Select All</a><a class="ind mass_sel sel_none">Select None</a></div>'
      );
      for (i = 0; i < sub_arr.length; i++) {
        sid = "sub--" + sub_arr[i];
        $("#pd__sub-list").append(
          "<div><input class='ind' data-sub='" +
            sub_arr[i] +
            "' type='checkbox' name='" +
            sid +
            "' id='" +
            sid +
            "''/><label class='" +
            sid +
            "' for='" +
            sid +
            "'>" +
            sub_arr[i] +
            "</label></div>"
        );
      }
      $("#side-mod-list li").each(function () {
        $(
          ".sub--" +
            $(this)
              .text()
              .replace(/\/?[ru]\//, "")
        ).prepend("<b class='m'>[M]</b>");
      });
    },
    createProcessStream: function () {
      window.pd_processing = true;
      pd.exportItems = [];
      pd.exportIds = [];
      pd.task = {
        after: "",
        editedIds: Object.create(null),
        info: {
          numPages: Math.min(
            ($("#pd__submissions").is(":checked") ? 8 : 0) +
              ($("#pd__comments").is(":checked") ? 4 : 0) +
              ($("#pd__comments-edit").is(":checked") ? 12 : 0),
            12
          ),
          numItems: 0,
          donePages: 0,
          doneItems: 0,

          pageCalls: 0,
          edited: 0,
          deleted: 0,
          errors: 0,
          ignored: 0,
          exported: 0,
          ignoreReasons: {
            subs: 0,
            gold: 0,
            saved: 0,
            mod: 0,
            score: 0,
            date: 0,
          },
        },
        config: {
          isExporting: $("#pd__export").is(":checked"),
          isRemovingPosts: $("#pd__submissions").is(":checked"),
          isRemovingComments: $("#pd__comments").is(":checked"),
          isEditing: $("#pd__comments-edit").is(":checked"),
          editText: $("#pd__comments-edit-text").val(),
        },
        paths: {
          sections:
            !$("#pd__submissions").is(":checked") &&
            !$("#pd__export").is(":checked")
              ? [
                  "comments",
                  "search",
                  "submissions",
                ] /* Search is actually more efficient than submissions if we're not handling submissions (`self:1`) */
              : ["comments", "submissions", "search"],
          sorts: ["new", "hot", "top", "controversial"],
          timeframes: ["all", "hour", "day", "week", "month", "year"],
        },
      };
      var checkedSubs = $("#pd__sub-list input:checked")
        .map(function () {
          return String($(this).attr("data-sub") || "")
            .trim()
            .toLowerCase();
        })
        .get();

      // A checked subreddit is an explicit request to limit the run. Do not
      // silently drop that limit when the master checkbox is unchecked.
      if (checkedSubs.length > 0) {
        $("#pd__subreddits").prop("checked", true);
      }

      pd.filters = {
        subs: {
          enabled:
            checkedSubs.length > 0 ||
            $("#pd__subreddits").is(":checked"),
          list: checkedSubs,
        },
        score: {
          enabled: $("#pd__score").is(":checked"),
          gt: $("#pd__score-dirtoggle").is(":checked"),
          num: parseFloat($("#pd__score-num").val()),
        },
        date: {
          enabled: $("#pd__date").is(":checked"),
          gt: $("#pd__date-dirtoggle").is(":checked"),
          num:
            Math.floor(new Date().getTime() / 1000) -
            parseFloat($("#pd__date-num").val()) * 60,
        },
        gilded: $("#pd__gilded").is(":checked"),
        saved: $("#pd__saved").is(":checked"),
        mod: $("#pd__mod").is(":checked"),
      };
    },
    resetSorts: function () {
      pd.task.paths.sorts = ["new", "hot", "top", "controversial"];
    },
    resetTimes: function () {
      pd.task.paths.timeframes = [
        "all",
        "hour",
        "day",
        "week",
        "month",
        "year",
      ];
    },
    bindUI: function () {
      $("#pd__form").submit(function (e) {
        e.preventDefault();
        pd.setup.createProcessStream();
        var validation = pd.helpers.validate();
        window.pd_processing = validation.valid;
        if (validation.valid) {
          $("#pd__central .complete, #pd__form").hide();
          $("#pd__central .processing").show();
          pd.actions.page.next();
        } else {
          alert(validation.reason);
        }
      });
      $(".pd__q").click(function (e) {
        e.preventDefault();
        alert($(this).closest("[data-help]").attr("data-help"));
      });
      $("#pd__form input").change(function () {
        pd.helpers.saveSettings();
      });
      $(".mass_sel").click(function () {
        $(this)
          .closest(".xtr-section")
          .find("input")
          .prop("checked", $(this).hasClass("sel_all"));
        pd.helpers.saveSettings();
      });
      $(".gt-toggle").change(function () {
        var greaterThan = $(this).hasClass("greater");
        $(this).attr(
          "class",
          "gt-toggle hidden " + (greaterThan ? "less" : "greater")
        );
      });
      $(".num-only").blur(function () {
        $(this).val(
          $(this)
            .val()
            .replace(/[^\d-]/g, "")
        );
        $(this).change();
      });
      $(".pd__insert").click(function () {
        $($(this).attr("data-target")).val($(this).attr("data-value")).change();
      });
    },
  },
  helpers: {
    modhash: function () {
      if (window.r && window.r.config && window.r.config.modhash) {
        return window.r.config.modhash;
      }

      var configEl = $("#config")[0],
        configText = configEl ? configEl.innerHTML : "";

      if (!configText) {
        return "";
      }

      var match = configText.match(/"modhash"\s*:\s*"([^"]*)"/);
      if (!match) {
        match = configText.match(/modhash[^a-z0-9]+([a-z0-9]+)/i);
      }

      return match ? match[1] : "";
    },
    apiHeaders: function () {
      return pd.config.uh ? { "X-Modhash": pd.config.uh } : {};
    },
    ajaxErrorMessage: function (jqXHR, textStatus, errorThrown) {
      var parts = [],
        responseText = "";

      if (jqXHR && jqXHR.responseText) {
        var raw = jqXHR.responseText,
          contentType =
            jqXHR.getResponseHeader && jqXHR.getResponseHeader("Content-Type");
        if (contentType && /json/i.test(contentType)) {
          responseText = raw;
        } else {
          try {
            // Reddit's block pages carry their theme CSS inline. Strip the
            // raw-text elements first so the user sees the message, not CSS.
            var html = raw
              .replace(/<style[\s\S]*?<\/style>/gi, " ")
              .replace(/<script[\s\S]*?<\/script>/gi, " ");
            responseText = new DOMParser().parseFromString(
              html,
              "text/html"
            ).body.textContent;
          } catch (e) {
            responseText = raw;
          }
        }
      }

      if (jqXHR && jqXHR.status) {
        parts.push("HTTP " + jqXHR.status);
      }
      if (textStatus) {
        parts.push(textStatus);
      }
      if (errorThrown) {
        parts.push(errorThrown);
      }
      if (responseText) {
        parts.push(responseText.replace(/\s+/g, " ").trim().slice(0, 300));
      }

      return parts.length ? " (" + parts.join(" - ") + ")" : "";
    },
    validate: function () {
      if (pd.task.config.isEditing && pd.task.config.editText === "") {
        var confirmEmptyEdit = window.confirm(
          "You have not entered any text to edit your posts to; junk text will be used instead."
        );
        return {
          valid: !!confirmEmptyEdit,
          reason:
            confirmEmptyEdit ? "valid" :
            "Please enter something to edit your comments / self posts to.",
        };
      } else if (pd.filters.score && $("#pd_score-num").val() === "") {
        return { valid: false, reason: "Please enter a score to filter with." };
      } else if (
        !(
          pd.task.config.isRemovingPosts ||
          pd.task.config.isEditing ||
          pd.task.config.isRemovingComments ||
          pd.task.config.isExporting
        )
      ) {
        return {
          valid: false,
          reason:
            "There are no actions chosen, so we've got nothing to do. Please select an action.",
        };
      } else if (
        !pd.config.uh &&
        (pd.task.config.isRemovingPosts ||
          pd.task.config.isEditing ||
          pd.task.config.isRemovingComments)
      ) {
        return {
          valid: false,
          reason:
            "Reddit did not expose a modhash for this page. Make sure you are logged in on old.reddit.com, reload your overview page, and run Power Delete Suite again.",
        };
      }
      return { valid: true, reason: "valid" };
    },
    shouldBeActedOn: function (item) {
      var check = {
        subs:
          !pd.filters.subs.enabled ||
          $.inArray(
            String(item.data.subreddit || "")
              .trim()
              .toLowerCase(),
            pd.filters.subs.list
          ) >= 0,
        gold: !(pd.filters.gilded && item.data.gilded == 1),
        saved: !(pd.filters.saved && item.data.saved == true),
        mod: !(pd.filters.mod && item.data.distinguished != null),
        score:
          !pd.filters.score.enabled ||
          (pd.filters.score.enabled &&
            ((pd.filters.score.gt === true &&
              parseFloat(item.data.score) > pd.filters.score.num) ||
              (pd.filters.score.gt === false &&
                parseFloat(item.data.score) < pd.filters.score.num))),
        date:
          !pd.filters.date.enabled ||
          (pd.filters.date.enabled &&
            ((pd.filters.date.gt === true &&
              parseFloat(item.data.created_utc) > pd.filters.date.num) ||
              (pd.filters.date.gt === false &&
                parseFloat(item.data.created_utc) < pd.filters.date.num))),
      };
      for (var key in check) {
        if (!check[key]) {
          pd.task.info.ignoreReasons[key]++;
          pd.task.items[0].pdIgnoreReasons = check;
        }
      }
      return (
        check.subs &&
        check.gold &&
        check.saved &&
        check.mod &&
        check.score &&
        check.date
      );
    },
    csvEscape: function (str) {
      return str.replace(/#/g, "%23").replace(/'/g, "`").replace(/"/g, '""');
    },
    csvCell: function (str) {
      return '"' + str + '",';
    },
    getSettings: function () {
      return localStorage.getItem("pd_storage")
        ? JSON.parse(localStorage.getItem("pd_storage"))
        : false;
    },
    restoreSettings: function () {
      var settings = pd.helpers.getSettings(),
        rememberSettings = $("#pd__remember").is(":checked");
      if (settings !== false && rememberSettings) {
        $("#pd__form input").prop("checked", false).val(""); //Reset all
        for (var i = 0; i < settings.length; i++) {
          var setting = settings[i],
            selector = "*[name='" + setting.name + "']";
          if (setting.value == "on" || setting.value === "") {
            $(selector).prop("checked", true);
          } else {
            $(selector).val(setting.value);
          }
        }
        if ($("#pd__sub-list input:checked").length > 0) {
          $("#pd__subreddits").prop("checked", true);
        }
        $(".gt-toggle").not(":checked").change();
      }
    },
    currentText: function (item) {
      var text = item.kind == "t1" ? item.data.body : item.data.selftext;
      return typeof text === "string" ? text : null;
    },
    editTextFor: function (item) {
      if (pd.task.config.editText) {
        return pd.task.config.editText;
      }
      var id = String(item.data.id || item.data.name || ""),
        hash = 0;
      for (var i = 0; i < id.length; i++) {
        hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
      }
      return pd.editStrings[hash % pd.editStrings.length];
    },
    isGoneText: function (text) {
      return typeof text === "string" && /^\[(deleted|removed)\]$/i.test(text.trim());
    },
    saveSettings: function () {
      if ($("#pd__remember").is(":checked")) {
        if (!$("#pd__subreddits").is(":checked")) {
          $("#pd__sub-list input").prop("checked", false);
        }
        localStorage.setItem(
          "pd_storage",
          JSON.stringify($("#pd__form").serializeArray())
        );
      } else {
        localStorage.removeItem("pd_storage");
      }
    },
  },
  rateLimit: {
    minIntervalMs: 8000,
    maxIntervalMs: 60000,
    intervalMs: 8000,
    minBackoffMs: 5000,
    baseBackoffMs: 5000,
    maxBackoffMs: 900000,
    jitterRatio: 0.2,
    maxRetries: 0,
    maxBlockedRetries: 5,
    lowRemaining: 5,
    recoverAfter: 5,
    consecutiveThrottles: 0,
    successStreak: 0,
    nextSlot: 0,
    penaltyUntil: 0,
    responseHeader: function (jqXHR, name) {
      return jqXHR && typeof jqXHR.getResponseHeader === "function"
        ? jqXHR.getResponseHeader(name)
        : null;
    },
    isRateLimitedResponse: function (data) {
      var errors = data && data.json && data.json.errors;
      if (!errors || !errors.length) {
        return null;
      }
      for (var i = 0; i < errors.length; i++) {
        if (errors[i] && /^RATELIMIT$/i.test(errors[i][0] || "")) {
          return errors[i][1] || "Reddit rate limit";
        }
      }
      return null;
    },
    isBlockedResponse: function (jqXHR) {
      var rate = pd.rateLimit,
        contentType,
        body;

      if (!jqXHR || jqXHR.status !== 403) {
        return false;
      }

      contentType = rate.responseHeader(jqXHR, "Content-Type") || "";
      body = jqXHR.responseText || "";
      return (
        /text\/html/i.test(contentType) ||
        /^\s*<!doctype html/i.test(body) ||
        /<html[\s>]/i.test(body)
      );
    },
    messageDelay: function (message) {
      var match = /try again in\s*(\d+)\s*(second|minute|hour)s?/i.exec(
          message || ""
        ),
        units = { second: 1000, minute: 60000, hour: 3600000 };
      if (!match) {
        return 0;
      }
      return parseInt(match[1], 10) * (units[match[2].toLowerCase()] || 0);
    },
    shouldRetry: function (attempt) {
      return pd.rateLimit.maxRetries === 0 ||
        attempt < pd.rateLimit.maxRetries;
    },
    retryDelay: function (jqXHR, attempt, hintMs) {
      var rate = pd.rateLimit,
        retryAfter = rate.responseHeader(jqXHR, "Retry-After"),
        reset = parseFloat(rate.responseHeader(jqXHR, "X-Ratelimit-Reset")),
        wait = 0;

      if (retryAfter) {
        if (/^\s*\d+(?:\.\d+)?\s*$/.test(retryAfter)) {
          wait = parseFloat(retryAfter) * 1000;
        } else {
          var retryDate = Date.parse(retryAfter);
          if (!isNaN(retryDate)) {
            wait = retryDate - Date.now();
          }
        }
      }

      if (!(wait > 0) && hintMs > 0) {
        wait = hintMs;
      }

      if (!(wait > 0) && !isNaN(reset) && reset > 0) {
        wait = reset * 1000;
      }

      if (!(wait > 0)) {
        wait = rate.baseBackoffMs * Math.pow(2, Math.max(0, attempt - 1));
        if (rate.jitterRatio > 0) {
          wait *= 1 + (Math.random() * 2 - 1) * rate.jitterRatio;
        }
      }

      return Math.min(
        rate.maxBackoffMs,
        Math.max(rate.minBackoffMs, wait)
      );
    },
    acquire: function () {
      var rate = pd.rateLimit,
        now = Date.now(),
        startAt = Math.max(now, rate.penaltyUntil, rate.nextSlot),
        wait = startAt - now;

      rate.nextSlot = startAt + rate.intervalMs;
      if (wait <= 0) {
        return Promise.resolve();
      }
      return new Promise(function (resolve) {
        setTimeout(resolve, wait);
      });
    },
    noteSuccess: function (jqXHR) {
      var rate = pd.rateLimit,
        remaining = parseFloat(
          rate.responseHeader(jqXHR, "X-Ratelimit-Remaining")
        ),
        reset = parseFloat(rate.responseHeader(jqXHR, "X-Ratelimit-Reset"));

      rate.consecutiveThrottles = 0;
      rate.successStreak++;
      if (rate.successStreak >= rate.recoverAfter) {
        rate.intervalMs = rate.minIntervalMs;
        rate.successStreak = 0;
      }

      if (!isNaN(remaining) && remaining <= rate.lowRemaining && !isNaN(reset)) {
        if (remaining <= 0) {
          rate.penaltyUntil = Math.max(
            rate.penaltyUntil,
            Date.now() + Math.max(0, reset) * 1000 + 1000
          );
          rate.nextSlot = Math.max(rate.nextSlot, rate.penaltyUntil);
        }
        rate.intervalMs = Math.min(
          rate.maxIntervalMs,
          rate.intervalMs * 2
        );
      }

      if (rate.intervalMs > rate.minIntervalMs) {
        pd.ui.status(
          "Throttling requests to one every " +
            Math.round(rate.intervalMs / 1000) +
            "s after Reddit rate limiting."
        );
      } else {
        pd.ui.status("");
      }
    },
    noteThrottle: function (jqXHR, hintMs) {
      var rate = pd.rateLimit,
        wait;

      rate.consecutiveThrottles++;
      rate.successStreak = 0;
      rate.intervalMs = Math.min(
        rate.maxIntervalMs,
        rate.intervalMs * 2
      );
      wait = rate.retryDelay(jqXHR, rate.consecutiveThrottles, hintMs);
      rate.penaltyUntil = Math.max(rate.penaltyUntil, Date.now() + wait);
      rate.nextSlot = Math.max(rate.nextSlot, rate.penaltyUntil);
      return wait;
    },
    request: function (options) {
      var rate = pd.rateLimit;

      return new Promise(function (resolve, reject) {
        var attempt = 0,
          blockedAttempt = 0;

        function retryAfterThrottle(
          jqXHR,
          hintMs,
          reason,
          attemptNumber,
          maxAttempts
        ) {
          var wait = rate.noteThrottle(jqXHR, hintMs);
          var attempts = maxAttempts === 0 ? "" : "/" + maxAttempts;
          console.warn(
            "PowerDeleteSuite: " +
              reason +
              ", backing off for " +
              Math.round(wait / 1000) +
              "s (retry " +
              attemptNumber +
              attempts +
              ")"
          );
          pd.ui.status(
            reason +
              ". Waiting " +
              Math.max(1, Math.round(wait / 1000)) +
              "s before retrying (attempt " +
              attemptNumber +
              attempts +
              ")."
          );
          send();
        }

        function send() {
          rate.acquire().then(function () {
            $.ajax(options).done(function (data, textStatus, jqXHR) {
              var limitMessage = rate.isRateLimitedResponse(data);
              if (limitMessage) {
                if (rate.shouldRetry(attempt)) {
                  attempt++;
                  retryAfterThrottle(
                    jqXHR,
                    rate.messageDelay(limitMessage),
                    "Rate limited by Reddit (" + limitMessage + ")",
                    attempt,
                    rate.maxRetries
                  );
                } else {
                  reject({
                    jqXHR: jqXHR,
                    textStatus: textStatus,
                    errorThrown: limitMessage,
                    rateLimited: true,
                    blocked: false,
                  });
                }
                return;
              }
              rate.noteSuccess(jqXHR);
              resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
              var blocked = rate.isBlockedResponse(jqXHR);

              if (
                jqXHR &&
                jqXHR.status === 429 &&
                rate.shouldRetry(attempt)
              ) {
                attempt++;
                retryAfterThrottle(
                  jqXHR,
                  0,
                  "Rate limited by Reddit (HTTP 429)",
                  attempt,
                  rate.maxRetries
                );
              } else if (blocked && blockedAttempt < rate.maxBlockedRetries) {
                blockedAttempt++;
                retryAfterThrottle(
                  jqXHR,
                  0,
                  "Reddit blocked the request (HTTP 403)",
                  blockedAttempt,
                  rate.maxBlockedRetries
                );
              } else {
                reject({
                  jqXHR: jqXHR,
                  textStatus: textStatus,
                  errorThrown: errorThrown,
                  rateLimited: !!(jqXHR && jqXHR.status === 429),
                  blocked: blocked,
                });
              }
            });
          }, reject);
        }

        send();
      });
    },
  },
  actions: {
    page: {
      next: function () {
        if (pd.debugging && pd.task.info.donePages % 5 == 3) {
          pd.actions.page.shift();
        }
        if (pd.task.paths.sections.length > 0) {
          pd.ui.updateDisplay();
          pd.actions.page.handle();
        } else {
          pd.ui.done();
        }
      },
      shift: function () {
        if (
          pd.task.paths.sorts[0] === "top" ||
          pd.task.paths.sorts[0] === "controversial"
        ) {
          pd.task.paths.timeframes.splice(0, 1);
          if (pd.task.paths.timeframes.length === 0) {
            pd.setup.resetTimes();
            pd.task.paths.sorts.splice(0, 1);
            if (pd.task.paths.sorts.length === 0) {
              pd.setup.resetSorts();
              pd.task.paths.sections.splice(0, 1);
            }
          }
          return false;
        }

        pd.task.paths.sorts.splice(0, 1);
        if (pd.task.paths.sorts.length === 0) {
          pd.setup.resetSorts();
          pd.task.paths.sections.splice(0, 1);
        }
        return true;
      },
      skipSection: function () {
        pd.setup.resetTimes();
        pd.setup.resetSorts();
        pd.task.paths.sections.splice(0, 1);
      },
      handle: function () {
        pd.task.pageCalls++;
        pd.rateLimit.request({
          url: pd.endpoints[pd.task.paths.sections[0]],
          data: {
            q:
              pd.task.paths.sections[0] == "search"
                ? "author:" +
                  pd.config.user +
                  (!pd.task.config.isRemovingPosts &&
                  !pd.task.config.isExporting
                    ? " self:1"
                    : "")
                : null,
            after: pd.task.after,
            sort: pd.task.paths.sorts[0],
            t: pd.task.paths.timeframes[0],
          },
        }).then(
          function (resp) {
            if (resp.data) {
              var children = resp.data.children;
              pd.task.info.donePages++;
              if (children.length > 0) {
                pd.task.info.doneItems = 0;
                pd.task.info.numItems = children.length;
                pd.task.items = children;
                pd.actions.children.handleGroup();
              } else {
                pd.task.after = "";
                pd.actions.page.shift();
                pd.actions.page.next();
              }
            } else {
              pd.task.info.errors++;
              if (
                confirm(
                  "Reddit seems to be under heavy load. Would you like to continue processing?"
                )
              ) {
                pd.actions.page.shift();
                pd.actions.page.handle();
              } else {
                pd.ui.done();
              }
            }
          },
          function (error) {
            var section = pd.task.paths.sections[0];

            pd.task.info.errors++;
            if (error.blocked) {
              if (
                confirm(
                  "Reddit blocked this " +
                    section +
                    " request with its network-security page (HTTP 403). " +
                    "This is not a rate limit, so retrying may not help.\n\n" +
                    "Log in at https://www.reddit.com, turn off any VPN or proxy, " +
                    "then reload this page and run the suite again.\n\n" +
                    "Would you like to retry? Choose Cancel to skip the rest of " +
                    section +
                    "."
                )
              ) {
                pd.actions.page.handle();
              } else {
                pd.actions.page.skipSection();
                pd.actions.page.next();
              }
              return;
            }
            if (
              confirm(
                "Error getting " +
                  section +
                  " page" +
                  pd.helpers.ajaxErrorMessage(
                    error.jqXHR,
                    error.textStatus,
                    error.errorThrown
                  ) +
                  ". Would you like to retry?"
              )
            ) {
              pd.actions.page.handle();
            } else {
              pd.actions.page.shift();
              pd.actions.page.next();
            }
          }
        );
      },
    },
    children: {
      handleGroup: function () {
        pd.ui.updateDisplay();
        if (pd.task.items.length > 0) {
          pd.actions.children.handleSingle();
        } else {
          pd.actions.page.next();
        }
      },
      handleSingle: function () {
        pd.ui.updateDisplay();
        var item = pd.task.items[0],
          shouldBeActedOn = pd.helpers.shouldBeActedOn(item),
          earlyExitNewItems =
            pd.task.paths.sorts[0] == "new" &&
            pd.filters.date.gt === true &&
            pd.task.items[0].pdIgnoreReasons &&
            !pd.task.items[0].pdIgnoreReasons.date;

        if (earlyExitNewItems) {
          console.log("Skipping the rest of the things sorted by new");
          pd.task.items[0].pdIgnored = true;
          pd.actions.children.finishItem();
          pd.actions.page.shift();
          pd.actions.page.next();
        } else if (shouldBeActedOn) {
          var currentText = pd.helpers.currentText(item);
          if (
            !item.pdEdited &&
            (item.data.is_self || item.kind == "t1") &&
            pd.task.config.isEditing &&
            !pd.task.editedIds[item.data.id]
          ) {
            var targetText = pd.helpers.editTextFor(item);
            if (
              pd.helpers.isGoneText(currentText) ||
              (currentText !== null &&
                currentText.trim() === targetText.trim())
            ) {
              pd.task.editedIds[item.data.id] = true;
              pd.actions.children.handleSingle();
            } else {
              pd.actions.edit(item);
            }
          } else if (
            !item.pdDeleted &&
            ((item.kind == "t3" && pd.task.config.isRemovingPosts) ||
              (item.kind == "t1" && pd.task.config.isRemovingComments))
          ) {
            pd.actions.delete(item);
          } else {
            pd.actions.children.finishItem();
            pd.actions.children.handleGroup();
          }
        } else {
          pd.task.items[0].pdIgnored = true;
          pd.actions.children.finishItem();
          pd.actions.children.handleGroup();
        }
      },
      finishItem: function () {
        pd.task.after = pd.task.items[0].pdDeleted
          ? pd.task.after
          : pd.task.items[0].data.name;
        pd.task.info.doneItems++;
        pd.task.info.deleted += pd.task.items[0].pdDeleted ? 1 : 0;
        pd.task.info.edited += pd.task.items[0].pdEdited ? 1 : 0;
        pd.task.info.ignored += pd.task.items[0].pdIgnored ? 1 : 0;
        if (
          pd.task.config.isExporting &&
          (pd.task.items[0].pdEdited || pd.task.items[0].pdDeleted)
        ) {
          pd.actions.children.exportItem(pd.task.items[0]);
        }
        pd.task.items.splice(0, 1);
      },
      exportItem: function (item) {
        var str = "";
        if (pd.exportItems.length == 0) {
          str += pd.helpers.csvCell("Title");
          str += pd.helpers.csvCell("Body");
          str += pd.helpers.csvCell("Permalink");
          str += pd.helpers.csvCell("Score");
          str += pd.helpers.csvCell("Timestamp UTC");
          str += pd.helpers.csvCell("Actions");
          pd.exportItems.push(str);
        }

        if (pd.exportIds.indexOf(item.data.id) == -1) {
          str = "";
          str += pd.helpers.csvCell(
            pd.helpers.csvEscape(item.data.title ? item.data.title : "")
          );
          str += pd.helpers.csvCell(
            pd.helpers.csvEscape(
              item.data.body
                ? item.data.body
                : item.data.selftext
                ? item.data.selftext
                : ""
            )
          );
          str += pd.helpers.csvCell(
            item.data.permalink
              ? "https://reddit.com" + item.data.permalink
              : "https://reddit.com/r/" +
                  item.data.subreddit +
                  "/comments/" +
                  item.data.link_id.replace(/^t\d_/, "") +
                  "/x/" +
                  item.data.id +
                  "?context=3"
          );
          str += pd.helpers.csvCell(item.data.score);
          str += pd.helpers.csvCell(item.data.created_utc);
          str += pd.helpers.csvCell(
            (item.pdEdited ? "edited " : "") +
              (item.pdDeleted ? "deleted " : "")
          );
          pd.exportItems.push(str);
          pd.exportIds.push(item.data.id);
          pd.task.info.exported++;
        }
      },
    },
    delete: function (item) {
      setTimeout(() => {
        if (pd.performActions) {
          pd.rateLimit.request({
            url: "/api/del",
            method: "post",
            headers: pd.helpers.apiHeaders(),
            data: {
              id: item.data.name,
              executed: "deleted",
              uh: pd.config.uh,
              renderstyle: "html",
            },
          }).then(
            function () {
              pd.task.items[0].pdDeleted = true;
              pd.actions.children.handleSingle();
            },
            function (error) {
              pd.task.info.errors++;
              if (
                confirm(
                  "Error deleting " +
                    (item.kind == "t3" ? "post" : "comment") +
                    pd.helpers.ajaxErrorMessage(
                      error.jqXHR,
                      error.textStatus,
                      error.errorThrown
                    ) +
                    "\n\nWould you like to retry?"
                )
              ) {
                pd.actions.children.handleSingle();
              } else {
                pd.actions.children.finishItem();
                pd.actions.children.handleGroup();
              }
            }
          );
        } else {
          pd.task.items[0].pdDeleted = true;
          pd.task.after = pd.task.items[0].data.name;
          pd.actions.children.handleSingle();
        }
      }, 20000);
    },
    edit: function (item) {
      setTimeout(() => {
        if (pd.performActions) {
          var editString = pd.helpers.editTextFor(item);
          pd.rateLimit.request({
            url: "/api/editusertext",
            method: "post",
            headers: pd.helpers.apiHeaders(),
            data: {
              api_type: "json",
              thing_id: item.data.name,
              text: editString,
              id: "#form-" + item.data.name,
              r: item.data.subreddit,
              uh: pd.config.uh,
              renderstyle: "html",
            },
          }).then(
            function () {
              pd.task.editedIds[item.data.id] = true;
              pd.task.items[0].pdEdited = true;
              pd.actions.children.handleSingle();
            },
            function (error) {
              pd.task.info.errors++;
              if (
                !confirm(
                  "Error editing " +
                    (item.kind == "t3" ? "post" : "comment") +
                    pd.helpers.ajaxErrorMessage(
                      error.jqXHR,
                      error.textStatus,
                      error.errorThrown
                    ) +
                    "\n\nWould you like to retry?"
                )
              ) {
                item.pdEdited = true;
              }
              pd.actions.children.handleSingle();
            }
          );
        } else {
          pd.task.editedIds[item.data.id] = true;
          pd.task.items[0].pdEdited = true;
          pd.actions.children.handleSingle();
        }
      }, 20000);
    },
  },
  ui: {
    status: function (message) {
      var status = $("#pd__status");
      if (status.length === 0) {
        status = $("<div id='pd__status' />").css({
          margin: "0.5em 0",
          color: "#a00",
        });
        $("#pd__central .processing").append(status);
      }
      status.text(message || "").toggle(!!message);
    },
    updateDisplay: function () {
      $("#pd__central h2")
        .first()
        .html(
          "Power Delete Suite v" +
            pd.version +
            " <br/>" +
            "<small>" +
            pd.task.paths.sections[0] +
            "/" +
            pd.task.paths.sorts[0] +
            "/" +
            pd.task.paths.timeframes[0] +
            "</small>"
        );
      pd.task.info.numPages =
        pd.task.info.donePages +
        (pd.task.paths.sections.length - 1) * 4 +
        pd.task.paths.sorts.length;
      $("#progress_page .bar").css(
        "width",
        Math.round((1000 * pd.task.info.donePages) / pd.task.info.numPages) /
          10 +
          "%"
      );
      $("#progress_page .text")
        .attr("data-top", pd.task.info.donePages)
        .attr("data-bottom", pd.task.info.numPages);
      if (pd.task.info.numItems > 0) {
        $("#progress_item .bar").css(
          "width",
          Math.round((1000 * pd.task.info.doneItems) / pd.task.info.numItems) /
            10 +
            "%"
        );
        $("#progress_item .text")
          .attr("data-top", pd.task.info.doneItems)
          .attr("data-bottom", pd.task.info.numItems);
      }

      $(".progress__byline .edited")
        .addClass(pd.task.info.edited > 0 ? "visible" : "")
        .find(".num")
        .attr("data-num", pd.task.info.edited);
      $(".progress__byline .deleted")
        .addClass(pd.task.info.deleted > 0 ? "visible" : "")
        .find(".num")
        .attr("data-num", pd.task.info.deleted);
      $(".progress__byline .errors")
        .addClass(pd.task.info.errors > 0 ? "visible" : "")
        .find(".num")
        .attr("data-num", pd.task.info.errors);
      $(".progress__byline .exported")
        .addClass(pd.task.info.exported > 0 ? "visible" : "")
        .find(".num")
        .attr("data-num", pd.task.info.exported);
      $(".progress__byline .ignored")
        .addClass(pd.task.info.ignored > 0 ? "visible" : "")
        .find(".num")
        .attr("data-num", pd.task.info.ignored);
      for (var key in pd.task.info.ignoreReasons) {
        if (!!pd.task.info.ignoreReasons[key]) {
          if ($(".progress__byline .ignored .reasons ." + key).length == 0) {
            $(".progress__byline .ignored .reasons").prepend(
              '<div class="' + key + '">' + key + ": </div>"
            );
          }
          $(".progress__byline .ignored .reasons ." + key).attr(
            "data-num",
            pd.task.info.ignoreReasons[key]
          );
        }
      }

      $("#progress__item-output").attr(
        "class",
        pd.task.info.ignored > 0 &&
          (pd.task.info.deleted > 0 || pd.task.info.edited > 0)
          ? "twocol"
          : "onecol"
      );

      pd.task.info.ajaxCalls =
        pd.task.info.errors +
        pd.task.info.edited +
        pd.task.info.deleted +
        pd.task.info.donePages;
      document.title = pd.config.user + " | " + pd.task.info.ajaxCalls;
    },
    done: function () {
      pd.ui.status("");
      pd.ui.updateDisplay();
      window.pd_processing = false;
      document.title =
        $("#header-bottom-right .user a").first().text() +
        " | Power Delete Suite";
      $("#pd__central h2")
        .first()
        .text("Power Delete Suite v" + pd.version);

      if (
        pd.task.info.edited + pd.task.info.deleted > 0 ||
        pd.task.config.isExporting
      ) {
        $("#pd__central .complete .summary").html(
          "<p>Completed after making " +
            pd.task.info.ajaxCalls +
            ' calls to the reddit servers.</p> <p>If you need to re run the script, <a class="restart">click here to go back to the beginning!</a></p>'
        );
      } else {
        $("#pd__central .complete .summary").html(
          "<p>All Done! It seems like all " +
            pd.task.info.ignored +
            ' items we came across were ignored.</p> <p>If you need to re run the script, <a class="restart">click here to go back to the beginning!</a></p>'
        );
      }
      $("#pd__central .complete .summary .restart").click(function () {
        pd.init();
      });

      $("#pd__sub-list input").prop("checked", false);

      $("#pd__central .complete .goodbye").html(
        '<hr/><h3 class="submit-bug">' +
          "<div>Having trouble?</div>" +
          '<div><a href="https://github.com/JustinHoMi/PowerDeleteSuite-updated/issues" target="_blank">Report the problem on the canonical repository issue tracker.</a></div>' +
          "<div><small>Do not include passwords, modhashes, or private content in public reports.</small></div>" +
          "</h3>"
      );

      if (pd.task.config.isExporting && pd.exportItems.length > 0) {
        $("#pd__central .complete .goodbye").prepend(
          '<hr/><a class="export-button" href=\'data:text/csv;charset=utf-8,' +
            pd.exportItems.join("%0A") +
            '\' download="PowerDeleteSuiteExport.csv">Download Exported Items</a>'
        );
      }

      $("#pd__central .processing, #pd__form").hide();
      $("#pd__central .complete").show();
    },
  },
  error: function () {
    var reset = confirm(
      "We ran into an error. Please report it on the canonical repository issue tracker.\r\n\r\nWould you like to restart the script?"
    );
    window.pd_processing = false;
    if (reset) {
      pd.init();
    }
    return true;
  },
  performActions: true,
  debugging: false,
};
// BEGIN GENERATED ASSETS (scripts/build.js)
pd.stylesheet = "/* CSS FOR USERSCRIPT */\n\n#pd__central {\n    background: #fff;\n    border: 1px solid #ddd;\n    border-radius: 1em;\n    line-height: 2em;\n    margin: 20px;\n    margin-right: 320px;\n    padding: 20px;\n}\n\n.goodbye::after,\n.goodbye2::after,\n#pd__central::after {\n    content: \"\";\n    clear: left;\n    display: block;\n}\n\n.goodbye2 {\n    display: none;\n}\n\n.complete[style*=\"block\"] .goodbye2 {\n    display: block;\n}\n\n.submit-bug {\n    float: left;\n    width: 50%;\n    padding: 20px;\n    box-sizing: border-box;\n}\n\n.faq {\n    float: left;\n    width: 50%;\n}\n\n.faq blockquote {\n    border-left: 3px solid #09f;\n    padding-left: 1.2em;\n    margin: .5em 0;\n}\n.faq p {\n    line-height: 1.1em;\n    text-indent: 1.5em;\n}\n\n.xt {\n    display: none;\n}\n.xt:checked~.xtr-section {\n    display: block;\n}\n.xt~label::after {\n    color: #09f;\n    content: \"+\";\n    font-weight: bold;\n    margin-left: .2em;\n}\n.xt:checked~label::after {\n    content: \"-\";\n}\n.xt.xtr {\n    display: inline-block;\n}\n.ind {\n    margin-left: 1em !important;\n}\n#pd__central input[type=\"checkbox\"] {\n    margin-right: .5em;\n    position: relative;\n    top: 3px;\n}\nb.m {\n    color: #590;\n    margin-right: .4em;\n}\n#pd__central a {\n    cursor: pointer;\n}\n.xtr-section {\n    background: #eee;\n    display: none;\n    max-height: 20em;\n    overflow-y: auto;\n    padding: .5em 1em;\n}\n#pd__central textarea {\n    min-height: 3em;\n    min-width: 200px;\n    width: 50%;\n}\n#pd__central .label {\n    display: block;\n    text-align: center;\n}\n#pd__central .progress {\n    border: 1px solid #ccc;\n    border-radius: 0.5em;\n    height: 2em;\n    margin-bottom: 1em;\n    position: relative;\n}\n#pd__central .bar,\n#pd__central .text {\n    display: block;\n    height: 100%;\n    left: 0;\n    position: absolute;\n    top: 0;\n}\n#pd__central .bar {\n    background: #def;\n    z-index: 0;\n}\n#pd__central .text {\n    text-align: center;\n    width: 100%;\n    z-index: 1;\n}\n\n#pd__central .text::before {\n    content: attr(data-top)\"/\"attr(data-bottom);\n}\n\n.processing {\n    display: none;\n}\n\n.xtr-section a {\n    text-decoration: underline;\n}\n\n.xtr-section a.disabled, \n.xtr-section a.loading {\n    color: #999;\n}\n\n.gt-toggle+label {\n    cursor: pointer;\n    border-bottom: 1px dashed #333;\n}\n\n.gt-toggle+label::before {\n    content:\"Less than\";\n}\n.gt-toggle.greater+label::before {\n    content:\"Greater than\";\n}\n\n#pd__date-selector .gt-toggle+label::before {\n    content:\"Older than\";\n}\n#pd__date-selector .gt-toggle.greater+label::before {\n    content:\"Newer than\";\n}\n\n\n.hidden {\n    display: none;\n}\n\n/* Subreddit Style */\n\n.linkflairlabel {\n    max-width: none !important;\n}\n.titlebox a {\n  color: ##64b2ff;\n  text-decoration: underline;\n}\n.side {\n  position: relative;\n  padding-left: 20px;\n  z-index: 15;\n}\n\n.listing-page .stickied+.clearleft+.linkflair-old,\n.listing-page .stickied+.linkflair-old {\n  margin-top: 80px;\n  position: relative;\n  overflow: visible !important;\n}\n\n\n.listing-page .stickied+.clearleft+.linkflair-old::before,\n.listing-page .stickied+.linkflair-old::before {\n  content: \"Old Versions\";\n  display: block;\n  position: absolute;\n  top: -2em;\n  left: 0;\n  font-weight: bold;\n  font-size: 14px;\n  border-bottom: 1px solid;\n  width: 100%;\n}\n\n.debugging {\n    display: none;\n}\n\n.progress__byline {\n    display: table;\n    border-collapse: collapse;\n    width: 100%;\n    margin-top: 2em;\n}\n\n.progress__byline .row {\n    display: table-row;\n    width: 100%;\n}\n\n.progress__byline .row .type {\n    display: none;\n    border-top: 1px solid #ccc;\n    text-align: center;\n    font-size: 10px;\n}\n\n.progress__byline .row .type.visible {\n    display: table-cell;\n}\n\n.progress__byline .row .type .num::before {\n    content: attr(data-num);\n}\n\n.progress__byline .num {\n    display: block;\n    font-weight: bold;\n    font-size: 1.2em;\n}\n\n.progress__byline .ignored .reasons {\n    margin: 0;\n    padding: 0;\n    line-height: 1em;\n    color: #999;\n}\n.progress__byline .ignored .reasons *::after {\n    content: attr(data-num);\n}\n\n#progress__item-output.onecol>div {\n    width: 100%;\n}\n\n#progress__item-output.twocol>div {\n    float: left;\n    width: 50%;\n}\n\n#progress__item-output::after {\n    content: \"\";\n    display: block;\n    clear: both;\n}\n\n#progress__item-output a {\n    display: block;\n}\n\n#pd__central hr {\n    margin: 2em 0 1em;\n}\n\n.export-button {\n    display: block;\n    width: 250px;\n    text-align: center;\n    background: #09f;\n    color: #fff;\n    font-size: 14px;\n    padding: 5px;\n    margin: 0 auto;\n    border-radius: 4px;\n    font-weight: bold;\n}";
pd.centralForm = "<h2>Power Delete Suite</h2>\n<form id=\"pd__form\">\n  <p>\n    Please review all options before pressing \"Process\". This process is <b>NOT</b> reversible.\n  </p>\n  <hr/>\n  \n  <h3>Actions to perform</h3>\n  <div><input checked type=\"checkbox\" id=\"pd__export\" name=\"pd__export\"><label for=\"pd__export\">Prepare local backup of items</label></div>\n  <div><input checked type=\"checkbox\" id=\"pd__submissions\" name=\"pd__submissions\"><label for=\"pd__submissions\">Remove submissions</label></div>\n  <div><input checked type=\"checkbox\" id=\"pd__comments\" name=\"pd__comments\"><label for=\"pd__comments\">Remove comments</label></div>\n  <div data-help=\"If editing is enabled at the same time as deleting, the item will be edited BEFORE deleting it.\">\n    <input class=\"xt xtr\" type=\"checkbox\" id=\"pd__comments-edit\" name=\"pd__comments-edit\"><label for=\"pd__comments-edit\">Edit comments / self posts</label><a class=\"pd__q\">?</a>\n    <div id=\"edit-form\" class=\"xt xtr-section\">\n      <textarea placeholder=\"Enter text to edit comments or self posts to.\" id=\"pd__comments-edit-text\" name=\"pd__comments-edit-text\"></textarea>\n    </div>\n  </div>\n  <hr/>\n\n  <h3>Filters</h3>\n  <div>\n    <input class=\"xt xtr\" type=\"checkbox\" id=\"pd__subreddits\" name=\"pd__subreddits\"><label for=\"pd__subreddits\">Filter by subreddits</label>\n    <div id=\"pd__sub-list\" class=\"xt xtr-section\">\n      <b>Perform actions on any subreddit that is checked:</b>\n    </div>\n  </div>\n  <div>\n    <input class=\"xt xtr\" type=\"checkbox\" id=\"pd__score\" name=\"pd__score\"><label for=\"pd__score\">Filter by score</label>\n    <div id=\"pd__score-selector\" class=\"xtr-section\">\n      <div><b>Perform actions on items with a score:</b></div>\n      <input class=\"gt-toggle hidden greater\" id=\"pd__score-dirtoggle\" name=\"pd__score-dirtoggle\" type=\"checkbox\" checked /><label for=\"pd__score-dirtoggle\" title=\"toggle\"></label> <input id=\"pd__score-num\" type=\"tel\" placeholder=\"200\" name=\"pd__score-num\" class=\"num-only\"/>\n    </div>\n  </div>\n  <div>\n    <input class=\"xt xtr\" type=\"checkbox\" id=\"pd__date\" name=\"pd__date\"><label for=\"pd__date\">Filter by date</label>\n    <div id=\"pd__date-selector\" class=\"xtr-section\">\n      <div><b>Perform actions on items with a date time:</b></div>\n      <input class=\"gt-toggle hidden greater\" id=\"pd__date-dirtoggle\" name=\"pd__date-dirtoggle\" type=\"checkbox\" checked /><label for=\"pd__date-dirtoggle\" title=\"toggle\"></label> <input id=\"pd__date-num\" type=\"tel\" placeholder=\"60\" value=\"60\" name=\"pd__date-num\" class=\"num-only\"/> <span>minutes ago</span>\n       <div>Set to: <a class=\"pd__insert\" data-target=\"#pd__date-num\" data-value=\"60\">1 hour</a>\n       <a class=\"pd__insert\" data-target=\"#pd__date-num\" data-value=\"1440\">1 day</a>\n       <a class=\"pd__insert\" data-target=\"#pd__date-num\" data-value=\"10080\">1 week</a>\n       <a class=\"pd__insert\" data-target=\"#pd__date-num\" data-value=\"43200\">30 days</a>\n       <a class=\"pd__insert\" data-target=\"#pd__date-num\" data-value=\"262800\">half year</a>\n       <a class=\"pd__insert\" data-target=\"#pd__date-num\" data-value=\"525600\">year</a></div>\n    </div>\n  </div>\n  <div><input checked type=\"checkbox\" id=\"pd__gilded\" name=\"pd__gilded\"><label for=\"pd__gilded\">Do not perform actions on gilded</label></div>\n  <div><input checked type=\"checkbox\" id=\"pd__saved\" name=\"pd__saved\"><label for=\"pd__saved\">Do not perform actions on saved</label></div>\n  <div><input checked type=\"checkbox\" id=\"pd__mod\" name=\"pd__mod\"><label for=\"pd__mod\">Do not perform actions on mod distinguished</label></div>\n  <hr/>\n  <div>\n    <button>Process</button><input checked type=\"checkbox\" id=\"pd__remember\" name=\"pd__remember\" class=\"ind\"><label for=\"pd__remember\" data-help=\"This will store data on your local computer. It will NOT transmit any of this data.\">Remember Settings<a class=\"pd__q\">?</a></label>\n  </div>\n</form>\n\n\n<div class=\"processing\">\n  <span class=\"label\">Page Progress</span>\n  <div id=\"progress_page\" class=\"progress\">\n    <span class=\"bar\"></span>\n    <span class=\"text\" data-top=\"\" data-bottom=\"\"></span>\n  </div>\n  <span class=\"label\">Page Item Progress</span>\n  <div id=\"progress_item\" class=\"progress\">\n    <span class=\"bar\"></span>\n    <span class=\"text\" data-top=\"\" data-bottom=\"\"></span>\n  </div>\n  <div class=\"progress__byline\"><div class=\"row\">\n     <span class=\"type errors\"><span class=\"num\" data-num=\"\"></span> errors</span>\n     <span class=\"type exported\"><span class=\"num\" data-num=\"\"></span> exported</span>\n     <span class=\"type edited\"><span class=\"num\" data-num=\"\"></span> edited</span>\n     <span class=\"type deleted\"><span class=\"num\" data-num=\"\"></span> deleted</span>\n     <span class=\"type ignored\"><span class=\"num\" data-num=\"\"></span> ignored<span class=\"reasons\"></span></span>\n  </div></div>\n</div>\n\n\n<div class=\"complete\">\n  <div class=\"summary\"></div>\n  <div class=\"progress__byline\"><div class=\"row\">\n     <span class=\"type errors\"><span class=\"num\" data-num=\"\"></span> errors</span>\n     <span class=\"type exported\"><span class=\"num\" data-num=\"\"></span> exported</span>\n     <span class=\"type edited\"><span class=\"num\" data-num=\"\"></span> edited</span>\n     <span class=\"type deleted\"><span class=\"num\" data-num=\"\"></span> deleted</span>\n     <span class=\"type ignored\"><span class=\"num\" data-num=\"\"></span> ignored<span class=\"reasons\"></span></span>\n  </div></div>\n  <div class=\"goodbye\"></div>\n</div>";
// END GENERATED ASSETS
pd.init();
