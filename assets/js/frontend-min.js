!(function (a) {
  "function" == typeof define && define.amd
    ? define(["jquery"], a)
    : a(
        "object" == typeof exports
          ? require("jquery")
          : window.jQuery || window.Zepto
      );
})(function ($) {
  var d,
    e,
    f,
    g,
    h,
    i,
    j = "Close",
    k = "MarkupParse",
    l = "Open",
    m = ".mfp",
    n = "mfp-ready",
    o = "mfp-removing",
    a = function () {},
    p = !!window.jQuery,
    q = $(window),
    r = function (a, b) {
      d.ev.on("mfp" + a + m, b);
    },
    s = function (d, b, c, e) {
      var a = document.createElement("div");
      return (
        (a.className = "mfp-" + d),
        c && (a.innerHTML = c),
        e ? b && b.appendChild(a) : ((a = $(a)), b && a.appendTo(b)),
        a
      );
    },
    t = function (a, b) {
      d.ev.triggerHandler("mfp" + a, b),
        d.st.callbacks &&
          ((a = a.charAt(0).toLowerCase() + a.slice(1)),
          d.st.callbacks[a] &&
            d.st.callbacks[a].apply(d, $.isArray(b) ? b : [b]));
    },
    u = function (a) {
      return (
        (a === i && d.currTemplate.closeBtn) ||
          ((d.currTemplate.closeBtn = $(
            d.st.closeMarkup.replace("%title%", d.st.tClose)
          )),
          (i = a)),
        d.currTemplate.closeBtn
      );
    },
    b = function () {
      $.magnificPopup.instance ||
        ((d = new a()).init(), ($.magnificPopup.instance = d));
    },
    v = function () {
      var a = document.createElement("p").style,
        b = ["ms", "O", "Moz", "Webkit"];
      if (void 0 !== a.transition) return !0;
      for (; b.length; ) if (b.pop() + "Transition" in a) return !0;
      return !1;
    };
  (a.prototype = {
    constructor: a,
    init: function () {
      var a = navigator.appVersion;
      (d.isLowIE = d.isIE8 = document.all && !document.addEventListener),
        (d.isAndroid = /android/gi.test(a)),
        (d.isIOS = /iphone|ipad|ipod/gi.test(a)),
        (d.supportsTransition = v()),
        (d.probablyMobile =
          d.isAndroid ||
          d.isIOS ||
          /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(
            navigator.userAgent
          )),
        (f = $(document)),
        (d.popupsCache = {});
    },
    open: function (a) {
      if (!1 === a.isObj) {
        (d.items = a.items.toArray()), (d.index = 0);
        var b,
          c,
          j = a.items;
        for (b = 0; b < j.length; b++)
          if (((c = j[b]).parsed && (c = c.el[0]), c === a.el[0])) {
            d.index = b;
            break;
          }
      } else
        (d.items = $.isArray(a.items) ? a.items : [a.items]),
          (d.index = a.index || 0);
      if (d.isOpen) {
        d.updateItemHTML();
        return;
      }
      (d.types = []),
        (h = ""),
        a.mainEl && a.mainEl.length ? (d.ev = a.mainEl.eq(0)) : (d.ev = f),
        a.key
          ? (d.popupsCache[a.key] || (d.popupsCache[a.key] = {}),
            (d.currTemplate = d.popupsCache[a.key]))
          : (d.currTemplate = {}),
        (d.st = $.extend(!0, {}, $.magnificPopup.defaults, a)),
        (d.fixedContentPos =
          "auto" === d.st.fixedContentPos
            ? !d.probablyMobile
            : d.st.fixedContentPos),
        d.st.modal &&
          ((d.st.closeOnContentClick = !1),
          (d.st.closeOnBgClick = !1),
          (d.st.showCloseBtn = !1),
          (d.st.enableEscapeKey = !1)),
        d.bgOverlay ||
          ((d.bgOverlay = s("bg").on("click" + m, function () {
            d.close();
          })),
          (d.wrap = s("wrap")
            .attr("tabindex", -1)
            .on("click" + m, function (a) {
              d._checkIfClose(a.target) && d.close();
            })),
          (d.container = s("container", d.wrap))),
        (d.contentContainer = s("content")),
        d.st.preloader &&
          (d.preloader = s("preloader", d.container, d.st.tLoading));
      var o = $.magnificPopup.modules;
      for (b = 0; b < o.length; b++) {
        var e = o[b];
        d["init" + (e = e.charAt(0).toUpperCase() + e.slice(1))].call(d);
      }
      t("BeforeOpen"),
        d.st.showCloseBtn &&
          (d.st.closeBtnInside
            ? (r(k, function (c, d, a, b) {
                a.close_replaceWith = u(b.type);
              }),
              (h += " mfp-close-btn-in"))
            : d.wrap.append(u())),
        d.st.alignTop && (h += " mfp-align-top"),
        d.fixedContentPos
          ? d.wrap.css({
              overflow: d.st.overflowY,
              overflowX: "hidden",
              overflowY: d.st.overflowY,
            })
          : d.wrap.css({ top: q.scrollTop(), position: "absolute" }),
        (!1 !== d.st.fixedBgPos &&
          ("auto" !== d.st.fixedBgPos || d.fixedContentPos)) ||
          d.bgOverlay.css({ height: f.height(), position: "absolute" }),
        d.st.enableEscapeKey &&
          f.on("keyup" + m, function (a) {
            27 === a.keyCode && d.close();
          }),
        q.on("resize" + m, function () {
          d.updateSize();
        }),
        d.st.closeOnContentClick || (h += " mfp-auto-cursor"),
        h && d.wrap.addClass(h);
      var p = (d.wH = q.height()),
        g = {};
      if (d.fixedContentPos && d._hasScrollBar(p)) {
        var v = d._getScrollbarSize();
        v && (g.marginRight = v);
      }
      d.fixedContentPos &&
        (d.isIE7
          ? $("body, html").css("overflow", "hidden")
          : (g.overflow = "hidden"));
      var i = d.st.mainClass;
      return (
        d.isIE7 && (i += " mfp-ie7"),
        i && d._addClassToMFP(i),
        d.updateItemHTML(),
        t("BuildControls"),
        $("html").css(g),
        d.bgOverlay.add(d.wrap).prependTo(d.st.prependTo || $(document.body)),
        (d._lastFocusedEl = document.activeElement),
        setTimeout(function () {
          d.content
            ? (d._addClassToMFP(n), d._setFocus())
            : d.bgOverlay.addClass(n),
            f.on("focusin" + m, d._onFocusIn);
        }, 16),
        (d.isOpen = !0),
        d.updateSize(p),
        t(l),
        a
      );
    },
    close: function () {
      d.isOpen &&
        (t("BeforeClose"),
        (d.isOpen = !1),
        d.st.removalDelay && !d.isLowIE && d.supportsTransition
          ? (d._addClassToMFP(o),
            setTimeout(function () {
              d._close();
            }, d.st.removalDelay))
          : d._close());
    },
    _close: function () {
      t(j);
      var a = o + " " + n + " ";
      if (
        (d.bgOverlay.detach(),
        d.wrap.detach(),
        d.container.empty(),
        d.st.mainClass && (a += d.st.mainClass + " "),
        d._removeClassFromMFP(a),
        d.fixedContentPos)
      ) {
        var b = { marginRight: "" };
        d.isIE7 ? $("body, html").css("overflow", "") : (b.overflow = ""),
          $("html").css(b);
      }
      f.off("keyup" + m + " focusin" + m),
        d.ev.off(m),
        d.wrap.attr("class", "mfp-wrap").removeAttr("style"),
        d.bgOverlay.attr("class", "mfp-bg"),
        d.container.attr("class", "mfp-container"),
        d.st.showCloseBtn &&
          (!d.st.closeBtnInside || !0 === d.currTemplate[d.currItem.type]) &&
          d.currTemplate.closeBtn &&
          d.currTemplate.closeBtn.detach(),
        d.st.autoFocusLast && d._lastFocusedEl && $(d._lastFocusedEl).focus(),
        (d.currItem = null),
        (d.content = null),
        (d.currTemplate = null),
        (d.prevHeight = 0),
        t("AfterClose");
    },
    updateSize: function (b) {
      if (d.isIOS) {
        var c = document.documentElement.clientWidth / window.innerWidth,
          a = window.innerHeight * c;
        d.wrap.css("height", a), (d.wH = a);
      } else d.wH = b || q.height();
      d.fixedContentPos || d.wrap.css("height", d.wH), t("Resize");
    },
    updateItemHTML: function () {
      var b = d.items[d.index];
      d.contentContainer.detach(),
        d.content && d.content.detach(),
        b.parsed || (b = d.parseEl(d.index));
      var a = b.type;
      if (
        (t("BeforeChange", [d.currItem ? d.currItem.type : "", a]),
        (d.currItem = b),
        !d.currTemplate[a])
      ) {
        var c = !!d.st[a] && d.st[a].markup;
        t("FirstMarkupParse", c),
          c ? (d.currTemplate[a] = $(c)) : (d.currTemplate[a] = !0);
      }
      g && g !== b.type && d.container.removeClass("mfp-" + g + "-holder");
      var e = d["get" + a.charAt(0).toUpperCase() + a.slice(1)](
        b,
        d.currTemplate[a]
      );
      d.appendContent(e, a),
        (b.preloaded = !0),
        t("Change", b),
        (g = b.type),
        d.container.prepend(d.contentContainer),
        t("AfterChange");
    },
    appendContent: function (a, b) {
      (d.content = a),
        a
          ? d.st.showCloseBtn && d.st.closeBtnInside && !0 === d.currTemplate[b]
            ? d.content.find(".mfp-close").length || d.content.append(u())
            : (d.content = a)
          : (d.content = ""),
        t("BeforeAppend"),
        d.container.addClass("mfp-" + b + "-holder"),
        d.contentContainer.append(d.content);
    },
    parseEl: function (b) {
      var e,
        a = d.items[b];
      if (
        (a.tagName
          ? (a = { el: $(a) })
          : ((e = a.type), (a = { data: a, src: a.src })),
        a.el)
      ) {
        for (var f = d.types, c = 0; c < f.length; c++)
          if (a.el.hasClass("mfp-" + f[c])) {
            e = f[c];
            break;
          }
        (a.src = a.el.attr("data-mfp-src")),
          a.src || (a.src = a.el.attr("href"));
      }
      return (
        (a.type = e || d.st.type || "inline"),
        (a.index = b),
        (a.parsed = !0),
        (d.items[b] = a),
        t("ElementParse", a),
        d.items[b]
      );
    },
    addGroup: function (c, a) {
      var e = function (b) {
        (b.mfpEl = this), d._openClick(b, c, a);
      };
      a || (a = {});
      var b = "click.magnificPopup";
      (a.mainEl = c),
        a.items
          ? ((a.isObj = !0), c.off(b).on(b, e))
          : ((a.isObj = !1),
            a.delegate
              ? c.off(b).on(b, a.delegate, e)
              : ((a.items = c), c.off(b).on(b, e)));
    },
    _openClick: function (a, e, b) {
      if (
        (void 0 !== b.midClick
          ? b.midClick
          : $.magnificPopup.defaults.midClick) ||
        (2 !== a.which && !a.ctrlKey && !a.metaKey && !a.altKey && !a.shiftKey)
      ) {
        var c =
          void 0 !== b.disableOn
            ? b.disableOn
            : $.magnificPopup.defaults.disableOn;
        if (c) {
          if ($.isFunction(c)) {
            if (!c.call(d)) return !0;
          } else if (q.width() < c) return !0;
        }
        a.type && (a.preventDefault(), d.isOpen && a.stopPropagation()),
          (b.el = $(a.mfpEl)),
          b.delegate && (b.items = e.find(b.delegate)),
          d.open(b);
      }
    },
    updateStatus: function (a, b) {
      if (d.preloader) {
        e !== a && d.container.removeClass("mfp-s-" + e),
          b || "loading" !== a || (b = d.st.tLoading);
        var c = { status: a, text: b };
        t("UpdateStatus", c),
          (a = c.status),
          (b = c.text),
          d.preloader.html(b),
          d.preloader.find("a").on("click", function (a) {
            a.stopImmediatePropagation();
          }),
          d.container.addClass("mfp-s-" + a),
          (e = a);
      }
    },
    _checkIfClose: function (a) {
      if (!$(a).hasClass("mfp-prevent-close")) {
        var b = d.st.closeOnContentClick,
          c = d.st.closeOnBgClick;
        if (
          (b && c) ||
          !d.content ||
          $(a).hasClass("mfp-close") ||
          (d.preloader && a === d.preloader[0])
        )
          return !0;
        if (a === d.content[0] || $.contains(d.content[0], a)) {
          if (b) return !0;
        } else if (c && $.contains(document, a)) return !0;
        return !1;
      }
    },
    _addClassToMFP: function (a) {
      d.bgOverlay.addClass(a), d.wrap.addClass(a);
    },
    _removeClassFromMFP: function (a) {
      this.bgOverlay.removeClass(a), d.wrap.removeClass(a);
    },
    _hasScrollBar: function (a) {
      return (
        (d.isIE7 ? f.height() : document.body.scrollHeight) > (a || q.height())
      );
    },
    _setFocus: function () {
      (d.st.focus ? d.content.find(d.st.focus).eq(0) : d.wrap).focus();
    },
    _onFocusIn: function (a) {
      if (a.target !== d.wrap[0] && !$.contains(d.wrap[0], a.target))
        return d._setFocus(), !1;
    },
    _parseMarkup: function (c, a, b) {
      var d;
      b.data && (a = $.extend(b.data, a)),
        t(k, [c, a, b]),
        $.each(a, function (e, a) {
          if (void 0 === a || !1 === a) return !0;
          if ((d = e.split("_")).length > 1) {
            var b = c.find(m + "-" + d[0]);
            if (b.length > 0) {
              var f = d[1];
              "replaceWith" === f
                ? b[0] !== a[0] && b.replaceWith(a)
                : "img" === f
                ? b.is("img")
                  ? b.attr("src", a)
                  : b.replaceWith(
                      $("<img>").attr("src", a).attr("class", b.attr("class"))
                    )
                : b.attr(d[1], a);
            }
          } else c.find(m + "-" + e).html(a);
        });
    },
    _getScrollbarSize: function () {
      if (void 0 === d.scrollbarSize) {
        var a = document.createElement("div");
        (a.style.cssText =
          "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;"),
          document.body.appendChild(a),
          (d.scrollbarSize = a.offsetWidth - a.clientWidth),
          document.body.removeChild(a);
      }
      return d.scrollbarSize;
    },
  }),
    ($.magnificPopup = {
      instance: null,
      proto: a.prototype,
      modules: [],
      open: function (a, c) {
        return (
          b(),
          ((a = a ? $.extend(!0, {}, a) : {}).isObj = !0),
          (a.index = c || 0),
          this.instance.open(a)
        );
      },
      close: function () {
        return $.magnificPopup.instance && $.magnificPopup.instance.close();
      },
      registerModule: function (b, a) {
        a.options && ($.magnificPopup.defaults[b] = a.options),
          $.extend(this.proto, a.proto),
          this.modules.push(b);
      },
      defaults: {
        disableOn: 0,
        key: null,
        midClick: !1,
        mainClass: "",
        preloader: !0,
        focus: "",
        closeOnContentClick: !1,
        closeOnBgClick: !0,
        closeBtnInside: !0,
        showCloseBtn: !0,
        enableEscapeKey: !0,
        modal: !1,
        alignTop: !1,
        removalDelay: 0,
        prependTo: null,
        fixedContentPos: "auto",
        fixedBgPos: "auto",
        overflowY: "auto",
        closeMarkup:
          '<button title="%title%" type="button" class="mfp-close">&#215;</button>',
        tClose: "Close (Esc)",
        tLoading: "Loading...",
        autoFocusLast: !0,
      },
    }),
    ($.fn.magnificPopup = function (a) {
      b();
      var c = $(this);
      if ("string" == typeof a) {
        if ("open" === a) {
          var e,
            f = p ? c.data("magnificPopup") : c[0].magnificPopup,
            g = parseInt(arguments[1], 10) || 0;
          f.items
            ? (e = f.items[g])
            : ((e = c), f.delegate && (e = e.find(f.delegate)), (e = e.eq(g))),
            d._openClick({ mfpEl: e }, c, f);
        } else
          d.isOpen && d[a].apply(d, Array.prototype.slice.call(arguments, 1));
      } else
        (a = $.extend(!0, {}, a)),
          p ? c.data("magnificPopup", a) : (c[0].magnificPopup = a),
          d.addGroup(c, a);
      return c;
    });
  var w,
    x,
    y,
    c = "inline",
    z = function () {
      y && (x.after(y.addClass(w)).detach(), (y = null));
    };
  $.magnificPopup.registerModule(c, {
    options: {
      hiddenClass: "hide",
      markup: "",
      tNotFound: "Content not found",
    },
    proto: {
      initInline: function () {
        d.types.push(c),
          r(j + "." + c, function () {
            z();
          });
      },
      getInline: function (b, c) {
        if ((z(), b.src)) {
          var e = d.st.inline,
            a = $(b.src);
          if (a.length) {
            var f = a[0].parentNode;
            f &&
              f.tagName &&
              (x || ((x = s((w = e.hiddenClass))), (w = "mfp-" + w)),
              (y = a.after(x).detach().removeClass(w))),
              d.updateStatus("ready");
          } else d.updateStatus("error", e.tNotFound), (a = $("<div>"));
          return (b.inlineElement = a), a;
        }
        return d.updateStatus("ready"), d._parseMarkup(c, {}, b), c;
      },
    },
  });
  var A,
    B = function (a) {
      if (a.data && void 0 !== a.data.title) return a.data.title;
      var b = d.st.image.titleSrc;
      if (b) {
        if ($.isFunction(b)) return b.call(d, a);
        if (a.el) return a.el.attr(b) || "";
      }
      return "";
    };
  $.magnificPopup.registerModule("image", {
    options: {
      markup:
        '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
      cursor: "mfp-zoom-out-cur",
      titleSrc: "title",
      verticalFit: !0,
      tError: '<a href="%url%">The image</a> could not be loaded.',
    },
    proto: {
      initImage: function () {
        var b = d.st.image,
          a = ".image";
        d.types.push("image"),
          r(l + a, function () {
            "image" === d.currItem.type &&
              b.cursor &&
              $(document.body).addClass(b.cursor);
          }),
          r(j + a, function () {
            b.cursor && $(document.body).removeClass(b.cursor),
              q.off("resize" + m);
          }),
          r("Resize" + a, d.resizeImage),
          d.isLowIE && r("AfterChange", d.resizeImage);
      },
      resizeImage: function () {
        var a = d.currItem;
        if (a && a.img && d.st.image.verticalFit) {
          var b = 0;
          d.isLowIE &&
            (b =
              parseInt(a.img.css("padding-top"), 10) +
              parseInt(a.img.css("padding-bottom"), 10)),
            a.img.css("max-height", d.wH - b);
        }
      },
      _onImageHasSize: function (a) {
        a.img &&
          ((a.hasSize = !0),
          A && clearInterval(A),
          (a.isCheckingImgSize = !1),
          t("ImageHasSize", a),
          a.imgHidden &&
            (d.content && d.content.removeClass("mfp-loading"),
            (a.imgHidden = !1)));
      },
      findImageSize: function (a) {
        var c = 0,
          e = a.img[0],
          b = function (f) {
            A && clearInterval(A),
              (A = setInterval(function () {
                if (e.naturalWidth > 0) {
                  d._onImageHasSize(a);
                  return;
                }
                c > 200 && clearInterval(A),
                  3 == ++c ? b(10) : 40 === c ? b(50) : 100 === c && b(500);
              }, f));
          };
        b(1);
      },
      getImage: function (a, b) {
        var i = 0,
          f = function () {
            a &&
              (a.img[0].complete
                ? (a.img.off(".mfploader"),
                  a === d.currItem &&
                    (d._onImageHasSize(a), d.updateStatus("ready")),
                  (a.hasSize = !0),
                  (a.loaded = !0),
                  t("ImageLoadComplete"))
                : ++i < 200
                ? setTimeout(f, 100)
                : g());
          },
          g = function () {
            a &&
              (a.img.off(".mfploader"),
              a === d.currItem &&
                (d._onImageHasSize(a),
                d.updateStatus("error", h.tError.replace("%url%", a.src))),
              (a.hasSize = !0),
              (a.loaded = !0),
              (a.loadError = !0));
          },
          h = d.st.image,
          e = b.find(".mfp-img");
        if (e.length) {
          var c = document.createElement("img");
          (c.className = "mfp-img"),
            a.el &&
              a.el.find("img").length &&
              (c.alt = a.el.find("img").attr("alt")),
            (a.img = $(c).on("load.mfploader", f).on("error.mfploader", g)),
            (c.src = a.src),
            e.is("img") && (a.img = a.img.clone()),
            (c = a.img[0]).naturalWidth > 0
              ? (a.hasSize = !0)
              : c.width || (a.hasSize = !1);
        }
        return (d._parseMarkup(b, { title: B(a), img_replaceWith: a.img }, a),
        d.resizeImage(),
        a.hasSize)
          ? (A && clearInterval(A),
            a.loadError
              ? (b.addClass("mfp-loading"),
                d.updateStatus("error", h.tError.replace("%url%", a.src)))
              : (b.removeClass("mfp-loading"), d.updateStatus("ready")),
            b)
          : (d.updateStatus("loading"),
            (a.loading = !0),
            a.hasSize ||
              ((a.imgHidden = !0),
              b.addClass("mfp-loading"),
              d.findImageSize(a)),
            b);
      },
    },
  }),
    b();
}),
  (function (a) {
    "function" == typeof define && define.amd
      ? define(["jquery"], a)
      : "object" == typeof module && module.exports
      ? (module.exports = function (c, b) {
          return (
            void 0 === b &&
              (b =
                "undefined" != typeof window
                  ? require("jquery")
                  : require("jquery")(c)),
            a(b),
            b
          );
        })
      : a(jQuery);
  })(function (b) {
    var a = (function () {
        if (b && b.fn && b.fn.select2 && b.fn.select2.amd)
          var a = b.fn.select2.amd;
        return (
          (function () {
            if (!a || !a.requirejs) {
              var c, b, d;
              a ? (b = a) : (a = {}),
                (function (i) {
                  var e,
                    a,
                    f,
                    g,
                    h = {},
                    j = {},
                    k = {},
                    l = {},
                    m = Object.prototype.hasOwnProperty,
                    n = [].slice,
                    o = /\.js$/;
                  function p(a, b) {
                    return m.call(a, b);
                  }
                  function q(a, p) {
                    var e,
                      f,
                      g,
                      d,
                      h,
                      n,
                      i,
                      q,
                      b,
                      j,
                      r,
                      c = p && p.split("/"),
                      l = k.map,
                      m = (l && l["*"]) || {};
                    if (a) {
                      for (
                        h = (a = a.split("/")).length - 1,
                          k.nodeIdCompat &&
                            o.test(a[h]) &&
                            (a[h] = a[h].replace(o, "")),
                          "." === a[0].charAt(0) &&
                            c &&
                            (a = c.slice(0, c.length - 1).concat(a)),
                          b = 0;
                        b < a.length;
                        b++
                      )
                        if ("." === (r = a[b])) a.splice(b, 1), (b -= 1);
                        else if (".." === r) {
                          if (
                            0 === b ||
                            (1 === b && ".." === a[2]) ||
                            ".." === a[b - 1]
                          )
                            continue;
                          b > 0 && (a.splice(b - 1, 2), (b -= 2));
                        }
                      a = a.join("/");
                    }
                    if ((c || m) && l) {
                      for (b = (e = a.split("/")).length; b > 0; b -= 1) {
                        if (((f = e.slice(0, b).join("/")), c)) {
                          for (j = c.length; j > 0; j -= 1)
                            if (
                              (g = l[c.slice(0, j).join("/")]) &&
                              (g = g[f])
                            ) {
                              (d = g), (n = b);
                              break;
                            }
                        }
                        if (d) break;
                        !i && m && m[f] && ((i = m[f]), (q = b));
                      }
                      !d && i && ((d = i), (n = q)),
                        d && (e.splice(0, n, d), (a = e.join("/")));
                    }
                    return a;
                  }
                  function r(b, c) {
                    return function () {
                      var d = n.call(arguments, 0);
                      return (
                        "string" != typeof d[0] &&
                          1 === d.length &&
                          d.push(null),
                        a.apply(i, d.concat([b, c]))
                      );
                    };
                  }
                  function s(a) {
                    return function (b) {
                      h[a] = b;
                    };
                  }
                  function t(a) {
                    if (p(j, a)) {
                      var b = j[a];
                      delete j[a], (l[a] = !0), e.apply(i, b);
                    }
                    if (!p(h, a) && !p(l, a)) throw new Error("No " + a);
                    return h[a];
                  }
                  function u(a) {
                    var c,
                      b = a ? a.indexOf("!") : -1;
                    return (
                      b > -1 &&
                        ((c = a.substring(0, b)),
                        (a = a.substring(b + 1, a.length))),
                      [c, a]
                    );
                  }
                  function v(a) {
                    return a ? u(a) : [];
                  }
                  (f = function (a, f) {
                    var g,
                      c,
                      d = u(a),
                      b = d[0],
                      e = f[1];
                    return (
                      ((a = d[1]), b && (c = t((b = q(b, e)))), b)
                        ? (a =
                            c && c.normalize
                              ? c.normalize(
                                  a,
                                  ((g = e),
                                  function (a) {
                                    return q(a, g);
                                  })
                                )
                              : q(a, e))
                        : ((a = q(a, e)),
                          (b = (d = u(a))[0]),
                          (a = d[1]),
                          b && (c = t(b))),
                      { f: b ? b + "!" + a : a, n: a, pr: b, p: c }
                    );
                  }),
                    (g = {
                      require: function (a) {
                        return r(a);
                      },
                      exports: function (a) {
                        var b = h[a];
                        return void 0 !== b ? b : (h[a] = {});
                      },
                      module: function (a) {
                        var b;
                        return {
                          id: a,
                          uri: "",
                          exports: h[a],
                          config:
                            ((b = a),
                            function () {
                              return (k && k.config && k.config[b]) || {};
                            }),
                        };
                      },
                    }),
                    (e = function (a, e, k, o) {
                      var m,
                        b,
                        q,
                        n,
                        c,
                        u,
                        w,
                        d = [],
                        x = typeof k;
                      if (
                        ((u = v((o = o || a))),
                        "undefined" === x || "function" === x)
                      ) {
                        for (
                          c = 0,
                            e =
                              !e.length && k.length
                                ? ["require", "exports", "module"]
                                : e;
                          c < e.length;
                          c += 1
                        )
                          if ("require" === (b = (n = f(e[c], u)).f))
                            d[c] = g.require(a);
                          else if ("exports" === b)
                            (d[c] = g.exports(a)), (w = !0);
                          else if ("module" === b) m = d[c] = g.module(a);
                          else if (p(h, b) || p(j, b) || p(l, b)) d[c] = t(b);
                          else if (n.p)
                            n.p.load(n.n, r(o, !0), s(b), {}), (d[c] = h[b]);
                          else throw new Error(a + " missing " + b);
                        (q = k ? k.apply(h[a], d) : void 0),
                          a &&
                            (m && m.exports !== i && m.exports !== h[a]
                              ? (h[a] = m.exports)
                              : (q === i && w) || (h[a] = q));
                      } else a && (h[a] = k);
                    }),
                    (c =
                      b =
                      a =
                        function (b, c, d, h, j) {
                          if ("string" == typeof b)
                            return g[b] ? g[b](c) : t(f(b, v(c)).f);
                          if (!b.splice) {
                            if (((k = b).deps && a(k.deps, k.callback), !c))
                              return;
                            c.splice ? ((b = c), (c = d), (d = null)) : (b = i);
                          }
                          return (
                            (c = c || function () {}),
                            "function" == typeof d && ((d = h), (h = j)),
                            h
                              ? e(i, b, c, d)
                              : setTimeout(function () {
                                  e(i, b, c, d);
                                }, 4),
                            a
                          );
                        }),
                    (a.config = function (b) {
                      return a(b);
                    }),
                    (c._defined = h),
                    (d = function (a, b, c) {
                      if ("string" != typeof a)
                        throw new Error(
                          "See almond README: incorrect module build, no module name"
                        );
                      b.splice || ((c = b), (b = [])),
                        p(h, a) || p(j, a) || (j[a] = [a, b, c]);
                    }),
                    (d.amd = { jQuery: !0 });
                })(),
                (a.requirejs = c),
                (a.require = b),
                (a.define = d);
            }
          })(),
          a.define("almond", function () {}),
          a.define("jquery", [], function () {
            var a = b || $;
            return (
              null == a &&
                console &&
                console.error &&
                console.error(
                  "Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."
                ),
              a
            );
          }),
          a.define("select2/utils", ["jquery"], function ($) {
            var a = {};
            function c(d) {
              var b = d.prototype,
                c = [];
              for (var a in b)
                "function" == typeof b[a] && "constructor" !== a && c.push(a);
              return c;
            }
            (a.Extend = function (b, a) {
              var e = {}.hasOwnProperty;
              function d() {
                this.constructor = b;
              }
              for (var c in a) e.call(a, c) && (b[c] = a[c]);
              return (
                (d.prototype = a.prototype),
                (b.prototype = new d()),
                (b.__super__ = a.prototype),
                b
              );
            }),
              (a.Decorate = function (b, f) {
                var g = c(f),
                  h = c(b);
                function a() {
                  var c = Array.prototype.unshift,
                    d = f.prototype.constructor.length,
                    a = b.prototype.constructor;
                  d > 0 &&
                    (c.call(arguments, b.prototype.constructor),
                    (a = f.prototype.constructor)),
                    a.apply(this, arguments);
                }
                (f.displayName = b.displayName),
                  (a.prototype = new (function () {
                    this.constructor = a;
                  })());
                for (var d = 0; d < h.length; d++) {
                  var i = h[d];
                  a.prototype[i] = b.prototype[i];
                }
                for (var e = 0; e < g.length; e++) {
                  var j = g[e];
                  a.prototype[j] = (function (b) {
                    var c = function () {};
                    b in a.prototype && (c = a.prototype[b]);
                    var d = f.prototype[b];
                    return function () {
                      return (
                        Array.prototype.unshift.call(arguments, c),
                        d.apply(this, arguments)
                      );
                    };
                  })(j);
                }
                return a;
              });
            var b = function () {
              this.listeners = {};
            };
            return (
              (b.prototype.on = function (a, b) {
                (this.listeners = this.listeners || {}),
                  a in this.listeners
                    ? this.listeners[a].push(b)
                    : (this.listeners[a] = [b]);
              }),
              (b.prototype.trigger = function (b) {
                var c = Array.prototype.slice,
                  a = c.call(arguments, 1);
                (this.listeners = this.listeners || {}),
                  null == a && (a = []),
                  0 === a.length && a.push({}),
                  (a[0]._type = b),
                  b in this.listeners &&
                    this.invoke(this.listeners[b], c.call(arguments, 1)),
                  "*" in this.listeners &&
                    this.invoke(this.listeners["*"], arguments);
              }),
              (b.prototype.invoke = function (b, c) {
                for (var a = 0, d = b.length; a < d; a++) b[a].apply(this, c);
              }),
              (a.Observable = b),
              (a.generateChars = function (c) {
                for (var a = "", b = 0; b < c; b++)
                  a += Math.floor(36 * Math.random()).toString(36);
                return a;
              }),
              (a.bind = function (a, b) {
                return function () {
                  a.apply(b, arguments);
                };
              }),
              (a._convertData = function (b) {
                for (var f in b) {
                  var d = f.split("-"),
                    c = b;
                  if (1 !== d.length) {
                    for (var e = 0; e < d.length; e++) {
                      var a = d[e];
                      (a = a.substring(0, 1).toLowerCase() + a.substring(1)) in
                        c || (c[a] = {}),
                        e == d.length - 1 && (c[a] = b[f]),
                        (c = c[a]);
                    }
                    delete b[f];
                  }
                }
                return b;
              }),
              (a.hasScroll = function (e, a) {
                var c = $(a),
                  d = a.style.overflowX,
                  b = a.style.overflowY;
                return (
                  (d !== b || ("hidden" !== b && "visible" !== b)) &&
                  ("scroll" === d ||
                    "scroll" === b ||
                    c.innerHeight() < a.scrollHeight ||
                    c.innerWidth() < a.scrollWidth)
                );
              }),
              (a.escapeMarkup = function (a) {
                var b = {
                  "\\": "&#92;",
                  "&": "&amp;",
                  "<": "&lt;",
                  ">": "&gt;",
                  '"': "&quot;",
                  "'": "&#39;",
                  "/": "&#47;",
                };
                return "string" != typeof a
                  ? a
                  : String(a).replace(/[&<>"'\/\\]/g, function (a) {
                      return b[a];
                    });
              }),
              (a.entityDecode = function (b) {
                var a = document.createElement("textarea");
                return (a.innerHTML = b), a.value;
              }),
              (a.appendMany = function (b, a) {
                if ("1.7" === $.fn.jquery.substr(0, 3)) {
                  var c = $();
                  $.map(a, function (a) {
                    c = c.add(a);
                  }),
                    (a = c);
                }
                b.append(a);
              }),
              (a.isTouchscreen = function () {
                return (
                  void 0 === a._isTouchscreenCache &&
                    (a._isTouchscreenCache =
                      "ontouchstart" in document.documentElement),
                  a._isTouchscreenCache
                );
              }),
              a
            );
          }),
          a.define("select2/results", ["jquery", "./utils"], function ($, b) {
            function a(b, c, d) {
              (this.$element = b),
                (this.data = d),
                (this.options = c),
                a.__super__.constructor.call(this);
            }
            return (
              b.Extend(a, b.Observable),
              (a.prototype.render = function () {
                var a = $(
                  '<ul class="select2-results__options" role="listbox" tabindex="-1"></ul>'
                );
                return (
                  this.options.get("multiple") &&
                    a.attr("aria-multiselectable", "true"),
                  (this.$results = a),
                  a
                );
              }),
              (a.prototype.clear = function () {
                this.$results.empty();
              }),
              (a.prototype.displayMessage = function (b) {
                var c = this.options.get("escapeMarkup");
                this.clear(), this.hideLoading();
                var a = $(
                    '<li role="alert" aria-live="assertive" class="select2-results__option"></li>'
                  ),
                  d = this.options.get("translations").get(b.message);
                a.append(c(d(b.args))),
                  (a[0].className += " select2-results__message"),
                  this.$results.append(a);
              }),
              (a.prototype.hideMessages = function () {
                this.$results.find(".select2-results__message").remove();
              }),
              (a.prototype.append = function (a) {
                this.hideLoading();
                var c = [];
                if (null == a.results || 0 === a.results.length) {
                  0 === this.$results.children().length &&
                    this.trigger("results:message", { message: "noResults" });
                  return;
                }
                a.results = this.sort(a.results);
                for (var b = 0; b < a.results.length; b++) {
                  var d = a.results[b],
                    e = this.option(d);
                  c.push(e);
                }
                this.$results.append(c);
              }),
              (a.prototype.position = function (a, b) {
                b.find(".select2-results").append(a);
              }),
              (a.prototype.sort = function (a) {
                return this.options.get("sorter")(a);
              }),
              (a.prototype.highlightFirstItem = function () {
                var a = this.$results.find(
                    ".select2-results__option[data-selected]"
                  ),
                  b = a.filter("[data-selected=true]");
                b.length > 0
                  ? b.first().trigger("mouseenter")
                  : a.first().trigger("mouseenter"),
                  this.ensureHighlightVisible();
              }),
              (a.prototype.setClasses = function () {
                var a = this;
                this.data.current(function (b) {
                  var c = $.map(b, function (a) {
                    return a.id.toString();
                  });
                  a.$results
                    .find(".select2-results__option[data-selected]")
                    .each(function () {
                      var b = $(this),
                        a = $.data(this, "data"),
                        d = "" + a.id;
                      (null != a.element && a.element.selected) ||
                      (null == a.element && $.inArray(d, c) > -1)
                        ? b.attr("data-selected", "true")
                        : b.attr("data-selected", "false");
                    });
                });
              }),
              (a.prototype.showLoading = function (b) {
                this.hideLoading();
                var c = {
                    disabled: !0,
                    loading: !0,
                    text: this.options.get("translations").get("searching")(b),
                  },
                  a = this.option(c);
                (a.className += " loading-results"), this.$results.prepend(a);
              }),
              (a.prototype.hideLoading = function () {
                this.$results.find(".loading-results").remove();
              }),
              (a.prototype.option = function (a) {
                var b = document.createElement("li");
                b.className = "select2-results__option";
                var c = {
                  role: "option",
                  "data-selected": "false",
                  tabindex: -1,
                };
                for (var g in (a.disabled &&
                  (delete c["data-selected"], (c["aria-disabled"] = "true")),
                null == a.id && delete c["data-selected"],
                null != a._resultId && (b.id = a._resultId),
                a.title && (b.title = a.title),
                a.children &&
                  ((c["aria-label"] = a.text), delete c["data-selected"]),
                c)) {
                  var j = c[g];
                  b.setAttribute(g, j);
                }
                if (a.children) {
                  var e = $(b),
                    d = document.createElement("strong");
                  d.className = "select2-results__group";
                  var k = $(d);
                  this.template(a, d), k.attr("role", "presentation");
                  for (var h = [], f = 0; f < a.children.length; f++) {
                    var l = a.children[f],
                      m = this.option(l);
                    h.push(m);
                  }
                  var i = $("<ul></ul>", {
                    class:
                      "select2-results__options select2-results__options--nested",
                    role: "listbox",
                  });
                  i.append(h), e.attr("role", "list"), e.append(d), e.append(i);
                } else this.template(a, b);
                return $.data(b, "data", a), b;
              }),
              (a.prototype.bind = function (a, c) {
                var d = this,
                  b = a.id + "-results";
                this.$results.attr("id", b),
                  a.on("results:all", function (b) {
                    d.clear(),
                      d.append(b.data),
                      a.isOpen() && (d.setClasses(), d.highlightFirstItem());
                  }),
                  a.on("results:append", function (b) {
                    d.append(b.data), a.isOpen() && d.setClasses();
                  }),
                  a.on("query", function (a) {
                    d.hideMessages(), d.showLoading(a);
                  }),
                  a.on("select", function () {
                    a.isOpen() && (d.setClasses(), d.highlightFirstItem());
                  }),
                  a.on("unselect", function () {
                    a.isOpen() && (d.setClasses(), d.highlightFirstItem());
                  }),
                  a.on("open", function () {
                    d.$results.attr("aria-expanded", "true"),
                      d.$results.attr("aria-hidden", "false"),
                      d.setClasses(),
                      d.ensureHighlightVisible();
                  }),
                  a.on("close", function () {
                    d.$results.attr("aria-expanded", "false"),
                      d.$results.attr("aria-hidden", "true"),
                      d.$results.removeAttr("aria-activedescendant");
                  }),
                  a.on("results:toggle", function () {
                    var a = d.getHighlightedResults();
                    0 !== a.length && a.trigger("mouseup");
                  }),
                  a.on("results:select", function () {
                    var a = d.getHighlightedResults();
                    if (0 !== a.length) {
                      var b = a.data("data");
                      "true" == a.attr("data-selected")
                        ? d.trigger("close", {})
                        : d.trigger("select", { data: b });
                    }
                  }),
                  a.on("results:previous", function () {
                    var b = d.getHighlightedResults(),
                      c = d.$results.find("[data-selected]"),
                      e = c.index(b);
                    if (0 !== e) {
                      var a = e - 1;
                      0 === b.length && (a = 0);
                      var f = c.eq(a);
                      f.trigger("mouseenter");
                      var g = d.$results.offset().top,
                        h = f.offset().top,
                        i = d.$results.scrollTop() + (h - g);
                      0 === a
                        ? d.$results.scrollTop(0)
                        : h - g < 0 && d.$results.scrollTop(i);
                    }
                  }),
                  a.on("results:next", function () {
                    var g = d.getHighlightedResults(),
                      a = d.$results.find("[data-selected]"),
                      h = a.index(g),
                      b = h + 1;
                    if (!(b >= a.length)) {
                      var c = a.eq(b);
                      c.trigger("mouseenter");
                      var e =
                          d.$results.offset().top + d.$results.outerHeight(!1),
                        f = c.offset().top + c.outerHeight(!1),
                        i = d.$results.scrollTop() + f - e;
                      0 === b
                        ? d.$results.scrollTop(0)
                        : f > e && d.$results.scrollTop(i);
                    }
                  }),
                  a.on("results:focus", function (a) {
                    a.element
                      .addClass("select2-results__option--highlighted")
                      .attr("aria-selected", "true"),
                      d.$results.attr(
                        "aria-activedescendant",
                        a.element.attr("id")
                      );
                  }),
                  a.on("results:message", function (a) {
                    d.displayMessage(a);
                  }),
                  $.fn.mousewheel &&
                    this.$results.on("mousewheel", function (a) {
                      var b = d.$results.scrollTop(),
                        c = d.$results.get(0).scrollHeight - b + a.deltaY,
                        e = a.deltaY > 0 && b - a.deltaY <= 0,
                        f = a.deltaY < 0 && c <= d.$results.height();
                      e
                        ? (d.$results.scrollTop(0),
                          a.preventDefault(),
                          a.stopPropagation())
                        : f &&
                          (d.$results.scrollTop(
                            d.$results.get(0).scrollHeight - d.$results.height()
                          ),
                          a.preventDefault(),
                          a.stopPropagation());
                    }),
                  this.$results.on(
                    "mouseup",
                    ".select2-results__option[data-selected]",
                    function (a) {
                      var b = $(this),
                        c = b.data("data");
                      if ("true" === b.attr("data-selected")) {
                        d.options.get("multiple")
                          ? d.trigger("unselect", { originalEvent: a, data: c })
                          : d.trigger("close", {});
                        return;
                      }
                      d.trigger("select", { originalEvent: a, data: c });
                    }
                  ),
                  this.$results.on(
                    "mouseenter",
                    ".select2-results__option[data-selected]",
                    function (b) {
                      var a = $(this).data("data");
                      d
                        .getHighlightedResults()
                        .removeClass("select2-results__option--highlighted")
                        .attr("aria-selected", "false"),
                        d.trigger("results:focus", {
                          data: a,
                          element: $(this),
                        });
                    }
                  );
              }),
              (a.prototype.getHighlightedResults = function () {
                return this.$results.find(
                  ".select2-results__option--highlighted"
                );
              }),
              (a.prototype.destroy = function () {
                this.$results.remove();
              }),
              (a.prototype.ensureHighlightVisible = function () {
                var a = this.getHighlightedResults();
                if (0 !== a.length) {
                  var f = this.$results.find("[data-selected]").index(a),
                    b = this.$results.offset().top,
                    c = a.offset().top,
                    d = this.$results.scrollTop() + (c - b),
                    e = c - b;
                  (d -= 2 * a.outerHeight(!1)),
                    f <= 2
                      ? this.$results.scrollTop(0)
                      : (e > this.$results.outerHeight() || e < 0) &&
                        this.$results.scrollTop(d);
                }
              }),
              (a.prototype.template = function (c, a) {
                var d = this.options.get("templateResult"),
                  e = this.options.get("escapeMarkup"),
                  b = d(c, a);
                null == b
                  ? (a.style.display = "none")
                  : "string" == typeof b
                  ? (a.innerHTML = e(b))
                  : $(a).append(b);
              }),
              a
            );
          }),
          a.define("select2/keys", [], function () {
            return {
              BACKSPACE: 8,
              TAB: 9,
              ENTER: 13,
              SHIFT: 16,
              CTRL: 17,
              ALT: 18,
              ESC: 27,
              SPACE: 32,
              PAGE_UP: 33,
              PAGE_DOWN: 34,
              END: 35,
              HOME: 36,
              LEFT: 37,
              UP: 38,
              RIGHT: 39,
              DOWN: 40,
              DELETE: 46,
            };
          }),
          a.define(
            "select2/selection/base",
            ["jquery", "../utils", "../keys"],
            function ($, b, c) {
              function a(b, c) {
                (this.$element = b),
                  (this.options = c),
                  a.__super__.constructor.call(this);
              }
              return (
                b.Extend(a, b.Observable),
                (a.prototype.render = function () {
                  var a = $(
                    '<span class="select2-selection"  aria-haspopup="true" aria-expanded="false"></span>'
                  );
                  return (
                    (this._tabindex = 0),
                    null != this.$element.data("old-tabindex")
                      ? (this._tabindex = this.$element.data("old-tabindex"))
                      : null != this.$element.attr("tabindex") &&
                        (this._tabindex = this.$element.attr("tabindex")),
                    a.attr("title", this.$element.attr("title")),
                    a.attr("tabindex", this._tabindex),
                    (this.$selection = a),
                    a
                  );
                }),
                (a.prototype.bind = function (a, b) {
                  var d = this;
                  a.id;
                  var e = a.id + "-results";
                  this.options.get("minimumResultsForSearch"),
                    (this.container = a),
                    this.$selection.on("focus", function (a) {
                      d.trigger("focus", a);
                    }),
                    this.$selection.on("blur", function (a) {
                      d._handleBlur(a);
                    }),
                    this.$selection.on("keydown", function (a) {
                      d.trigger("keypress", a),
                        a.which === c.SPACE && a.preventDefault();
                    }),
                    a.on("results:focus", function (a) {
                      d.$selection.attr(
                        "aria-activedescendant",
                        a.data._resultId
                      );
                    }),
                    a.on("selection:update", function (a) {
                      d.update(a.data);
                    }),
                    a.on("open", function () {
                      d.$selection.attr("aria-expanded", "true"),
                        d.$selection.attr("aria-owns", e),
                        d._attachCloseHandler(a);
                    }),
                    a.on("close", function () {
                      d.$selection.attr("aria-expanded", "false"),
                        d.$selection.removeAttr("aria-activedescendant"),
                        d.$selection.removeAttr("aria-owns"),
                        window.setTimeout(function () {
                          d.$selection.focus();
                        }, 1),
                        d._detachCloseHandler(a);
                    }),
                    a.on("enable", function () {
                      d.$selection.attr("tabindex", d._tabindex);
                    }),
                    a.on("disable", function () {
                      d.$selection.attr("tabindex", "-1");
                    });
                }),
                (a.prototype._handleBlur = function (a) {
                  var b = this;
                  window.setTimeout(function () {
                    document.activeElement == b.$selection[0] ||
                      $.contains(b.$selection[0], document.activeElement) ||
                      b.trigger("blur", a);
                  }, 1);
                }),
                (a.prototype._attachCloseHandler = function (a) {
                  $(document.body).on(
                    "mousedown.select2." + a.id,
                    function (a) {
                      var b = $(a.target),
                        c = b.closest(".select2");
                      $(".select2.select2-container--open").each(function () {
                        var a = $(this);
                        this != c[0] &&
                          (a.data("element").select2("close"),
                          setTimeout(function () {
                            a.find("*:focus").blur(), b.focus();
                          }, 1));
                      });
                    }
                  );
                }),
                (a.prototype._detachCloseHandler = function (a) {
                  $(document.body).off("mousedown.select2." + a.id);
                }),
                (a.prototype.position = function (a, b) {
                  b.find(".selection").append(a);
                }),
                (a.prototype.destroy = function () {
                  this._detachCloseHandler(this.container);
                }),
                (a.prototype.update = function (a) {
                  throw new Error(
                    "The `update` method must be defined in child classes."
                  );
                }),
                a
              );
            }
          ),
          a.define(
            "select2/selection/single",
            ["jquery", "./base", "../utils", "../keys"],
            function ($, b, c, d) {
              function a() {
                a.__super__.constructor.apply(this, arguments);
              }
              return (
                c.Extend(a, b),
                (a.prototype.render = function () {
                  var b = a.__super__.render.call(this);
                  return (
                    b.addClass("select2-selection--single"),
                    b.html(
                      '<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'
                    ),
                    b
                  );
                }),
                (a.prototype.bind = function (b, d) {
                  var e = this;
                  a.__super__.bind.apply(this, arguments);
                  var c = b.id + "-container";
                  this.$selection
                    .find(".select2-selection__rendered")
                    .attr("id", c)
                    .attr("role", "textbox")
                    .attr("aria-readonly", "true"),
                    this.$selection.attr("aria-labelledby", c),
                    this.$selection.attr("role", "combobox"),
                    this.$selection.on("mousedown", function (a) {
                      1 === a.which &&
                        e.trigger("toggle", { originalEvent: a });
                    }),
                    this.$selection.on("focus", function (a) {}),
                    this.$selection.on("keydown", function (a) {
                      !b.isOpen() && a.which >= 48 && a.which <= 90 && b.open();
                    }),
                    this.$selection.on("blur", function (a) {}),
                    b.on("focus", function (a) {
                      b.isOpen() || e.$selection.focus();
                    }),
                    b.on("selection:update", function (a) {
                      e.update(a.data);
                    });
                }),
                (a.prototype.clear = function () {
                  this.$selection.find(".select2-selection__rendered").empty();
                }),
                (a.prototype.display = function (a, b) {
                  var c = this.options.get("templateSelection");
                  return this.options.get("escapeMarkup")(c(a, b));
                }),
                (a.prototype.selectionContainer = function () {
                  return $("<span></span>");
                }),
                (a.prototype.update = function (d) {
                  if (0 === d.length) {
                    this.clear();
                    return;
                  }
                  var a = d[0],
                    b = this.$selection.find(".select2-selection__rendered"),
                    e = c.entityDecode(this.display(a, b));
                  b.empty().text(e), b.prop("title", a.title || a.text);
                }),
                a
              );
            }
          ),
          a.define(
            "select2/selection/multiple",
            ["jquery", "./base", "../utils"],
            function ($, b, c) {
              function a(b, c) {
                a.__super__.constructor.apply(this, arguments);
              }
              return (
                c.Extend(a, b),
                (a.prototype.render = function () {
                  var b = a.__super__.render.call(this);
                  return (
                    b.addClass("select2-selection--multiple"),
                    b.html(
                      '<ul class="select2-selection__rendered" aria-live="polite" aria-relevant="additions removals" aria-atomic="true"></ul>'
                    ),
                    b
                  );
                }),
                (a.prototype.bind = function (b, c) {
                  var d = this;
                  a.__super__.bind.apply(this, arguments),
                    this.$selection.on("click", function (a) {
                      d.trigger("toggle", { originalEvent: a });
                    }),
                    this.$selection.on(
                      "click",
                      ".select2-selection__choice__remove",
                      function (a) {
                        if (!d.options.get("disabled")) {
                          var b = $(this).parent().data("data");
                          d.trigger("unselect", { originalEvent: a, data: b });
                        }
                      }
                    ),
                    this.$selection.on("keydown", function (a) {
                      !b.isOpen() && a.which >= 48 && a.which <= 90 && b.open();
                    }),
                    b.on("focus", function () {
                      d.focusOnSearch();
                    });
                }),
                (a.prototype.clear = function () {
                  this.$selection.find(".select2-selection__rendered").empty();
                }),
                (a.prototype.display = function (a, b) {
                  var c = this.options.get("templateSelection");
                  return this.options.get("escapeMarkup")(c(a, b));
                }),
                (a.prototype.selectionContainer = function () {
                  return $(
                    '<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation" aria-hidden="true">&times;</span></li>'
                  );
                }),
                (a.prototype.focusOnSearch = function () {
                  var a = this;
                  void 0 !== a.$search &&
                    setTimeout(function () {
                      (a._keyUpPrevented = !0), a.$search.focus();
                    }, 1);
                }),
                (a.prototype.update = function (e) {
                  if ((this.clear(), 0 !== e.length)) {
                    for (var g = [], f = 0; f < e.length; f++) {
                      var b = e[f],
                        a = this.selectionContainer(),
                        h = a.html(),
                        d = this.display(b, a);
                      "string" == typeof d && (d = c.entityDecode(d.trim())),
                        a.text(d),
                        a.prepend(h),
                        a.prop("title", b.title || b.text),
                        a.data("data", b),
                        g.push(a);
                    }
                    var i = this.$selection.find(
                      ".select2-selection__rendered"
                    );
                    c.appendMany(i, g);
                  }
                }),
                a
              );
            }
          ),
          a.define("select2/selection/placeholder", ["../utils"], function (b) {
            function a(b, c, a) {
              (this.placeholder = this.normalizePlaceholder(
                a.get("placeholder")
              )),
                b.call(this, c, a);
            }
            return (
              (a.prototype.normalizePlaceholder = function (_, a) {
                return "string" == typeof a && (a = { id: "", text: a }), a;
              }),
              (a.prototype.createPlaceholder = function (d, c) {
                var a = this.selectionContainer();
                return (
                  a.text(b.entityDecode(this.display(c))),
                  a
                    .addClass("select2-selection__placeholder")
                    .removeClass("select2-selection__choice"),
                  a
                );
              }),
              (a.prototype.update = function (b, a) {
                var c = 1 == a.length && a[0].id != this.placeholder.id,
                  d = a.length > 1;
                if (d || c) return b.call(this, a);
                this.clear();
                var e = this.createPlaceholder(this.placeholder);
                this.$selection.find(".select2-selection__rendered").append(e);
              }),
              a
            );
          }),
          a.define(
            "select2/selection/allowClear",
            ["jquery", "../keys"],
            function ($, b) {
              function a() {}
              return (
                (a.prototype.bind = function (b, a, c) {
                  var d = this;
                  b.call(this, a, c),
                    null == this.placeholder &&
                      this.options.get("debug") &&
                      window.console &&
                      console.error &&
                      console.error(
                        "Select2: The `allowClear` option should be used in combination with the `placeholder` option."
                      ),
                    this.$selection.on(
                      "mousedown",
                      ".select2-selection__clear",
                      function (a) {
                        d._handleClear(a);
                      }
                    ),
                    a.on("keypress", function (b) {
                      d._handleKeyboardClear(b, a);
                    });
                }),
                (a.prototype._handleClear = function (_, e) {
                  if (!this.options.get("disabled")) {
                    var b = this.$selection.find(".select2-selection__clear");
                    if (0 !== b.length) {
                      e.stopPropagation();
                      for (var c = b.data("data"), a = 0; a < c.length; a++) {
                        var d = { data: c[a] };
                        if ((this.trigger("unselect", d), d.prevented)) return;
                      }
                      this.$element.val(this.placeholder.id).trigger("change"),
                        this.trigger("toggle", {});
                    }
                  }
                }),
                (a.prototype._handleKeyboardClear = function (_, a, c) {
                  c.isOpen() ||
                    ((a.which == b.DELETE || a.which == b.BACKSPACE) &&
                      this._handleClear(a));
                }),
                (a.prototype.update = function (c, a) {
                  if (
                    (c.call(this, a),
                    !(
                      this.$selection.find(".select2-selection__placeholder")
                        .length > 0
                    ) && 0 !== a.length)
                  ) {
                    var b = $(
                      '<span class="select2-selection__clear">&times;</span>'
                    );
                    b.data("data", a),
                      this.$selection
                        .find(".select2-selection__rendered")
                        .prepend(b);
                  }
                }),
                a
              );
            }
          ),
          a.define(
            "select2/selection/search",
            ["jquery", "../utils", "../keys"],
            function ($, b, c) {
              function a(a, b, c) {
                a.call(this, b, c);
              }
              return (
                (a.prototype.render = function (b) {
                  var a = $(
                    '<li class="select2-search select2-search--inline"><input class="select2-search__field" type="text" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>'
                  );
                  (this.$searchContainer = a), (this.$search = a.find("input"));
                  var c = b.call(this);
                  return this._transferTabIndex(), c;
                }),
                (a.prototype.bind = function (d, a, e) {
                  var f = this,
                    g = a.id + "-results";
                  d.call(this, a, e),
                    a.on("open", function () {
                      f.$search.attr("aria-owns", g),
                        f.$search.trigger("focus");
                    }),
                    a.on("close", function () {
                      f.$search.val(""),
                        f.$search.removeAttr("aria-activedescendant"),
                        f.$search.removeAttr("aria-owns"),
                        f.$search.trigger("focus");
                    }),
                    a.on("enable", function () {
                      f.$search.prop("disabled", !1), f._transferTabIndex();
                    }),
                    a.on("disable", function () {
                      f.$search.prop("disabled", !0);
                    }),
                    a.on("focus", function (a) {
                      f.$search.trigger("focus");
                    }),
                    a.on("results:focus", function (a) {
                      f.$search.attr("aria-activedescendant", a.data._resultId);
                    }),
                    this.$selection.on(
                      "focusin",
                      ".select2-search--inline",
                      function (a) {
                        f.trigger("focus", a);
                      }
                    ),
                    this.$selection.on(
                      "focusout",
                      ".select2-search--inline",
                      function (a) {
                        f._handleBlur(a);
                      }
                    ),
                    this.$selection.on(
                      "keydown",
                      ".select2-search--inline",
                      function (b) {
                        if (
                          (b.stopPropagation(),
                          f.trigger("keypress", b),
                          (f._keyUpPrevented = b.isDefaultPrevented()),
                          b.which === c.BACKSPACE && "" === f.$search.val())
                        ) {
                          var d = f.$searchContainer.prev(
                            ".select2-selection__choice"
                          );
                          if (d.length > 0) {
                            var e = d.data("data");
                            f.searchRemoveChoice(e), b.preventDefault();
                          }
                        } else
                          b.which === c.ENTER && (a.open(), b.preventDefault());
                      }
                    );
                  var b = document.documentMode,
                    h = b && b <= 11;
                  this.$selection.on(
                    "input.searchcheck",
                    ".select2-search--inline",
                    function (a) {
                      if (h) {
                        f.$selection.off("input.search input.searchcheck");
                        return;
                      }
                      f.$selection.off("keyup.search");
                    }
                  ),
                    this.$selection.on(
                      "keyup.search input.search",
                      ".select2-search--inline",
                      function (b) {
                        if (h && "input" === b.type) {
                          f.$selection.off("input.search input.searchcheck");
                          return;
                        }
                        var a = b.which;
                        a != c.SHIFT &&
                          a != c.CTRL &&
                          a != c.ALT &&
                          a != c.TAB &&
                          f.handleSearch(b);
                      }
                    );
                }),
                (a.prototype._transferTabIndex = function (a) {
                  this.$search.attr(
                    "tabindex",
                    this.$selection.attr("tabindex")
                  ),
                    this.$selection.attr("tabindex", "-1");
                }),
                (a.prototype.createPlaceholder = function (b, a) {
                  this.$search.attr("placeholder", a.text);
                }),
                (a.prototype.update = function (a, b) {
                  var c = this.$search[0] == document.activeElement;
                  this.$search.attr("placeholder", ""),
                    a.call(this, b),
                    this.$selection
                      .find(".select2-selection__rendered")
                      .append(this.$searchContainer),
                    this.resizeSearch(),
                    c && this.$search.focus();
                }),
                (a.prototype.handleSearch = function () {
                  if ((this.resizeSearch(), !this._keyUpPrevented)) {
                    var a = this.$search.val();
                    this.trigger("query", { term: a });
                  }
                  this._keyUpPrevented = !1;
                }),
                (a.prototype.searchRemoveChoice = function (b, a) {
                  this.trigger("unselect", { data: a }),
                    this.$search.val(a.text),
                    this.handleSearch();
                }),
                (a.prototype.resizeSearch = function () {
                  this.$search.css("width", "25px");
                  var a = "";
                  (a =
                    "" !== this.$search.attr("placeholder")
                      ? this.$selection
                          .find(".select2-selection__rendered")
                          .innerWidth()
                      : 0.75 * (this.$search.val().length + 1) + "em"),
                    this.$search.css("width", a);
                }),
                a
              );
            }
          ),
          a.define("select2/selection/eventRelay", ["jquery"], function ($) {
            function a() {}
            return (
              (a.prototype.bind = function (b, a, c) {
                var d = this,
                  e = [
                    "open",
                    "opening",
                    "close",
                    "closing",
                    "select",
                    "selecting",
                    "unselect",
                    "unselecting",
                  ],
                  f = ["opening", "closing", "selecting", "unselecting"];
                b.call(this, a, c),
                  a.on("*", function (b, a) {
                    if (-1 !== $.inArray(b, e)) {
                      a = a || {};
                      var c = $.Event("select2:" + b, { params: a });
                      d.$element.trigger(c),
                        -1 !== $.inArray(b, f) &&
                          (a.prevented = c.isDefaultPrevented());
                    }
                  });
              }),
              a
            );
          }),
          a.define(
            "select2/translation",
            ["jquery", "require"],
            function ($, b) {
              function a(a) {
                this.dict = a || {};
              }
              return (
                (a.prototype.all = function () {
                  return this.dict;
                }),
                (a.prototype.get = function (a) {
                  return this.dict[a];
                }),
                (a.prototype.extend = function (a) {
                  this.dict = $.extend({}, a.all(), this.dict);
                }),
                (a._cache = {}),
                (a.loadPath = function (c) {
                  if (!(c in a._cache)) {
                    var d = b(c);
                    a._cache[c] = d;
                  }
                  return new a(a._cache[c]);
                }),
                a
              );
            }
          ),
          a.define("select2/diacritics", [], function () {
            return {
              "\u24B6": "A",
              Ａ: "A",
              À: "A",
              Á: "A",
              Â: "A",
              Ầ: "A",
              Ấ: "A",
              Ẫ: "A",
              Ẩ: "A",
              Ã: "A",
              Ā: "A",
              Ă: "A",
              Ằ: "A",
              Ắ: "A",
              Ẵ: "A",
              Ẳ: "A",
              Ȧ: "A",
              Ǡ: "A",
              Ä: "A",
              Ǟ: "A",
              Ả: "A",
              Å: "A",
              Ǻ: "A",
              Ǎ: "A",
              Ȁ: "A",
              Ȃ: "A",
              Ạ: "A",
              Ậ: "A",
              Ặ: "A",
              Ḁ: "A",
              Ą: "A",
              Ⱥ: "A",
              Ɐ: "A",
              Ꜳ: "AA",
              Æ: "AE",
              Ǽ: "AE",
              Ǣ: "AE",
              Ꜵ: "AO",
              Ꜷ: "AU",
              Ꜹ: "AV",
              Ꜻ: "AV",
              Ꜽ: "AY",
              "\u24B7": "B",
              Ｂ: "B",
              Ḃ: "B",
              Ḅ: "B",
              Ḇ: "B",
              Ƀ: "B",
              Ƃ: "B",
              Ɓ: "B",
              "\u24B8": "C",
              Ｃ: "C",
              Ć: "C",
              Ĉ: "C",
              Ċ: "C",
              Č: "C",
              Ç: "C",
              Ḉ: "C",
              Ƈ: "C",
              Ȼ: "C",
              Ꜿ: "C",
              "\u24B9": "D",
              Ｄ: "D",
              Ḋ: "D",
              Ď: "D",
              Ḍ: "D",
              Ḑ: "D",
              Ḓ: "D",
              Ḏ: "D",
              Đ: "D",
              Ƌ: "D",
              Ɗ: "D",
              Ɖ: "D",
              Ꝺ: "D",
              Ǳ: "DZ",
              Ǆ: "DZ",
              ǲ: "Dz",
              ǅ: "Dz",
              "\u24BA": "E",
              Ｅ: "E",
              È: "E",
              É: "E",
              Ê: "E",
              Ề: "E",
              Ế: "E",
              Ễ: "E",
              Ể: "E",
              Ẽ: "E",
              Ē: "E",
              Ḕ: "E",
              Ḗ: "E",
              Ĕ: "E",
              Ė: "E",
              Ë: "E",
              Ẻ: "E",
              Ě: "E",
              Ȅ: "E",
              Ȇ: "E",
              Ẹ: "E",
              Ệ: "E",
              Ȩ: "E",
              Ḝ: "E",
              Ę: "E",
              Ḙ: "E",
              Ḛ: "E",
              Ɛ: "E",
              Ǝ: "E",
              "\u24BB": "F",
              Ｆ: "F",
              Ḟ: "F",
              Ƒ: "F",
              Ꝼ: "F",
              "\u24BC": "G",
              Ｇ: "G",
              Ǵ: "G",
              Ĝ: "G",
              Ḡ: "G",
              Ğ: "G",
              Ġ: "G",
              Ǧ: "G",
              Ģ: "G",
              Ǥ: "G",
              Ɠ: "G",
              Ꞡ: "G",
              Ᵹ: "G",
              Ꝿ: "G",
              "\u24BD": "H",
              Ｈ: "H",
              Ĥ: "H",
              Ḣ: "H",
              Ḧ: "H",
              Ȟ: "H",
              Ḥ: "H",
              Ḩ: "H",
              Ḫ: "H",
              Ħ: "H",
              Ⱨ: "H",
              Ⱶ: "H",
              Ɥ: "H",
              "\u24BE": "I",
              Ｉ: "I",
              Ì: "I",
              Í: "I",
              Î: "I",
              Ĩ: "I",
              Ī: "I",
              Ĭ: "I",
              İ: "I",
              Ï: "I",
              Ḯ: "I",
              Ỉ: "I",
              Ǐ: "I",
              Ȉ: "I",
              Ȋ: "I",
              Ị: "I",
              Į: "I",
              Ḭ: "I",
              Ɨ: "I",
              "\u24BF": "J",
              Ｊ: "J",
              Ĵ: "J",
              Ɉ: "J",
              "\u24C0": "K",
              Ｋ: "K",
              Ḱ: "K",
              Ǩ: "K",
              Ḳ: "K",
              Ķ: "K",
              Ḵ: "K",
              Ƙ: "K",
              Ⱪ: "K",
              Ꝁ: "K",
              Ꝃ: "K",
              Ꝅ: "K",
              Ꞣ: "K",
              "\u24C1": "L",
              Ｌ: "L",
              Ŀ: "L",
              Ĺ: "L",
              Ľ: "L",
              Ḷ: "L",
              Ḹ: "L",
              Ļ: "L",
              Ḽ: "L",
              Ḻ: "L",
              Ł: "L",
              Ƚ: "L",
              Ɫ: "L",
              Ⱡ: "L",
              Ꝉ: "L",
              Ꝇ: "L",
              Ꞁ: "L",
              Ǉ: "LJ",
              ǈ: "Lj",
              "\u24C2": "M",
              Ｍ: "M",
              Ḿ: "M",
              Ṁ: "M",
              Ṃ: "M",
              Ɱ: "M",
              Ɯ: "M",
              "\u24C3": "N",
              Ｎ: "N",
              Ǹ: "N",
              Ń: "N",
              Ñ: "N",
              Ṅ: "N",
              Ň: "N",
              Ṇ: "N",
              Ņ: "N",
              Ṋ: "N",
              Ṉ: "N",
              Ƞ: "N",
              Ɲ: "N",
              Ꞑ: "N",
              Ꞥ: "N",
              Ǌ: "NJ",
              ǋ: "Nj",
              "\u24C4": "O",
              Ｏ: "O",
              Ò: "O",
              Ó: "O",
              Ô: "O",
              Ồ: "O",
              Ố: "O",
              Ỗ: "O",
              Ổ: "O",
              Õ: "O",
              Ṍ: "O",
              Ȭ: "O",
              Ṏ: "O",
              Ō: "O",
              Ṑ: "O",
              Ṓ: "O",
              Ŏ: "O",
              Ȯ: "O",
              Ȱ: "O",
              Ö: "O",
              Ȫ: "O",
              Ỏ: "O",
              Ő: "O",
              Ǒ: "O",
              Ȍ: "O",
              Ȏ: "O",
              Ơ: "O",
              Ờ: "O",
              Ớ: "O",
              Ỡ: "O",
              Ở: "O",
              Ợ: "O",
              Ọ: "O",
              Ộ: "O",
              Ǫ: "O",
              Ǭ: "O",
              Ø: "O",
              Ǿ: "O",
              Ɔ: "O",
              Ɵ: "O",
              Ꝋ: "O",
              Ꝍ: "O",
              Ƣ: "OI",
              Ꝏ: "OO",
              Ȣ: "OU",
              "\u24C5": "P",
              Ｐ: "P",
              Ṕ: "P",
              Ṗ: "P",
              Ƥ: "P",
              Ᵽ: "P",
              Ꝑ: "P",
              Ꝓ: "P",
              Ꝕ: "P",
              "\u24C6": "Q",
              Ｑ: "Q",
              Ꝗ: "Q",
              Ꝙ: "Q",
              Ɋ: "Q",
              "\u24C7": "R",
              Ｒ: "R",
              Ŕ: "R",
              Ṙ: "R",
              Ř: "R",
              Ȑ: "R",
              Ȓ: "R",
              Ṛ: "R",
              Ṝ: "R",
              Ŗ: "R",
              Ṟ: "R",
              Ɍ: "R",
              Ɽ: "R",
              Ꝛ: "R",
              Ꞧ: "R",
              Ꞃ: "R",
              "\u24C8": "S",
              Ｓ: "S",
              ẞ: "S",
              Ś: "S",
              Ṥ: "S",
              Ŝ: "S",
              Ṡ: "S",
              Š: "S",
              Ṧ: "S",
              Ṣ: "S",
              Ṩ: "S",
              Ș: "S",
              Ş: "S",
              Ȿ: "S",
              Ꞩ: "S",
              Ꞅ: "S",
              "\u24C9": "T",
              Ｔ: "T",
              Ṫ: "T",
              Ť: "T",
              Ṭ: "T",
              Ț: "T",
              Ţ: "T",
              Ṱ: "T",
              Ṯ: "T",
              Ŧ: "T",
              Ƭ: "T",
              Ʈ: "T",
              Ⱦ: "T",
              Ꞇ: "T",
              Ꜩ: "TZ",
              "\u24CA": "U",
              Ｕ: "U",
              Ù: "U",
              Ú: "U",
              Û: "U",
              Ũ: "U",
              Ṹ: "U",
              Ū: "U",
              Ṻ: "U",
              Ŭ: "U",
              Ü: "U",
              Ǜ: "U",
              Ǘ: "U",
              Ǖ: "U",
              Ǚ: "U",
              Ủ: "U",
              Ů: "U",
              Ű: "U",
              Ǔ: "U",
              Ȕ: "U",
              Ȗ: "U",
              Ư: "U",
              Ừ: "U",
              Ứ: "U",
              Ữ: "U",
              Ử: "U",
              Ự: "U",
              Ụ: "U",
              Ṳ: "U",
              Ų: "U",
              Ṷ: "U",
              Ṵ: "U",
              Ʉ: "U",
              "\u24CB": "V",
              Ｖ: "V",
              Ṽ: "V",
              Ṿ: "V",
              Ʋ: "V",
              Ꝟ: "V",
              Ʌ: "V",
              Ꝡ: "VY",
              "\u24CC": "W",
              Ｗ: "W",
              Ẁ: "W",
              Ẃ: "W",
              Ŵ: "W",
              Ẇ: "W",
              Ẅ: "W",
              Ẉ: "W",
              Ⱳ: "W",
              "\u24CD": "X",
              Ｘ: "X",
              Ẋ: "X",
              Ẍ: "X",
              "\u24CE": "Y",
              Ｙ: "Y",
              Ỳ: "Y",
              Ý: "Y",
              Ŷ: "Y",
              Ỹ: "Y",
              Ȳ: "Y",
              Ẏ: "Y",
              Ÿ: "Y",
              Ỷ: "Y",
              Ỵ: "Y",
              Ƴ: "Y",
              Ɏ: "Y",
              Ỿ: "Y",
              "\u24CF": "Z",
              Ｚ: "Z",
              Ź: "Z",
              Ẑ: "Z",
              Ż: "Z",
              Ž: "Z",
              Ẓ: "Z",
              Ẕ: "Z",
              Ƶ: "Z",
              Ȥ: "Z",
              Ɀ: "Z",
              Ⱬ: "Z",
              Ꝣ: "Z",
              "\u24D0": "a",
              ａ: "a",
              ẚ: "a",
              à: "a",
              á: "a",
              â: "a",
              ầ: "a",
              ấ: "a",
              ẫ: "a",
              ẩ: "a",
              ã: "a",
              ā: "a",
              ă: "a",
              ằ: "a",
              ắ: "a",
              ẵ: "a",
              ẳ: "a",
              ȧ: "a",
              ǡ: "a",
              ä: "a",
              ǟ: "a",
              ả: "a",
              å: "a",
              ǻ: "a",
              ǎ: "a",
              ȁ: "a",
              ȃ: "a",
              ạ: "a",
              ậ: "a",
              ặ: "a",
              ḁ: "a",
              ą: "a",
              ⱥ: "a",
              ɐ: "a",
              ꜳ: "aa",
              æ: "ae",
              ǽ: "ae",
              ǣ: "ae",
              ꜵ: "ao",
              ꜷ: "au",
              ꜹ: "av",
              ꜻ: "av",
              ꜽ: "ay",
              "\u24D1": "b",
              ｂ: "b",
              ḃ: "b",
              ḅ: "b",
              ḇ: "b",
              ƀ: "b",
              ƃ: "b",
              ɓ: "b",
              "\u24D2": "c",
              ｃ: "c",
              ć: "c",
              ĉ: "c",
              ċ: "c",
              č: "c",
              ç: "c",
              ḉ: "c",
              ƈ: "c",
              ȼ: "c",
              ꜿ: "c",
              ↄ: "c",
              "\u24D3": "d",
              ｄ: "d",
              ḋ: "d",
              ď: "d",
              ḍ: "d",
              ḑ: "d",
              ḓ: "d",
              ḏ: "d",
              đ: "d",
              ƌ: "d",
              ɖ: "d",
              ɗ: "d",
              ꝺ: "d",
              ǳ: "dz",
              ǆ: "dz",
              "\u24D4": "e",
              ｅ: "e",
              è: "e",
              é: "e",
              ê: "e",
              ề: "e",
              ế: "e",
              ễ: "e",
              ể: "e",
              ẽ: "e",
              ē: "e",
              ḕ: "e",
              ḗ: "e",
              ĕ: "e",
              ė: "e",
              ë: "e",
              ẻ: "e",
              ě: "e",
              ȅ: "e",
              ȇ: "e",
              ẹ: "e",
              ệ: "e",
              ȩ: "e",
              ḝ: "e",
              ę: "e",
              ḙ: "e",
              ḛ: "e",
              ɇ: "e",
              ɛ: "e",
              ǝ: "e",
              "\u24D5": "f",
              ｆ: "f",
              ḟ: "f",
              ƒ: "f",
              ꝼ: "f",
              "\u24D6": "g",
              ｇ: "g",
              ǵ: "g",
              ĝ: "g",
              ḡ: "g",
              ğ: "g",
              ġ: "g",
              ǧ: "g",
              ģ: "g",
              ǥ: "g",
              ɠ: "g",
              ꞡ: "g",
              ᵹ: "g",
              ꝿ: "g",
              "\u24D7": "h",
              ｈ: "h",
              ĥ: "h",
              ḣ: "h",
              ḧ: "h",
              ȟ: "h",
              ḥ: "h",
              ḩ: "h",
              ḫ: "h",
              ẖ: "h",
              ħ: "h",
              ⱨ: "h",
              ⱶ: "h",
              ɥ: "h",
              ƕ: "hv",
              "\u24D8": "i",
              ｉ: "i",
              ì: "i",
              í: "i",
              î: "i",
              ĩ: "i",
              ī: "i",
              ĭ: "i",
              ï: "i",
              ḯ: "i",
              ỉ: "i",
              ǐ: "i",
              ȉ: "i",
              ȋ: "i",
              ị: "i",
              į: "i",
              ḭ: "i",
              ɨ: "i",
              ı: "i",
              "\u24D9": "j",
              ｊ: "j",
              ĵ: "j",
              ǰ: "j",
              ɉ: "j",
              "\u24DA": "k",
              ｋ: "k",
              ḱ: "k",
              ǩ: "k",
              ḳ: "k",
              ķ: "k",
              ḵ: "k",
              ƙ: "k",
              ⱪ: "k",
              ꝁ: "k",
              ꝃ: "k",
              ꝅ: "k",
              ꞣ: "k",
              "\u24DB": "l",
              ｌ: "l",
              ŀ: "l",
              ĺ: "l",
              ľ: "l",
              ḷ: "l",
              ḹ: "l",
              ļ: "l",
              ḽ: "l",
              ḻ: "l",
              ſ: "l",
              ł: "l",
              ƚ: "l",
              ɫ: "l",
              ⱡ: "l",
              ꝉ: "l",
              ꞁ: "l",
              ꝇ: "l",
              ǉ: "lj",
              "\u24DC": "m",
              ｍ: "m",
              ḿ: "m",
              ṁ: "m",
              ṃ: "m",
              ɱ: "m",
              ɯ: "m",
              "\u24DD": "n",
              ｎ: "n",
              ǹ: "n",
              ń: "n",
              ñ: "n",
              ṅ: "n",
              ň: "n",
              ṇ: "n",
              ņ: "n",
              ṋ: "n",
              ṉ: "n",
              ƞ: "n",
              ɲ: "n",
              ŉ: "n",
              ꞑ: "n",
              ꞥ: "n",
              ǌ: "nj",
              "\u24DE": "o",
              ｏ: "o",
              ò: "o",
              ó: "o",
              ô: "o",
              ồ: "o",
              ố: "o",
              ỗ: "o",
              ổ: "o",
              õ: "o",
              ṍ: "o",
              ȭ: "o",
              ṏ: "o",
              ō: "o",
              ṑ: "o",
              ṓ: "o",
              ŏ: "o",
              ȯ: "o",
              ȱ: "o",
              ö: "o",
              ȫ: "o",
              ỏ: "o",
              ő: "o",
              ǒ: "o",
              ȍ: "o",
              ȏ: "o",
              ơ: "o",
              ờ: "o",
              ớ: "o",
              ỡ: "o",
              ở: "o",
              ợ: "o",
              ọ: "o",
              ộ: "o",
              ǫ: "o",
              ǭ: "o",
              ø: "o",
              ǿ: "o",
              ɔ: "o",
              ꝋ: "o",
              ꝍ: "o",
              ɵ: "o",
              ƣ: "oi",
              ȣ: "ou",
              ꝏ: "oo",
              "\u24DF": "p",
              ｐ: "p",
              ṕ: "p",
              ṗ: "p",
              ƥ: "p",
              ᵽ: "p",
              ꝑ: "p",
              ꝓ: "p",
              ꝕ: "p",
              "\u24E0": "q",
              ｑ: "q",
              ɋ: "q",
              ꝗ: "q",
              ꝙ: "q",
              "\u24E1": "r",
              ｒ: "r",
              ŕ: "r",
              ṙ: "r",
              ř: "r",
              ȑ: "r",
              ȓ: "r",
              ṛ: "r",
              ṝ: "r",
              ŗ: "r",
              ṟ: "r",
              ɍ: "r",
              ɽ: "r",
              ꝛ: "r",
              ꞧ: "r",
              ꞃ: "r",
              "\u24E2": "s",
              ｓ: "s",
              ß: "s",
              ś: "s",
              ṥ: "s",
              ŝ: "s",
              ṡ: "s",
              š: "s",
              ṧ: "s",
              ṣ: "s",
              ṩ: "s",
              ș: "s",
              ş: "s",
              ȿ: "s",
              ꞩ: "s",
              ꞅ: "s",
              ẛ: "s",
              "\u24E3": "t",
              ｔ: "t",
              ṫ: "t",
              ẗ: "t",
              ť: "t",
              ṭ: "t",
              ț: "t",
              ţ: "t",
              ṱ: "t",
              ṯ: "t",
              ŧ: "t",
              ƭ: "t",
              ʈ: "t",
              ⱦ: "t",
              ꞇ: "t",
              ꜩ: "tz",
              "\u24E4": "u",
              ｕ: "u",
              ù: "u",
              ú: "u",
              û: "u",
              ũ: "u",
              ṹ: "u",
              ū: "u",
              ṻ: "u",
              ŭ: "u",
              ü: "u",
              ǜ: "u",
              ǘ: "u",
              ǖ: "u",
              ǚ: "u",
              ủ: "u",
              ů: "u",
              ű: "u",
              ǔ: "u",
              ȕ: "u",
              ȗ: "u",
              ư: "u",
              ừ: "u",
              ứ: "u",
              ữ: "u",
              ử: "u",
              ự: "u",
              ụ: "u",
              ṳ: "u",
              ų: "u",
              ṷ: "u",
              ṵ: "u",
              ʉ: "u",
              "\u24E5": "v",
              ｖ: "v",
              ṽ: "v",
              ṿ: "v",
              ʋ: "v",
              ꝟ: "v",
              ʌ: "v",
              ꝡ: "vy",
              "\u24E6": "w",
              ｗ: "w",
              ẁ: "w",
              ẃ: "w",
              ŵ: "w",
              ẇ: "w",
              ẅ: "w",
              ẘ: "w",
              ẉ: "w",
              ⱳ: "w",
              "\u24E7": "x",
              ｘ: "x",
              ẋ: "x",
              ẍ: "x",
              "\u24E8": "y",
              ｙ: "y",
              ỳ: "y",
              ý: "y",
              ŷ: "y",
              ỹ: "y",
              ȳ: "y",
              ẏ: "y",
              ÿ: "y",
              ỷ: "y",
              ẙ: "y",
              ỵ: "y",
              ƴ: "y",
              ɏ: "y",
              ỿ: "y",
              "\u24E9": "z",
              ｚ: "z",
              ź: "z",
              ẑ: "z",
              ż: "z",
              ž: "z",
              ẓ: "z",
              ẕ: "z",
              ƶ: "z",
              ȥ: "z",
              ɀ: "z",
              ⱬ: "z",
              ꝣ: "z",
              Ά: "\u0391",
              Έ: "\u0395",
              Ή: "\u0397",
              Ί: "\u0399",
              Ϊ: "\u0399",
              Ό: "\u039F",
              Ύ: "\u03A5",
              Ϋ: "\u03A5",
              Ώ: "\u03A9",
              ά: "\u03B1",
              έ: "\u03B5",
              ή: "\u03B7",
              ί: "\u03B9",
              ϊ: "\u03B9",
              ΐ: "\u03B9",
              ό: "\u03BF",
              ύ: "\u03C5",
              ϋ: "\u03C5",
              ΰ: "\u03C5",
              ω: "\u03C9",
              ς: "\u03C3",
            };
          }),
          a.define("select2/data/base", ["../utils"], function (b) {
            function a(b, c) {
              a.__super__.constructor.call(this);
            }
            return (
              b.Extend(a, b.Observable),
              (a.prototype.current = function (a) {
                throw new Error(
                  "The `current` method must be defined in child classes."
                );
              }),
              (a.prototype.query = function (a, b) {
                throw new Error(
                  "The `query` method must be defined in child classes."
                );
              }),
              (a.prototype.bind = function (a, b) {}),
              (a.prototype.destroy = function () {}),
              (a.prototype.generateResultId = function (c, d) {
                var a = "";
                return (
                  null != c ? (a += c.id) : (a += b.generateChars(4)),
                  (a += "-result-"),
                  (a += b.generateChars(4)),
                  null != d.id
                    ? (a += "-" + d.id.toString())
                    : (a += "-" + b.generateChars(4)),
                  a
                );
              }),
              a
            );
          }),
          a.define(
            "select2/data/select",
            ["./base", "../utils", "jquery"],
            function (b, c, $) {
              function a(b, c) {
                (this.$element = b),
                  (this.options = c),
                  a.__super__.constructor.call(this);
              }
              return (
                c.Extend(a, b),
                (a.prototype.current = function (a) {
                  var b = [],
                    c = this;
                  this.$element.find(":selected").each(function () {
                    var a = $(this),
                      d = c.item(a);
                    b.push(d);
                  }),
                    a(b);
                }),
                (a.prototype.select = function (a) {
                  var c = this;
                  if (((a.selected = !0), $(a.element).is("option"))) {
                    (a.element.selected = !0), this.$element.trigger("change");
                    return;
                  }
                  if (this.$element.prop("multiple"))
                    this.current(function (f) {
                      var b = [];
                      (a = [a]).push.apply(a, f);
                      for (var d = 0; d < a.length; d++) {
                        var e = a[d].id;
                        -1 === $.inArray(e, b) && b.push(e);
                      }
                      c.$element.val(b), c.$element.trigger("change");
                    });
                  else {
                    var b = a.id;
                    this.$element.val(b), this.$element.trigger("change");
                  }
                }),
                (a.prototype.unselect = function (a) {
                  var b = this;
                  if (this.$element.prop("multiple")) {
                    if (((a.selected = !1), $(a.element).is("option"))) {
                      (a.element.selected = !1),
                        this.$element.trigger("change");
                      return;
                    }
                    this.current(function (f) {
                      for (var c = [], d = 0; d < f.length; d++) {
                        var e = f[d].id;
                        e !== a.id && -1 === $.inArray(e, c) && c.push(e);
                      }
                      b.$element.val(c), b.$element.trigger("change");
                    });
                  }
                }),
                (a.prototype.bind = function (a, b) {
                  var c = this;
                  (this.container = a),
                    a.on("select", function (a) {
                      c.select(a.data);
                    }),
                    a.on("unselect", function (a) {
                      c.unselect(a.data);
                    });
                }),
                (a.prototype.destroy = function () {
                  this.$element.find("*").each(function () {
                    $.removeData(this, "data");
                  });
                }),
                (a.prototype.query = function (c, a) {
                  var b = [],
                    d = this;
                  this.$element.children().each(function () {
                    var a = $(this);
                    if (a.is("option") || a.is("optgroup")) {
                      var f = d.item(a),
                        e = d.matches(c, f);
                      null !== e && b.push(e);
                    }
                  }),
                    a({ results: b });
                }),
                (a.prototype.addOptions = function (a) {
                  c.appendMany(this.$element, a);
                }),
                (a.prototype.option = function (a) {
                  a.children
                    ? ((b = document.createElement("optgroup")).label = a.text)
                    : void 0 !==
                      (b = document.createElement("option")).textContent
                    ? (b.textContent = a.text)
                    : (b.innerText = a.text),
                    void 0 !== a.id && (b.value = a.id),
                    a.disabled && (b.disabled = !0),
                    a.selected && (b.selected = !0),
                    a.title && (b.title = a.title);
                  var b,
                    d = $(b),
                    c = this._normalizeItem(a);
                  return (c.element = b), $.data(b, "data", c), d;
                }),
                (a.prototype.item = function (a) {
                  var b = {};
                  if (null != (b = $.data(a[0], "data"))) return b;
                  if (a.is("option"))
                    b = {
                      id: a.val(),
                      text: a.text(),
                      disabled: a.prop("disabled"),
                      selected: a.prop("selected"),
                      title: a.prop("title"),
                    };
                  else if (a.is("optgroup")) {
                    b = {
                      text: a.prop("label"),
                      children: [],
                      title: a.prop("title"),
                    };
                    for (
                      var d = a.children("option"), e = [], c = 0;
                      c < d.length;
                      c++
                    ) {
                      var f = $(d[c]),
                        g = this.item(f);
                      e.push(g);
                    }
                    b.children = e;
                  }
                  return (
                    ((b = this._normalizeItem(b)).element = a[0]),
                    $.data(a[0], "data", b),
                    b
                  );
                }),
                (a.prototype._normalizeItem = function (a) {
                  return (
                    $.isPlainObject(a) || (a = { id: a, text: a }),
                    null != (a = $.extend({}, { text: "" }, a)).id &&
                      (a.id = a.id.toString()),
                    null != a.text && (a.text = a.text.toString()),
                    null == a._resultId &&
                      a.id &&
                      (a._resultId = this.generateResultId(this.container, a)),
                    $.extend({}, { selected: !1, disabled: !1 }, a)
                  );
                }),
                (a.prototype.matches = function (a, b) {
                  return this.options.get("matcher")(a, b);
                }),
                a
              );
            }
          ),
          a.define(
            "select2/data/array",
            ["./select", "../utils", "jquery"],
            function (b, c, $) {
              function a(c, b) {
                var d = b.get("data") || [];
                a.__super__.constructor.call(this, c, b),
                  this.addOptions(this.convertToOptions(d));
              }
              return (
                c.Extend(a, b),
                (a.prototype.select = function (c) {
                  var b = this.$element.find("option").filter(function (b, a) {
                    return a.value == c.id.toString();
                  });
                  0 === b.length && ((b = this.option(c)), this.addOptions(b)),
                    a.__super__.select.call(this, c);
                }),
                (a.prototype.convertToOptions = function (d) {
                  var o = this,
                    e = this.$element.find("option"),
                    i = e
                      .map(function () {
                        return o.item($(this)).id;
                      })
                      .get(),
                    f = [];
                  function j(a) {
                    return function () {
                      return $(this).val() == a.id;
                    };
                  }
                  for (var b = 0; b < d.length; b++) {
                    var a = this._normalizeItem(d[b]);
                    if ($.inArray(a.id, i) >= 0) {
                      var g = e.filter(j(a)),
                        k = this.item(g),
                        l = $.extend(!0, {}, a, k),
                        m = this.option(l);
                      g.replaceWith(m);
                      continue;
                    }
                    var h = this.option(a);
                    if (a.children) {
                      var n = this.convertToOptions(a.children);
                      c.appendMany(h, n);
                    }
                    f.push(h);
                  }
                  return f;
                }),
                a
              );
            }
          ),
          a.define(
            "select2/data/ajax",
            ["./array", "../utils", "jquery"],
            function (b, c, $) {
              function a(c, b) {
                (this.ajaxOptions = this._applyDefaults(b.get("ajax"))),
                  null != this.ajaxOptions.processResults &&
                    (this.processResults = this.ajaxOptions.processResults),
                  a.__super__.constructor.call(this, c, b);
              }
              return (
                c.Extend(a, b),
                (a.prototype._applyDefaults = function (a) {
                  return $.extend(
                    {},
                    {
                      data: function (a) {
                        return $.extend({}, a, { q: a.term });
                      },
                      transport: function (b, c, d) {
                        var a = $.ajax(b);
                        return a.then(c), a.fail(d), a;
                      },
                    },
                    a,
                    !0
                  );
                }),
                (a.prototype.processResults = function (a) {
                  return a;
                }),
                (a.prototype.query = function (b, d) {
                  var e = this;
                  null != this._request &&
                    ($.isFunction(this._request.abort) && this._request.abort(),
                    (this._request = null));
                  var a = $.extend({ type: "GET" }, this.ajaxOptions);
                  function c() {
                    var c = a.transport(
                      a,
                      function (c) {
                        var a = e.processResults(c, b);
                        e.options.get("debug") &&
                          window.console &&
                          console.error &&
                          ((a && a.results && $.isArray(a.results)) ||
                            console.error(
                              "Select2: The AJAX results did not return an array in the `results` key of the response."
                            )),
                          d(a),
                          e.container.focusOnActiveElement();
                      },
                      function () {
                        (c.status && "0" === c.status) ||
                          e.trigger("results:message", {
                            message: "errorLoading",
                          });
                      }
                    );
                    e._request = c;
                  }
                  "function" == typeof a.url &&
                    (a.url = a.url.call(this.$element, b)),
                    "function" == typeof a.data &&
                      (a.data = a.data.call(this.$element, b)),
                    this.ajaxOptions.delay && null != b.term
                      ? (this._queryTimeout &&
                          window.clearTimeout(this._queryTimeout),
                        (this._queryTimeout = window.setTimeout(
                          c,
                          this.ajaxOptions.delay
                        )))
                      : c();
                }),
                a
              );
            }
          ),
          a.define("select2/data/tags", ["jquery"], function ($) {
            function a(f, g, a) {
              var b = a.get("tags"),
                d = a.get("createTag");
              void 0 !== d && (this.createTag = d);
              var e = a.get("insertTag");
              if (
                (void 0 !== e && (this.insertTag = e),
                f.call(this, g, a),
                $.isArray(b))
              )
                for (var c = 0; c < b.length; c++) {
                  var h = b[c],
                    i = this._normalizeItem(h),
                    j = this.option(i);
                  this.$element.append(j);
                }
            }
            return (
              (a.prototype.query = function (b, a, c) {
                var e = this;
                if ((this._removeOldTags(), null == a.term || null != a.page)) {
                  b.call(this, a, c);
                  return;
                }
                function d(b, j) {
                  for (var f = b.results, g = 0; g < f.length; g++) {
                    var h = f[g],
                      l = null != h.children && !d({ results: h.children }, !0),
                      m = (h.text || "").toUpperCase(),
                      n = (a.term || "").toUpperCase(),
                      o = m === n;
                    if (o || l) {
                      if (j) return !1;
                      (b.data = f), c(b);
                      return;
                    }
                  }
                  if (j) return !0;
                  var i = e.createTag(a);
                  if (null != i) {
                    var k = e.option(i);
                    k.attr("data-select2-tag", !0),
                      e.addOptions([k]),
                      e.insertTag(f, i);
                  }
                  (b.results = f), c(b);
                }
                b.call(this, a, d);
              }),
              (a.prototype.createTag = function (c, b) {
                var a = $.trim(b.term);
                return "" === a ? null : { id: a, text: a };
              }),
              (a.prototype.insertTag = function (_, a, b) {
                a.unshift(b);
              }),
              (a.prototype._removeOldTags = function (_) {
                this._lastTag,
                  this.$element
                    .find("option[data-select2-tag]")
                    .each(function () {
                      this.selected || $(this).remove();
                    });
              }),
              a
            );
          }),
          a.define("select2/data/tokenizer", ["jquery"], function ($) {
            function a(c, d, a) {
              var b = a.get("tokenizer");
              void 0 !== b && (this.tokenizer = b), c.call(this, d, a);
            }
            return (
              (a.prototype.bind = function (c, a, b) {
                c.call(this, a, b),
                  (this.$search =
                    a.dropdown.$search ||
                    a.selection.$search ||
                    b.find(".select2-search__field"));
              }),
              (a.prototype.query = function (c, a, d) {
                var e = this;
                a.term = a.term || "";
                var b = this.tokenizer(a, this.options, function (d) {
                  var a,
                    b = e._normalizeItem(d);
                  if (
                    !e.$element.find("option").filter(function () {
                      return $(this).val() === b.id;
                    }).length
                  ) {
                    var c = e.option(b);
                    c.attr("data-select2-tag", !0),
                      e._removeOldTags(),
                      e.addOptions([c]);
                  }
                  (a = b), e.trigger("select", { data: a });
                });
                b.term !== a.term &&
                  (this.$search.length &&
                    (this.$search.val(b.term), this.$search.focus()),
                  (a.term = b.term)),
                  c.call(this, a, d);
              }),
              (a.prototype.tokenizer = function (_, c, e, f) {
                for (
                  var g = e.get("tokenSeparators") || [],
                    b = c.term,
                    a = 0,
                    h =
                      this.createTag ||
                      function (a) {
                        return { id: a.term, text: a.term };
                      };
                  a < b.length;

                ) {
                  var i = b[a];
                  if (-1 === $.inArray(i, g)) {
                    a++;
                    continue;
                  }
                  var j = b.substr(0, a),
                    k = $.extend({}, c, { term: j }),
                    d = h(k);
                  if (null == d) {
                    a++;
                    continue;
                  }
                  f(d), (b = b.substr(a + 1) || ""), (a = 0);
                }
                return { term: b };
              }),
              a
            );
          }),
          a.define("select2/data/minimumInputLength", [], function () {
            function a(b, c, a) {
              (this.minimumInputLength = a.get("minimumInputLength")),
                b.call(this, c, a);
            }
            return (
              (a.prototype.query = function (b, a, c) {
                if (
                  ((a.term = a.term || ""),
                  a.term.length < this.minimumInputLength)
                ) {
                  this.trigger("results:message", {
                    message: "inputTooShort",
                    args: {
                      minimum: this.minimumInputLength,
                      input: a.term,
                      params: a,
                    },
                  });
                  return;
                }
                b.call(this, a, c);
              }),
              a
            );
          }),
          a.define("select2/data/maximumInputLength", [], function () {
            function a(b, c, a) {
              (this.maximumInputLength = a.get("maximumInputLength")),
                b.call(this, c, a);
            }
            return (
              (a.prototype.query = function (b, a, c) {
                if (
                  ((a.term = a.term || ""),
                  this.maximumInputLength > 0 &&
                    a.term.length > this.maximumInputLength)
                ) {
                  this.trigger("results:message", {
                    message: "inputTooLong",
                    args: {
                      maximum: this.maximumInputLength,
                      input: a.term,
                      params: a,
                    },
                  });
                  return;
                }
                b.call(this, a, c);
              }),
              a
            );
          }),
          a.define("select2/data/maximumSelectionLength", [], function () {
            function a(b, c, a) {
              (this.maximumSelectionLength = a.get("maximumSelectionLength")),
                b.call(this, c, a);
            }
            return (
              (a.prototype.query = function (a, b, c) {
                var d = this;
                this.current(function (e) {
                  var f = null != e ? e.length : 0;
                  if (
                    d.maximumSelectionLength > 0 &&
                    f >= d.maximumSelectionLength
                  ) {
                    d.trigger("results:message", {
                      message: "maximumSelected",
                      args: { maximum: d.maximumSelectionLength },
                    });
                    return;
                  }
                  a.call(d, b, c);
                });
              }),
              a
            );
          }),
          a.define("select2/dropdown", ["jquery", "./utils"], function ($, b) {
            function a(b, c) {
              (this.$element = b),
                (this.options = c),
                a.__super__.constructor.call(this);
            }
            return (
              b.Extend(a, b.Observable),
              (a.prototype.render = function () {
                var a = $(
                  '<span class="select2-dropdown"><span class="select2-results"></span></span>'
                );
                return (
                  a.attr("dir", this.options.get("dir")),
                  (this.$dropdown = a),
                  a
                );
              }),
              (a.prototype.bind = function () {}),
              (a.prototype.position = function (a, b) {}),
              (a.prototype.destroy = function () {
                this.$dropdown.remove();
              }),
              a
            );
          }),
          a.define(
            "select2/dropdown/search",
            ["jquery", "../utils"],
            function ($, b) {
              function a() {}
              return (
                (a.prototype.render = function (c) {
                  var b = c.call(this),
                    a = $(
                      '<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="text" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="combobox" aria-autocomplete="list" aria-expanded="true" /></span>'
                    );
                  return (
                    (this.$searchContainer = a),
                    (this.$search = a.find("input")),
                    b.prepend(a),
                    b
                  );
                }),
                (a.prototype.bind = function (b, a, c) {
                  var d = this,
                    e = a.id + "-results";
                  b.call(this, a, c),
                    this.$search.on("keydown", function (a) {
                      d.trigger("keypress", a),
                        (d._keyUpPrevented = a.isDefaultPrevented());
                    }),
                    this.$search.on("input", function (a) {
                      $(this).off("keyup");
                    }),
                    this.$search.on("keyup input", function (a) {
                      d.handleSearch(a);
                    }),
                    a.on("open", function () {
                      d.$search.attr("tabindex", 0),
                        d.$search.attr("aria-owns", e),
                        d.$search.focus(),
                        window.setTimeout(function () {
                          d.$search.focus();
                        }, 0);
                    }),
                    a.on("close", function () {
                      d.$search.attr("tabindex", -1),
                        d.$search.removeAttr("aria-activedescendant"),
                        d.$search.removeAttr("aria-owns"),
                        d.$search.val("");
                    }),
                    a.on("focus", function () {
                      a.isOpen() || d.$search.focus();
                    }),
                    a.on("results:all", function (a) {
                      (null == a.query.term || "" === a.query.term) &&
                        (d.showSearch(a)
                          ? d.$searchContainer.removeClass(
                              "select2-search--hide"
                            )
                          : d.$searchContainer.addClass(
                              "select2-search--hide"
                            ));
                    }),
                    a.on("results:focus", function (a) {
                      d.$search.attr("aria-activedescendant", a.data._resultId);
                    });
                }),
                (a.prototype.handleSearch = function (b) {
                  if (!this._keyUpPrevented) {
                    var a = this.$search.val();
                    this.trigger("query", { term: a });
                  }
                  this._keyUpPrevented = !1;
                }),
                (a.prototype.showSearch = function (_, a) {
                  return !0;
                }),
                a
              );
            }
          ),
          a.define("select2/dropdown/hidePlaceholder", [], function () {
            function a(b, c, a, d) {
              (this.placeholder = this.normalizePlaceholder(
                a.get("placeholder")
              )),
                b.call(this, c, a, d);
            }
            return (
              (a.prototype.append = function (b, a) {
                (a.results = this.removePlaceholder(a.results)),
                  b.call(this, a);
              }),
              (a.prototype.normalizePlaceholder = function (_, a) {
                return "string" == typeof a && (a = { id: "", text: a }), a;
              }),
              (a.prototype.removePlaceholder = function (_, b) {
                for (var c = b.slice(0), a = b.length - 1; a >= 0; a--) {
                  var d = b[a];
                  this.placeholder.id === d.id && c.splice(a, 1);
                }
                return c;
              }),
              a
            );
          }),
          a.define("select2/dropdown/infiniteScroll", ["jquery"], function ($) {
            function a(a, b, c, d) {
              (this.lastParams = {}),
                a.call(this, b, c, d),
                (this.$loadingMore = this.createLoadingMore()),
                (this.loading = !1);
            }
            return (
              (a.prototype.append = function (b, a) {
                this.$loadingMore.remove(),
                  (this.loading = !1),
                  b.call(this, a),
                  this.showLoadingMore(a) &&
                    this.$results.append(this.$loadingMore);
              }),
              (a.prototype.bind = function (b, a, c) {
                var d = this;
                b.call(this, a, c),
                  a.on("query", function (a) {
                    (d.lastParams = a), (d.loading = !0);
                  }),
                  a.on("query:append", function (a) {
                    (d.lastParams = a), (d.loading = !0);
                  }),
                  this.$results.on("scroll", function () {
                    var a = $.contains(
                      document.documentElement,
                      d.$loadingMore[0]
                    );
                    if (!d.loading && a) {
                      var b =
                          d.$results.offset().top + d.$results.outerHeight(!1),
                        c =
                          d.$loadingMore.offset().top +
                          d.$loadingMore.outerHeight(!1);
                      b + 50 >= c && d.loadMore();
                    }
                  });
              }),
              (a.prototype.loadMore = function () {
                this.loading = !0;
                var a = $.extend({}, { page: 1 }, this.lastParams);
                a.page++, this.trigger("query:append", a);
              }),
              (a.prototype.showLoadingMore = function (_, a) {
                return a.pagination && a.pagination.more;
              }),
              (a.prototype.createLoadingMore = function () {
                var a = $(
                    '<li class="select2-results__option select2-results__option--load-more"role="option" aria-disabled="true"></li>'
                  ),
                  b = this.options.get("translations").get("loadingMore");
                return a.html(b(this.lastParams)), a;
              }),
              a
            );
          }),
          a.define(
            "select2/dropdown/attachBody",
            ["jquery", "../utils"],
            function ($, b) {
              function a(b, c, a) {
                (this.$dropdownParent =
                  a.get("dropdownParent") || $(document.body)),
                  b.call(this, c, a);
              }
              return (
                (a.prototype.bind = function (b, a, c) {
                  var d = this,
                    e = !1;
                  b.call(this, a, c),
                    a.on("open", function () {
                      d._showDropdown(),
                        d._attachPositioningHandler(a),
                        e ||
                          ((e = !0),
                          a.on("results:all", function () {
                            d._positionDropdown(), d._resizeDropdown();
                          }),
                          a.on("results:append", function () {
                            d._positionDropdown(), d._resizeDropdown();
                          }));
                    }),
                    a.on("close", function () {
                      d._hideDropdown(), d._detachPositioningHandler(a);
                    }),
                    this.$dropdownContainer.on("mousedown", function (a) {
                      a.stopPropagation();
                    });
                }),
                (a.prototype.destroy = function (a) {
                  a.call(this), this.$dropdownContainer.remove();
                }),
                (a.prototype.position = function (c, a, b) {
                  a.attr("class", b.attr("class")),
                    a.removeClass("select2"),
                    a.addClass("select2-container--open"),
                    a.css({ position: "absolute", top: -999999 }),
                    (this.$container = b);
                }),
                (a.prototype.render = function (b) {
                  var a = $("<span></span>"),
                    c = b.call(this);
                  return a.append(c), (this.$dropdownContainer = a), a;
                }),
                (a.prototype._hideDropdown = function (a) {
                  this.$dropdownContainer.detach();
                }),
                (a.prototype._attachPositioningHandler = function (g, a) {
                  var h = this,
                    c = "scroll.select2." + a.id,
                    e = "resize.select2." + a.id,
                    f = "orientationchange.select2." + a.id,
                    d = this.$container.parents().filter(b.hasScroll);
                  d.each(function () {
                    $(this).data("select2-scroll-position", {
                      x: $(this).scrollLeft(),
                      y: $(this).scrollTop(),
                    });
                  }),
                    d.on(c, function (b) {
                      var a = $(this).data("select2-scroll-position");
                      $(this).scrollTop(a.y);
                    }),
                    $(window).on(c + " " + e + " " + f, function (a) {
                      h._positionDropdown(), h._resizeDropdown();
                    });
                }),
                (a.prototype._detachPositioningHandler = function (g, a) {
                  var c = "scroll.select2." + a.id,
                    d = "resize.select2." + a.id,
                    e = "orientationchange.select2." + a.id,
                    f = this.$container.parents().filter(b.hasScroll);
                  f.off(c), $(window).off(c + " " + d + " " + e);
                }),
                (a.prototype._positionDropdown = function () {
                  var f = $(window),
                    d = this.$dropdown.hasClass("select2-dropdown--above"),
                    l = this.$dropdown.hasClass("select2-dropdown--below"),
                    a = null,
                    b = this.$container.offset();
                  b.bottom = b.top + this.$container.outerHeight(!1);
                  var c = { height: this.$container.outerHeight(!1) };
                  (c.top = b.top), (c.bottom = b.top + c.height);
                  var g = { height: this.$dropdown.outerHeight(!1) },
                    i = {
                      top: f.scrollTop(),
                      bottom: f.scrollTop() + f.height(),
                    },
                    j = i.top < b.top - g.height,
                    k = i.bottom > b.bottom + g.height,
                    h = { left: b.left, top: c.bottom },
                    e = this.$dropdownParent;
                  "static" === e.css("position") && (e = e.offsetParent());
                  var m = e.offset();
                  (h.left -= m.left),
                    d || l || (a = "below"),
                    k || !j || d
                      ? !j && k && d && (a = "below")
                      : (a = "above"),
                    ("above" == a || (d && "below" !== a)) &&
                      (h.top = c.top - g.height),
                    null != a &&
                      (this.$dropdown
                        .removeClass(
                          "select2-dropdown--below select2-dropdown--above"
                        )
                        .addClass("select2-dropdown--" + a),
                      this.$container
                        .removeClass(
                          "select2-container--below select2-container--above"
                        )
                        .addClass("select2-container--" + a)),
                    this.$dropdownContainer.css(h);
                }),
                (a.prototype._resizeDropdown = function () {
                  var a = { width: this.$container.outerWidth(!1) + "px" };
                  this.options.get("dropdownAutoWidth") &&
                    ((a.minWidth = a.width),
                    (a.position = "relative"),
                    (a.width = "auto")),
                    this.$dropdown.css(a);
                }),
                (a.prototype._showDropdown = function (a) {
                  this.$dropdownContainer.appendTo(this.$dropdownParent),
                    this._positionDropdown(),
                    this._resizeDropdown();
                }),
                a
              );
            }
          ),
          a.define("select2/dropdown/minimumResultsForSearch", [], function () {
            function b(d) {
              for (var a = 0, c = 0; c < d.length; c++) {
                var e = d[c];
                e.children ? (a += b(e.children)) : a++;
              }
              return a;
            }
            function a(b, c, a, d) {
              (this.minimumResultsForSearch = a.get("minimumResultsForSearch")),
                this.minimumResultsForSearch < 0 &&
                  (this.minimumResultsForSearch = 1 / 0),
                b.call(this, c, a, d);
            }
            return (
              (a.prototype.showSearch = function (c, a) {
                return (
                  !(b(a.data.results) < this.minimumResultsForSearch) &&
                  c.call(this, a)
                );
              }),
              a
            );
          }),
          a.define("select2/dropdown/selectOnClose", [], function () {
            function a() {}
            return (
              (a.prototype.bind = function (b, a, c) {
                var d = this;
                b.call(this, a, c),
                  a.on("close", function (a) {
                    d._handleSelectOnClose(a);
                  });
              }),
              (a.prototype._handleSelectOnClose = function (_, b) {
                if (b && null != b.originalSelect2Event) {
                  var c = b.originalSelect2Event;
                  if ("select" === c._type || "unselect" === c._type) return;
                }
                var d = this.getHighlightedResults();
                if (!(d.length < 1)) {
                  var a = d.data("data");
                  (null != a.element && a.element.selected) ||
                    (null == a.element && a.selected) ||
                    this.trigger("select", { data: a });
                }
              }),
              a
            );
          }),
          a.define("select2/dropdown/closeOnSelect", [], function () {
            function a() {}
            return (
              (a.prototype.bind = function (b, a, c) {
                var d = this;
                b.call(this, a, c),
                  a.on("select", function (a) {
                    d._selectTriggered(a);
                  }),
                  a.on("unselect", function (a) {
                    d._selectTriggered(a);
                  });
              }),
              (a.prototype._selectTriggered = function (_, b) {
                var a = b.originalEvent;
                (a && a.ctrlKey) ||
                  this.trigger("close", {
                    originalEvent: a,
                    originalSelect2Event: b,
                  });
              }),
              a
            );
          }),
          a.define("select2/i18n/en", [], function () {
            return {
              errorLoading: function () {
                return "The results could not be loaded.";
              },
              inputTooLong: function (a) {
                var b = a.input.length - a.maximum,
                  c = "Please delete " + b + " character";
                return 1 != b && (c += "s"), c;
              },
              inputTooShort: function (a) {
                return (
                  "Please enter " +
                  (a.minimum - a.input.length) +
                  " or more characters"
                );
              },
              loadingMore: function () {
                return "Loading more results\u2026";
              },
              maximumSelected: function (a) {
                var b = "You can only select " + a.maximum + " item";
                return 1 != a.maximum && (b += "s"), b;
              },
              noResults: function () {
                return "No results found";
              },
              searching: function () {
                return "Searching\u2026";
              },
            };
          }),
          a.define(
            "select2/defaults",
            [
              "jquery",
              "require",
              "./results",
              "./selection/single",
              "./selection/multiple",
              "./selection/placeholder",
              "./selection/allowClear",
              "./selection/search",
              "./selection/eventRelay",
              "./utils",
              "./translation",
              "./diacritics",
              "./data/select",
              "./data/array",
              "./data/ajax",
              "./data/tags",
              "./data/tokenizer",
              "./data/minimumInputLength",
              "./data/maximumInputLength",
              "./data/maximumSelectionLength",
              "./dropdown",
              "./dropdown/search",
              "./dropdown/hidePlaceholder",
              "./dropdown/infiniteScroll",
              "./dropdown/attachBody",
              "./dropdown/minimumResultsForSearch",
              "./dropdown/selectOnClose",
              "./dropdown/closeOnSelect",
              "./i18n/en",
            ],
            function (
              $,
              b,
              c,
              d,
              e,
              f,
              g,
              h,
              i,
              j,
              k,
              l,
              m,
              n,
              o,
              p,
              q,
              r,
              s,
              t,
              u,
              v,
              w,
              x,
              y,
              z,
              A,
              B,
              C
            ) {
              function a() {
                this.reset();
              }
              return (
                (a.prototype.apply = function (a) {
                  if (
                    null == (a = $.extend(!0, {}, this.defaults, a)).dataAdapter
                  ) {
                    if (
                      (null != a.ajax
                        ? (a.dataAdapter = o)
                        : null != a.data
                        ? (a.dataAdapter = n)
                        : (a.dataAdapter = m),
                      a.minimumInputLength > 0 &&
                        (a.dataAdapter = j.Decorate(a.dataAdapter, r)),
                      a.maximumInputLength > 0 &&
                        (a.dataAdapter = j.Decorate(a.dataAdapter, s)),
                      a.maximumSelectionLength > 0 &&
                        (a.dataAdapter = j.Decorate(a.dataAdapter, t)),
                      a.tags && (a.dataAdapter = j.Decorate(a.dataAdapter, p)),
                      (null != a.tokenSeparators || null != a.tokenizer) &&
                        (a.dataAdapter = j.Decorate(a.dataAdapter, q)),
                      null != a.query)
                    ) {
                      var H = b(a.amdBase + "compat/query");
                      a.dataAdapter = j.Decorate(a.dataAdapter, H);
                    }
                    if (null != a.initSelection) {
                      var I = b(a.amdBase + "compat/initSelection");
                      a.dataAdapter = j.Decorate(a.dataAdapter, I);
                    }
                  }
                  if (
                    (null == a.resultsAdapter &&
                      ((a.resultsAdapter = c),
                      null != a.ajax &&
                        (a.resultsAdapter = j.Decorate(a.resultsAdapter, x)),
                      null != a.placeholder &&
                        (a.resultsAdapter = j.Decorate(a.resultsAdapter, w)),
                      a.selectOnClose &&
                        (a.resultsAdapter = j.Decorate(a.resultsAdapter, A))),
                    null == a.dropdownAdapter)
                  ) {
                    if (a.multiple) a.dropdownAdapter = u;
                    else {
                      var J = j.Decorate(u, v);
                      a.dropdownAdapter = J;
                    }
                    if (
                      (0 !== a.minimumResultsForSearch &&
                        (a.dropdownAdapter = j.Decorate(a.dropdownAdapter, z)),
                      a.closeOnSelect &&
                        (a.dropdownAdapter = j.Decorate(a.dropdownAdapter, B)),
                      null != a.dropdownCssClass ||
                        null != a.dropdownCss ||
                        null != a.adaptDropdownCssClass)
                    ) {
                      var K = b(a.amdBase + "compat/dropdownCss");
                      a.dropdownAdapter = j.Decorate(a.dropdownAdapter, K);
                    }
                    a.dropdownAdapter = j.Decorate(a.dropdownAdapter, y);
                  }
                  if (null == a.selectionAdapter) {
                    if (
                      (a.multiple
                        ? (a.selectionAdapter = e)
                        : (a.selectionAdapter = d),
                      null != a.placeholder &&
                        (a.selectionAdapter = j.Decorate(
                          a.selectionAdapter,
                          f
                        )),
                      a.allowClear &&
                        (a.selectionAdapter = j.Decorate(
                          a.selectionAdapter,
                          g
                        )),
                      a.multiple &&
                        (a.selectionAdapter = j.Decorate(
                          a.selectionAdapter,
                          h
                        )),
                      null != a.containerCssClass ||
                        null != a.containerCss ||
                        null != a.adaptContainerCssClass)
                    ) {
                      var L = b(a.amdBase + "compat/containerCss");
                      a.selectionAdapter = j.Decorate(a.selectionAdapter, L);
                    }
                    a.selectionAdapter = j.Decorate(a.selectionAdapter, i);
                  }
                  if ("string" == typeof a.language) {
                    if (a.language.indexOf("-") > 0) {
                      var M = a.language.split("-")[0];
                      a.language = [a.language, M];
                    } else a.language = [a.language];
                  }
                  if ($.isArray(a.language)) {
                    var E = new k();
                    a.language.push("en");
                    for (var F = a.language, C = 0; C < F.length; C++) {
                      var l = F[C],
                        D = {};
                      try {
                        D = k.loadPath(l);
                      } catch (O) {
                        try {
                          (l = this.defaults.amdLanguageBase + l),
                            (D = k.loadPath(l));
                        } catch (P) {
                          a.debug &&
                            window.console &&
                            console.warn &&
                            console.warn(
                              'Select2: The language file for "' +
                                l +
                                '" could not be automatically loaded. A fallback will be used instead.'
                            );
                          continue;
                        }
                      }
                      E.extend(D);
                    }
                    a.translations = E;
                  } else {
                    var N = k.loadPath(this.defaults.amdLanguageBase + "en"),
                      G = new k(a.language);
                    G.extend(N), (a.translations = G);
                  }
                  return a;
                }),
                (a.prototype.reset = function () {
                  function b(a) {
                    return a.replace(/[^\u0000-\u007E]/g, function (a) {
                      return l[a] || a;
                    });
                  }
                  function a(d, c) {
                    if ("" === $.trim(d.term)) return c;
                    if (c.children && c.children.length > 0) {
                      for (
                        var e = $.extend(!0, {}, c), f = c.children.length - 1;
                        f >= 0;
                        f--
                      )
                        null == a(d, c.children[f]) && e.children.splice(f, 1);
                      return e.children.length > 0 ? e : a(d, e);
                    }
                    var g = b(c.text).toUpperCase(),
                      h = b(d.term).toUpperCase();
                    return g.indexOf(h) > -1 ? c : null;
                  }
                  this.defaults = {
                    amdBase: "./",
                    amdLanguageBase: "./i18n/",
                    closeOnSelect: !0,
                    debug: !1,
                    dropdownAutoWidth: !1,
                    escapeMarkup: j.escapeMarkup,
                    language: C,
                    matcher: a,
                    minimumInputLength: 0,
                    maximumInputLength: 0,
                    maximumSelectionLength: 0,
                    minimumResultsForSearch: 0,
                    selectOnClose: !1,
                    sorter: function (a) {
                      return a;
                    },
                    templateResult: function (a) {
                      return a.text;
                    },
                    templateSelection: function (a) {
                      return a.text;
                    },
                    theme: "default",
                    width: "resolve",
                  };
                }),
                (a.prototype.set = function (b, c) {
                  var d = $.camelCase(b),
                    a = {};
                  a[d] = c;
                  var e = j._convertData(a);
                  $.extend(this.defaults, e);
                }),
                new a()
              );
            }
          ),
          a.define(
            "select2/options",
            ["require", "jquery", "./defaults", "./utils"],
            function (b, $, c, d) {
              function a(e, a) {
                if (
                  ((this.options = e),
                  null != a && this.fromElement(a),
                  (this.options = c.apply(this.options)),
                  a && a.is("input"))
                ) {
                  var f = b(this.get("amdBase") + "compat/inputData");
                  this.options.dataAdapter = d.Decorate(
                    this.options.dataAdapter,
                    f
                  );
                }
              }
              return (
                (a.prototype.fromElement = function (a) {
                  var f = ["select2"];
                  null == this.options.multiple &&
                    (this.options.multiple = a.prop("multiple")),
                    null == this.options.disabled &&
                      (this.options.disabled = a.prop("disabled")),
                    null == this.options.language &&
                      (a.prop("lang")
                        ? (this.options.language = a.prop("lang").toLowerCase())
                        : a.closest("[lang]").prop("lang") &&
                          (this.options.language = a
                            .closest("[lang]")
                            .prop("lang"))),
                    null == this.options.dir &&
                      (a.prop("dir")
                        ? (this.options.dir = a.prop("dir"))
                        : a.closest("[dir]").prop("dir")
                        ? (this.options.dir = a.closest("[dir]").prop("dir"))
                        : (this.options.dir = "ltr")),
                    a.prop("disabled", this.options.disabled),
                    a.prop("multiple", this.options.multiple),
                    a.data("select2Tags") &&
                      (this.options.debug &&
                        window.console &&
                        console.warn &&
                        console.warn(
                          'Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'
                        ),
                      a.data("data", a.data("select2Tags")),
                      a.data("tags", !0)),
                    a.data("ajaxUrl") &&
                      (this.options.debug &&
                        window.console &&
                        console.warn &&
                        console.warn(
                          "Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."
                        ),
                      a.attr("ajax--url", a.data("ajaxUrl")),
                      a.data("ajax--url", a.data("ajaxUrl")));
                  var e = {};
                  e =
                    $.fn.jquery &&
                    "1." == $.fn.jquery.substr(0, 2) &&
                    a[0].dataset
                      ? $.extend(!0, {}, a[0].dataset, a.data())
                      : a.data();
                  var c = $.extend(!0, {}, e);
                  for (var b in (c = d._convertData(c)))
                    $.inArray(b, f) > -1 ||
                      ($.isPlainObject(this.options[b])
                        ? $.extend(this.options[b], c[b])
                        : (this.options[b] = c[b]));
                  return this;
                }),
                (a.prototype.get = function (a) {
                  return this.options[a];
                }),
                (a.prototype.set = function (a, b) {
                  this.options[a] = b;
                }),
                a
              );
            }
          ),
          a.define(
            "select2/core",
            ["jquery", "./options", "./utils", "./keys"],
            function ($, c, b, d) {
              var a = function (b, d) {
                null != b.data("select2") && b.data("select2").destroy(),
                  (this.$element = b),
                  (this.id = this._generateId(b)),
                  (d = d || {}),
                  (this.options = new c(d, b)),
                  a.__super__.constructor.call(this);
                var f = b.attr("tabindex") || 0;
                b.data("old-tabindex", f), b.attr("tabindex", "-1");
                var g = this.options.get("dataAdapter");
                this.dataAdapter = new g(b, this.options);
                var e = this.render();
                this._placeContainer(e);
                var h = this.options.get("selectionAdapter");
                (this.selection = new h(b, this.options)),
                  (this.$selection = this.selection.render()),
                  this.selection.position(this.$selection, e);
                var i = this.options.get("dropdownAdapter");
                (this.dropdown = new i(b, this.options)),
                  (this.$dropdown = this.dropdown.render()),
                  this.dropdown.position(this.$dropdown, e);
                var j = this.options.get("resultsAdapter");
                (this.results = new j(b, this.options, this.dataAdapter)),
                  (this.$results = this.results.render()),
                  this.results.position(this.$results, this.$dropdown);
                var k = this;
                this._bindAdapters(),
                  this._registerDomEvents(),
                  this._registerDataEvents(),
                  this._registerSelectionEvents(),
                  this._registerDropdownEvents(),
                  this._registerResultsEvents(),
                  this._registerEvents(),
                  this.dataAdapter.current(function (a) {
                    k.trigger("selection:update", { data: a });
                  }),
                  b.addClass("select2-hidden-accessible"),
                  b.attr("aria-hidden", "true"),
                  this._syncAttributes(),
                  b.data("select2", this);
              };
              return (
                b.Extend(a, b.Observable),
                (a.prototype._generateId = function (a) {
                  return (
                    "select2-" +
                    (null != a.attr("id")
                      ? a.attr("id")
                      : null != a.attr("name")
                      ? a.attr("name") + "-" + b.generateChars(2)
                      : b.generateChars(4)
                    ).replace(/(:|\.|\[|\]|,)/g, "")
                  );
                }),
                (a.prototype._placeContainer = function (a) {
                  a.insertAfter(this.$element);
                  var b = this._resolveWidth(
                    this.$element,
                    this.options.get("width")
                  );
                  null != b && a.css("width", b);
                }),
                (a.prototype._resolveWidth = function (a, b) {
                  var i =
                    /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;
                  if ("resolve" == b) {
                    var e = this._resolveWidth(a, "style");
                    return null != e ? e : this._resolveWidth(a, "element");
                  }
                  if ("element" == b) {
                    var f = a.outerWidth(!1);
                    return f <= 0 ? "auto" : f + "px";
                  }
                  if ("style" == b) {
                    var g = a.attr("style");
                    if ("string" != typeof g) return null;
                    for (
                      var h = g.split(";"), c = 0, j = h.length;
                      c < j;
                      c += 1
                    ) {
                      var d = h[c].replace(/\s/g, "").match(i);
                      if (null !== d && d.length >= 1) return d[1];
                    }
                    return null;
                  }
                  return b;
                }),
                (a.prototype._bindAdapters = function () {
                  this.dataAdapter.bind(this, this.$container),
                    this.selection.bind(this, this.$container),
                    this.dropdown.bind(this, this.$container),
                    this.results.bind(this, this.$container);
                }),
                (a.prototype._registerDomEvents = function () {
                  var a = this;
                  this.$element.on("change.select2", function () {
                    a.dataAdapter.current(function (b) {
                      a.trigger("selection:update", { data: b });
                    });
                  }),
                    this.$element.on("focus.select2", function (b) {
                      a.trigger("focus", b);
                    }),
                    (this._syncA = b.bind(this._syncAttributes, this)),
                    (this._syncS = b.bind(this._syncSubtree, this)),
                    this.$element[0].attachEvent &&
                      this.$element[0].attachEvent(
                        "onpropertychange",
                        this._syncA
                      );
                  var c =
                    window.MutationObserver ||
                    window.WebKitMutationObserver ||
                    window.MozMutationObserver;
                  null != c
                    ? ((this._observer = new c(function (b) {
                        $.each(b, a._syncA), $.each(b, a._syncS);
                      })),
                      this._observer.observe(this.$element[0], {
                        attributes: !0,
                        childList: !0,
                        subtree: !1,
                      }))
                    : this.$element[0].addEventListener &&
                      (this.$element[0].addEventListener(
                        "DOMAttrModified",
                        a._syncA,
                        !1
                      ),
                      this.$element[0].addEventListener(
                        "DOMNodeInserted",
                        a._syncS,
                        !1
                      ),
                      this.$element[0].addEventListener(
                        "DOMNodeRemoved",
                        a._syncS,
                        !1
                      ));
                }),
                (a.prototype._registerDataEvents = function () {
                  var a = this;
                  this.dataAdapter.on("*", function (b, c) {
                    a.trigger(b, c);
                  });
                }),
                (a.prototype._registerSelectionEvents = function () {
                  var a = this,
                    b = ["toggle", "focus"];
                  this.selection.on("toggle", function () {
                    a.toggleDropdown();
                  }),
                    this.selection.on("focus", function (b) {
                      a.focus(b);
                    }),
                    this.selection.on("*", function (c, d) {
                      -1 === $.inArray(c, b) && a.trigger(c, d);
                    });
                }),
                (a.prototype._registerDropdownEvents = function () {
                  var a = this;
                  this.dropdown.on("*", function (b, c) {
                    a.trigger(b, c);
                  });
                }),
                (a.prototype._registerResultsEvents = function () {
                  var a = this;
                  this.results.on("*", function (b, c) {
                    a.trigger(b, c);
                  });
                }),
                (a.prototype._registerEvents = function () {
                  var a = this;
                  this.on("open", function () {
                    a.$container.addClass("select2-container--open");
                  }),
                    this.on("close", function () {
                      a.$container.removeClass("select2-container--open");
                    }),
                    this.on("enable", function () {
                      a.$container.removeClass("select2-container--disabled");
                    }),
                    this.on("disable", function () {
                      a.$container.addClass("select2-container--disabled");
                    }),
                    this.on("blur", function () {
                      a.$container.removeClass("select2-container--focus");
                    }),
                    this.on("query", function (b) {
                      a.isOpen() || a.trigger("open", {}),
                        this.dataAdapter.query(b, function (c) {
                          a.trigger("results:all", { data: c, query: b });
                        });
                    }),
                    this.on("query:append", function (b) {
                      this.dataAdapter.query(b, function (c) {
                        a.trigger("results:append", { data: c, query: b });
                      });
                    }),
                    this.on("open", function () {
                      setTimeout(function () {
                        a.focusOnActiveElement();
                      }, 1);
                    }),
                    $(document).on("keydown", function (c) {
                      var b = c.which;
                      if (a.isOpen()) {
                        b === d.ESC || (b === d.UP && c.altKey)
                          ? (a.close(), c.preventDefault())
                          : b === d.ENTER || b === d.TAB
                          ? (a.trigger("results:select", {}),
                            c.preventDefault())
                          : b === d.SPACE && c.ctrlKey
                          ? (a.trigger("results:toggle", {}),
                            c.preventDefault())
                          : b === d.UP
                          ? (a.trigger("results:previous", {}),
                            c.preventDefault())
                          : b === d.DOWN &&
                            (a.trigger("results:next", {}), c.preventDefault());
                        var e = a.$dropdown.find(".select2-search__field");
                        e.length ||
                          (e = a.$container.find(".select2-search__field")),
                          b === d.DOWN || b === d.UP
                            ? a.focusOnActiveElement()
                            : (e.focus(),
                              setTimeout(function () {
                                a.focusOnActiveElement();
                              }, 1e3));
                      } else
                        a.hasFocus() &&
                          (b === d.ENTER || b === d.SPACE || b === d.DOWN) &&
                          (a.open(), c.preventDefault());
                    });
                }),
                (a.prototype.focusOnActiveElement = function () {
                  this.isOpen() &&
                    !b.isTouchscreen() &&
                    this.$results
                      .find("li.select2-results__option--highlighted")
                      .focus();
                }),
                (a.prototype._syncAttributes = function () {
                  this.options.set("disabled", this.$element.prop("disabled")),
                    this.options.get("disabled")
                      ? (this.isOpen() && this.close(),
                        this.trigger("disable", {}))
                      : this.trigger("enable", {});
                }),
                (a.prototype._syncSubtree = function (b, a) {
                  var c = !1,
                    e = this;
                  if (
                    !b ||
                    !b.target ||
                    "OPTION" === b.target.nodeName ||
                    "OPTGROUP" === b.target.nodeName
                  ) {
                    if (a) {
                      if (a.addedNodes && a.addedNodes.length > 0)
                        for (var d = 0; d < a.addedNodes.length; d++)
                          a.addedNodes[d].selected && (c = !0);
                      else
                        a.removedNodes && a.removedNodes.length > 0 && (c = !0);
                    } else c = !0;
                    c &&
                      this.dataAdapter.current(function (a) {
                        e.trigger("selection:update", { data: a });
                      });
                  }
                }),
                (a.prototype.trigger = function (c, b) {
                  var d = a.__super__.trigger,
                    e = {
                      open: "opening",
                      close: "closing",
                      select: "selecting",
                      unselect: "unselecting",
                    };
                  if ((void 0 === b && (b = {}), c in e)) {
                    var g = e[c],
                      f = { prevented: !1, name: c, args: b };
                    if ((d.call(this, g, f), f.prevented)) {
                      b.prevented = !0;
                      return;
                    }
                  }
                  d.call(this, c, b);
                }),
                (a.prototype.toggleDropdown = function () {
                  this.options.get("disabled") ||
                    (this.isOpen() ? this.close() : this.open());
                }),
                (a.prototype.open = function () {
                  this.isOpen() || this.trigger("query", {});
                }),
                (a.prototype.close = function () {
                  this.isOpen() && this.trigger("close", {});
                }),
                (a.prototype.isOpen = function () {
                  return this.$container.hasClass("select2-container--open");
                }),
                (a.prototype.hasFocus = function () {
                  return this.$container.hasClass("select2-container--focus");
                }),
                (a.prototype.focus = function (a) {
                  this.hasFocus() ||
                    (this.$container.addClass("select2-container--focus"),
                    this.trigger("focus", {}));
                }),
                (a.prototype.enable = function (a) {
                  this.options.get("debug") &&
                    window.console &&
                    console.warn &&
                    console.warn(
                      'Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'
                    ),
                    (null == a || 0 === a.length) && (a = [!0]);
                  var b = !a[0];
                  this.$element.prop("disabled", b);
                }),
                (a.prototype.data = function () {
                  this.options.get("debug") &&
                    arguments.length > 0 &&
                    window.console &&
                    console.warn &&
                    console.warn(
                      'Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.'
                    );
                  var a = [];
                  return (
                    this.dataAdapter.current(function (b) {
                      a = b;
                    }),
                    a
                  );
                }),
                (a.prototype.val = function (b) {
                  if (
                    (this.options.get("debug") &&
                      window.console &&
                      console.warn &&
                      console.warn(
                        'Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'
                      ),
                    null == b || 0 === b.length)
                  )
                    return this.$element.val();
                  var a = b[0];
                  $.isArray(a) &&
                    (a = $.map(a, function (a) {
                      return a.toString();
                    })),
                    this.$element.val(a).trigger("change");
                }),
                (a.prototype.destroy = function () {
                  this.$container.remove(),
                    this.$element[0].detachEvent &&
                      this.$element[0].detachEvent(
                        "onpropertychange",
                        this._syncA
                      ),
                    null != this._observer
                      ? (this._observer.disconnect(), (this._observer = null))
                      : this.$element[0].removeEventListener &&
                        (this.$element[0].removeEventListener(
                          "DOMAttrModified",
                          this._syncA,
                          !1
                        ),
                        this.$element[0].removeEventListener(
                          "DOMNodeInserted",
                          this._syncS,
                          !1
                        ),
                        this.$element[0].removeEventListener(
                          "DOMNodeRemoved",
                          this._syncS,
                          !1
                        )),
                    (this._syncA = null),
                    (this._syncS = null),
                    this.$element.off(".select2"),
                    this.$element.attr(
                      "tabindex",
                      this.$element.data("old-tabindex")
                    ),
                    this.$element.removeClass("select2-hidden-accessible"),
                    this.$element.attr("aria-hidden", "false"),
                    this.$element.removeData("select2"),
                    this.dataAdapter.destroy(),
                    this.selection.destroy(),
                    this.dropdown.destroy(),
                    this.results.destroy(),
                    (this.dataAdapter = null),
                    (this.selection = null),
                    (this.dropdown = null),
                    (this.results = null);
                }),
                (a.prototype.render = function () {
                  var a = $(
                    '<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>'
                  );
                  return (
                    a.attr("dir", this.options.get("dir")),
                    (this.$container = a),
                    this.$container.addClass(
                      "select2-container--" + this.options.get("theme")
                    ),
                    a.data("element", this.$element),
                    a
                  );
                }),
                a
              );
            }
          ),
          a.define("select2/compat/utils", ["jquery"], function ($) {
            return {
              syncCssClasses: function (b, c, e) {
                var a,
                  f,
                  d = [];
                (a = $.trim(b.attr("class"))) &&
                  $((a = "" + a).split(/\s+/)).each(function () {
                    0 === this.indexOf("select2-") && d.push(this);
                  }),
                  (a = $.trim(c.attr("class"))) &&
                    $((a = "" + a).split(/\s+/)).each(function () {
                      0 !== this.indexOf("select2-") &&
                        null != (f = e(this)) &&
                        d.push(f);
                    }),
                  b.attr("class", d.join(" "));
              },
            };
          }),
          a.define(
            "select2/compat/containerCss",
            ["jquery", "./utils"],
            function ($, b) {
              function c(a) {
                return null;
              }
              function a() {}
              return (
                (a.prototype.render = function (g) {
                  var e = g.call(this),
                    a = this.options.get("containerCssClass") || "";
                  $.isFunction(a) && (a = a(this.$element));
                  var d = this.options.get("adaptContainerCssClass");
                  if (((d = d || c), -1 !== a.indexOf(":all:"))) {
                    a = a.replace(":all:", "");
                    var h = d;
                    d = function (a) {
                      var b = h(a);
                      return null != b ? b + " " + a : a;
                    };
                  }
                  var f = this.options.get("containerCss") || {};
                  return (
                    $.isFunction(f) && (f = f(this.$element)),
                    b.syncCssClasses(e, this.$element, d),
                    e.css(f),
                    e.addClass(a),
                    e
                  );
                }),
                a
              );
            }
          ),
          a.define(
            "select2/compat/dropdownCss",
            ["jquery", "./utils"],
            function ($, b) {
              function c(a) {
                return null;
              }
              function a() {}
              return (
                (a.prototype.render = function (g) {
                  var e = g.call(this),
                    a = this.options.get("dropdownCssClass") || "";
                  $.isFunction(a) && (a = a(this.$element));
                  var d = this.options.get("adaptDropdownCssClass");
                  if (((d = d || c), -1 !== a.indexOf(":all:"))) {
                    a = a.replace(":all:", "");
                    var h = d;
                    d = function (a) {
                      var b = h(a);
                      return null != b ? b + " " + a : a;
                    };
                  }
                  var f = this.options.get("dropdownCss") || {};
                  return (
                    $.isFunction(f) && (f = f(this.$element)),
                    b.syncCssClasses(e, this.$element, d),
                    e.css(f),
                    e.addClass(a),
                    e
                  );
                }),
                a
              );
            }
          ),
          a.define("select2/compat/initSelection", ["jquery"], function ($) {
            function a(b, c, a) {
              a.get("debug") &&
                window.console &&
                console.warn &&
                console.warn(
                  "Select2: The `initSelection` option has been deprecated in favor of a custom data adapter that overrides the `current` method. This method is now called multiple times instead of a single time when the instance is initialized. Support will be removed for the `initSelection` option in future versions of Select2"
                ),
                (this.initSelection = a.get("initSelection")),
                (this._isInitialized = !1),
                b.call(this, c, a);
            }
            return (
              (a.prototype.current = function (a, b) {
                var c = this;
                if (this._isInitialized) {
                  a.call(this, b);
                  return;
                }
                this.initSelection.call(null, this.$element, function (a) {
                  (c._isInitialized = !0), $.isArray(a) || (a = [a]), b(a);
                });
              }),
              a
            );
          }),
          a.define("select2/compat/inputData", ["jquery"], function ($) {
            function a(c, b, a) {
              (this._currentData = []),
                (this._valueSeparator = a.get("valueSeparator") || ","),
                "hidden" === b.prop("type") &&
                  a.get("debug") &&
                  console &&
                  console.warn &&
                  console.warn(
                    "Select2: Using a hidden input with Select2 is no longer supported and may stop working in the future. It is recommended to use a `<select>` element instead."
                  ),
                c.call(this, b, a);
            }
            return (
              (a.prototype.current = function (_, c) {
                function d(a, c) {
                  var b = [];
                  return (
                    a.selected || -1 !== $.inArray(a.id, c)
                      ? ((a.selected = !0), b.push(a))
                      : (a.selected = !1),
                    a.children && b.push.apply(b, d(a.children, c)),
                    b
                  );
                }
                for (var a = [], b = 0; b < this._currentData.length; b++) {
                  var e = this._currentData[b];
                  a.push.apply(
                    a,
                    d(e, this.$element.val().split(this._valueSeparator))
                  );
                }
                c(a);
              }),
              (a.prototype.select = function (_, a) {
                if (this.options.get("multiple")) {
                  var b = this.$element.val();
                  (b += this._valueSeparator + a.id),
                    this.$element.val(b),
                    this.$element.trigger("change");
                } else
                  this.current(function (a) {
                    $.map(a, function (a) {
                      a.selected = !1;
                    });
                  }),
                    this.$element.val(a.id),
                    this.$element.trigger("change");
              }),
              (a.prototype.unselect = function (_, a) {
                var b = this;
                (a.selected = !1),
                  this.current(function (d) {
                    for (var e = [], c = 0; c < d.length; c++) {
                      var f = d[c];
                      a.id != f.id && e.push(f.id);
                    }
                    b.$element.val(e.join(b._valueSeparator)),
                      b.$element.trigger("change");
                  });
              }),
              (a.prototype.query = function (_, d, e) {
                for (var b = [], a = 0; a < this._currentData.length; a++) {
                  var f = this._currentData[a],
                    c = this.matches(d, f);
                  null !== c && b.push(c);
                }
                e({ results: b });
              }),
              (a.prototype.addOptions = function (_, a) {
                var b = $.map(a, function (a) {
                  return $.data(a[0], "data");
                });
                this._currentData.push.apply(this._currentData, b);
              }),
              a
            );
          }),
          a.define("select2/compat/matcher", ["jquery"], function ($) {
            return function (a) {
              return function (d, b) {
                var c = $.extend(!0, {}, b);
                if (null == d.term || "" === $.trim(d.term)) return c;
                if (b.children) {
                  for (var e = b.children.length - 1; e >= 0; e--) {
                    var f = b.children[e];
                    a(d.term, f.text, f) || c.children.splice(e, 1);
                  }
                  if (c.children.length > 0) return c;
                }
                return a(d.term, b.text, b) ? c : null;
              };
            };
          }),
          a.define("select2/compat/query", [], function () {
            function a(b, c, a) {
              a.get("debug") &&
                window.console &&
                console.warn &&
                console.warn(
                  "Select2: The `query` option has been deprecated in favor of a custom data adapter that overrides the `query` method. Support will be removed for the `query` option in future versions of Select2."
                ),
                b.call(this, c, a);
            }
            return (
              (a.prototype.query = function (_, a, b) {
                (a.callback = b), this.options.get("query").call(null, a);
              }),
              a
            );
          }),
          a.define("select2/dropdown/attachContainer", [], function () {
            function a(a, b, c) {
              a.call(this, b, c);
            }
            return (
              (a.prototype.position = function (c, a, b) {
                b.find(".dropdown-wrapper").append(a),
                  a.addClass("select2-dropdown--below"),
                  b.addClass("select2-container--below");
              }),
              a
            );
          }),
          a.define("select2/dropdown/stopPropagation", [], function () {
            function a() {}
            return (
              (a.prototype.bind = function (a, b, c) {
                a.call(this, b, c),
                  this.$dropdown.on(
                    "blur change click dblclick focus focusin focusout input keydown keyup keypress mousedown mouseenter mouseleave mousemove mouseover mouseup search touchend touchstart",
                    function (a) {
                      a.stopPropagation();
                    }
                  );
              }),
              a
            );
          }),
          a.define("select2/selection/stopPropagation", [], function () {
            function a() {}
            return (
              (a.prototype.bind = function (a, b, c) {
                a.call(this, b, c),
                  this.$selection.on(
                    "blur change click dblclick focus focusin focusout input keydown keyup keypress mousedown mouseenter mouseleave mousemove mouseover mouseup search touchend touchstart",
                    function (a) {
                      a.stopPropagation();
                    }
                  );
              }),
              a
            );
          }),
          (function (c) {
            "function" == typeof a.define && a.define.amd
              ? a.define("jquery-mousewheel", ["jquery"], c)
              : "object" == typeof exports
              ? (module.exports = c)
              : c(b);
          })(function ($) {
            var c,
              d,
              a = [
                "wheel",
                "mousewheel",
                "DOMMouseScroll",
                "MozMousePixelScroll",
              ],
              e =
                "onwheel" in document || document.documentMode >= 9
                  ? ["wheel"]
                  : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
              f = Array.prototype.slice;
            if ($.event.fixHooks)
              for (var b = a.length; b; )
                $.event.fixHooks[a[--b]] = $.event.mouseHooks;
            var g = ($.event.special.mousewheel = {
              version: "3.1.12",
              setup: function () {
                if (this.addEventListener)
                  for (var a = e.length; a; )
                    this.addEventListener(e[--a], h, !1);
                else this.onmousewheel = h;
                $.data(this, "mousewheel-line-height", g.getLineHeight(this)),
                  $.data(this, "mousewheel-page-height", g.getPageHeight(this));
              },
              teardown: function () {
                if (this.removeEventListener)
                  for (var a = e.length; a; )
                    this.removeEventListener(e[--a], h, !1);
                else this.onmousewheel = null;
                $.removeData(this, "mousewheel-line-height"),
                  $.removeData(this, "mousewheel-page-height");
              },
              getLineHeight: function (c) {
                var b = $(c),
                  a = b["offsetParent" in $.fn ? "offsetParent" : "parent"]();
                return (
                  a.length || (a = $("body")),
                  parseInt(a.css("fontSize"), 10) ||
                    parseInt(b.css("fontSize"), 10) ||
                    16
                );
              },
              getPageHeight: function (a) {
                return $(a).height();
              },
              settings: { adjustOldDeltas: !0, normalizeOffset: !0 },
            });
            function h(h) {
              var a = h || window.event,
                o = f.call(arguments, 1),
                k = 0,
                e = 0,
                b = 0,
                l = 0,
                p = 0,
                q = 0;
              if (
                (((h = $.event.fix(a)).type = "mousewheel"),
                "detail" in a && (b = -1 * a.detail),
                "wheelDelta" in a && (b = a.wheelDelta),
                "wheelDeltaY" in a && (b = a.wheelDeltaY),
                "wheelDeltaX" in a && (e = -1 * a.wheelDeltaX),
                "axis" in a &&
                  a.axis === a.HORIZONTAL_AXIS &&
                  ((e = -1 * b), (b = 0)),
                (k = 0 === b ? e : b),
                "deltaY" in a && (k = b = -1 * a.deltaY),
                "deltaX" in a && ((e = a.deltaX), 0 === b && (k = -1 * e)),
                0 !== b || 0 !== e)
              ) {
                if (1 === a.deltaMode) {
                  var m = $.data(this, "mousewheel-line-height");
                  (k *= m), (b *= m), (e *= m);
                } else if (2 === a.deltaMode) {
                  var n = $.data(this, "mousewheel-page-height");
                  (k *= n), (b *= n), (e *= n);
                }
                if (
                  ((l = Math.max(Math.abs(b), Math.abs(e))),
                  (!d || l < d) && ((d = l), j(a, l) && (d /= 40)),
                  j(a, l) && ((k /= 40), (e /= 40), (b /= 40)),
                  (k = Math[k >= 1 ? "floor" : "ceil"](k / d)),
                  (e = Math[e >= 1 ? "floor" : "ceil"](e / d)),
                  (b = Math[b >= 1 ? "floor" : "ceil"](b / d)),
                  g.settings.normalizeOffset && this.getBoundingClientRect)
                ) {
                  var r = this.getBoundingClientRect();
                  (p = h.clientX - r.left), (q = h.clientY - r.top);
                }
                return (
                  (h.deltaX = e),
                  (h.deltaY = b),
                  (h.deltaFactor = d),
                  (h.offsetX = p),
                  (h.offsetY = q),
                  (h.deltaMode = 0),
                  o.unshift(h, k, e, b),
                  c && clearTimeout(c),
                  (c = setTimeout(i, 200)),
                  ($.event.dispatch || $.event.handle).apply(this, o)
                );
              }
            }
            function i() {
              d = null;
            }
            function j(a, b) {
              return (
                g.settings.adjustOldDeltas &&
                "mousewheel" === a.type &&
                b % 120 == 0
              );
            }
            $.fn.extend({
              mousewheel: function (a) {
                return a
                  ? this.bind("mousewheel", a)
                  : this.trigger("mousewheel");
              },
              unmousewheel: function (a) {
                return this.unbind("mousewheel", a);
              },
            });
          }),
          a.define(
            "jquery.select2",
            [
              "jquery",
              "jquery-mousewheel",
              "./select2/core",
              "./select2/defaults",
            ],
            function ($, _, a, b) {
              if (null == $.fn.selectWoo) {
                var c = ["open", "close", "destroy"];
                $.fn.selectWoo = function (b) {
                  if ("object" == typeof (b = b || {}))
                    return (
                      this.each(function () {
                        var c = $.extend(!0, {}, b);
                        new a($(this), c);
                      }),
                      this
                    );
                  if ("string" == typeof b) {
                    var d,
                      e = Array.prototype.slice.call(arguments, 1);
                    return (this.each(function () {
                      var a = $(this).data("select2");
                      null == a &&
                        window.console &&
                        console.error &&
                        console.error(
                          "The select2('" +
                            b +
                            "') method was called on an element that is not using Select2."
                        ),
                        (d = a[b].apply(a, e));
                    }),
                    $.inArray(b, c) > -1)
                      ? this
                      : d;
                  }
                  throw new Error("Invalid arguments for Select2: " + b);
                };
              }
              return (
                null != $.fn.select2 &&
                  null != $.fn.select2.defaults &&
                  ($.fn.selectWoo.defaults = $.fn.select2.defaults),
                null == $.fn.selectWoo.defaults &&
                  ($.fn.selectWoo.defaults = b),
                ($.fn.select2 = $.fn.select2 || $.fn.selectWoo),
                a
              );
            }
          ),
          { define: a.define, require: a.require }
        );
      })(),
      c = a.require("jquery.select2");
    return (b.fn.select2.amd = a), (b.fn.selectWoo.amd = a), c;
  }),
  jQuery(function ($) {
    var a = window.awcpt_frontend_object.ajaxurl;
    function b(b, c, d) {
      $.post(a, b, function (a) {
        var b = a.sidebar_result_count,
          e = a.head_left_result_count,
          f = a.head_right_result_count;
        if (!0 == a.success) {
          var h = a.table_data,
            i = a.pagination,
            j = a.found_posts,
            g = a.offset;
          $(c).find(".awcpt-product-table tbody").html(h),
            $(c).find(".awcpt-pagination-wrap").html(i),
            $(c).find(".awcpt-loadmore-btn").attr("data-offset", g),
            g >= j
              ? $(c).find(".awcpt-loadmore-btn").hide()
              : $(c).find(".awcpt-loadmore-btn").show(),
            $(c).find(".awcpt-left-nav .awcpt-result-count").replaceWith(b),
            $(c)
              .find(".awcpt-head-left-nav .awcpt-result-count")
              .replaceWith(e),
            $(c)
              .find(".awcpt-head-right-nav .awcpt-result-count")
              .replaceWith(f);
        } else {
          var k = a.not_found_msg;
          $(c).find(".awcpt-product-table tbody").html(""),
            $(c).find(".awcpt-pagination-wrap").html(""),
            $(c).find(".awcpt-loadmore-btn").hide(),
            $(c).find(".awcpt-container").append(k),
            $(c).find(".awcpt-left-nav .awcpt-result-count").replaceWith(b),
            $(c)
              .find(".awcpt-head-left-nav .awcpt-result-count")
              .replaceWith(e),
            $(c)
              .find(".awcpt-head-right-nav .awcpt-result-count")
              .replaceWith(f);
        }
        $("body")
          .find(".variations_form")
          .each(function () {
            jQuery(this).wc_variation_form();
          }),
          $(c).find(".awcpt-ft-loader").hide(),
          window.history.pushState({ path: d }, "", d);
      });
    }
    function c(c, d) {
      for (var a = c.split("&"), b = a.length - 1; b >= 0; b--)
        -1 !== a[b].lastIndexOf(d, 0) && a.splice(b, 1);
      return decodeURIComponent(a.join("&"));
    }
    $(".awcpt-dropdown").selectWoo({
      minimumResultsForSearch: 15,
      dropdownCssClass: "awcpt-select2-dropdown",
    }),
      $(".awcpt-prdimage-lightbox").magnificPopup({
        type: "image",
        closeOnContentClick: !0,
        closeBtnInside: !0,
        closeMarkup:
          '<button title="%title%" type="button" class="awcpt-mfp-close">&#215;</button>',
        image: { verticalFit: !0 },
      }),
      $("body").on("change", ".awcpt-quantity", function (b) {
        var c = $(this).val(),
          a = $(this).parents("tr");
        $(a)
          .find("td")
          .each(function () {
            $(this).find(".add_to_cart_button").attr("data-quantity", c);
          });
      }),
      $("body").on("click", ".awcpt-action-btn", function (m) {
        var g = $(this).data("action"),
          b = $(this).attr("href");
        if (
          !["product_page", "product_page_newtab", "external_link"].includes(g)
        ) {
          m.preventDefault();
          var n = $(this),
            j = $(this).parents("tr"),
            d = $(j).data("id"),
            p = $(j).attr("data-cart-in"),
            c = 1,
            k = $(j).find(".awcpt-quantity").val();
          if ((k > 0 && (c = k), "cart_redirect" == g))
            (b = b + "?add-to-cart=" + d + "&quantity=" + c),
              (window.location.href = b);
          else if ("cart_checkout" == g)
            (b = b + "?add-to-cart=" + d + "&quantity=" + c),
              (window.location.href = b);
          else if ("cart_refresh" == g) {
            var h = window.location.href,
              i = h.split("?");
            if (i.length >= 2) {
              for (var e = i[1].split("&"), f = e.length - 1; f >= 0; f--)
                (-1 !== e[f].lastIndexOf("add-to-cart=", 0) ||
                  -1 !== e[f].lastIndexOf("quantity=", 0)) &&
                  e.splice(f, 1);
              var l = e.join("&");
              b =
                l.length > 0
                  ? (h = i[0] + "?" + l) +
                    "&add-to-cart=" +
                    d +
                    "&quantity=" +
                    c
                  : (h = i[0]) + "?add-to-cart=" + d + "&quantity=" + c;
            } else b = h + "?add-to-cart=" + d + "&quantity=" + c;
            window.location.href = b;
          } else {
            var o = { action: "awcpt_add_to_cart", product_id: d, quantity: c };
            $(n).removeClass("added").addClass("awcpt-btn-loading"),
              $.post(a, o, function (a) {
                if (a.error && a.product_url) {
                  window.location.href = a.product_url;
                  return;
                }
                $(document.body).trigger("added_to_cart", [
                  a.fragments,
                  a.cart_hash,
                  n,
                ]),
                  (p = parseInt(p) + parseInt(c)),
                  $(j).attr("data-cart-in", p),
                  $(n)
                    .find(".awcpt-cart-badge")
                    .text(p)
                    .removeClass("awcpt-cart-badge-hide"),
                  $(n).removeClass("awcpt-btn-loading");
              });
          }
        }
      }),
      $("body").on("change", ".awcpt-universal-checkbox", function () {
        var a = $(this).parents(".awcpt-container");
        $(this).is(":checked")
          ? ($(a).find(".awcpt-universal-checkbox").prop("checked", !0),
            $(a)
              .find(".awcpt-product-checkbox")
              .each(function () {
                $(this).is(":disabled") || $(this).prop("checked", !0);
              }))
          : ($(a).find(".awcpt-universal-checkbox").prop("checked", !1),
            $(a)
              .find(".awcpt-product-checkbox")
              .each(function () {
                $(this).is(":disabled") || $(this).prop("checked", !1);
              }));
      }),
      $("body").on("click", ".add-to-cart-all", function (d) {
        d.preventDefault();
        var b = $(this),
          e = $(b).parents(".awcpt-container"),
          c = [],
          g = 0;
        if (
          ($(e)
            .find(".awcpt-product-table tbody tr")
            .each(function () {
              var e = $(this).data("id");
              $(this).attr("data-cart-in");
              var f = !!$(this).find(".awcpt-product-checkbox").is(":checked");
              if (f) {
                var d = 1,
                  a = $(this).find(".awcpt-quantity").val();
                a = a ? parseInt(a) : 0;
                var b = $(this).find(".quantity input.qty").val();
                (b = b ? parseInt(b) : 0) > a && (a = b),
                  a > 0 && (d = a),
                  (g += d);
                var h = { product_id: e, quantity: d };
                c.push(h);
              }
            }),
          c.length > 0)
        ) {
          var f = { action: "awcpt_add_all_to_cart", cart_data: c };
          $(b).removeClass("added").addClass("awcpt-btn-loading"),
            $.post(a, f, function (a) {
              a.error ||
                ($(document.body).trigger("added_to_cart", [
                  a.fragments,
                  a.cart_hash,
                  b,
                ]),
                $(b).find(".awcpt-cart-all-badge").text(g),
                $(e)
                  .find(".awcpt-product-table tbody tr")
                  .each(function () {
                    for (
                      var d = $(this).data("id"),
                        b = parseInt($(this).attr("data-cart-in")),
                        a = 0;
                      a < c.length;
                      a++
                    )
                      c[a].product_id == d &&
                        ((b += c[a].quantity),
                        $(this).attr("data-cart-in", b),
                        $(this).find(".awcpt-cart-badge").text(b));
                  })),
                $(b).removeClass("awcpt-btn-loading");
            });
        }
      }),
      $("body").on("change", ".awcpt-filter-fld", function (q) {
        var g = $(this).data("type"),
          l = $(this).parents(".awcpt-filter"),
          h = "",
          d = $(this).parents(".awcpt-wrapper"),
          e = $(d).data("table-id");
        if (
          (($(d).find(".awcpt-ft-loader").show(),
          $(d).find(".awcpt-product-found-msg").remove(),
          $(this).hasClass("awcpt-filter-checkbox"))
            ? $(l)
                .find(".awcpt-filter-checkbox")
                .each(function () {
                  $(this).is(":checked") &&
                    (h = "" != h ? h + "," + $(this).val() : $(this).val());
                })
            : (h = $(this).hasClass("awcpt-multi-select")
                ? $(this).val().join(",")
                : $(this).val()),
          "availability" == g)
        )
          var a = e + "_stock_status";
        else if ("category" == g) var a = e + "_categories";
        else if ("onsale" == g) var a = e + "_onsale";
        else if ("price" == g) var a = e + "_price_range";
        else if ("rating" == g) var a = e + "_rated";
        else if ("results_per_page" == g) {
          var a = e + "_results_per_page";
          $(d).find(".awcpt-loadmore-btn").attr("data-offset", h);
        } else if ("order_by" == g) var a = e + "_order_by";
        else var a = "";
        var m = $(d).find(".awcpt-product-table").attr("data-pagination"),
          n = $(d).find(".awcpt-product-table").attr("data-ajax-pagination"),
          o = $(d).find(".awcpt-product-table").attr("data-loadmore"),
          p = $(d)
            .find(".awcpt-pagination-wrap .awcpt-pagination .current")
            .text();
        parseInt(
          $(d)
            .find(".awcpt-loadmore-btn-wrapper .awcpt-loadmore-btn")
            .attr("data-offset")
        );
        var i = window.location.href,
          j = i.split("?"),
          k = j[0],
          f = j.length >= 2 ? c(j[1], a) : "";
        (f = "" != f ? f + "&" + a + "=" + h : a + "=" + h),
          (i = "" != h ? k + "?" + f : "" != (f = c(f, a)) ? k + "?" + f : k),
          ("on" == m && "on" == n) || "on" == o
            ? b(
                {
                  action: "awcpt_filter",
                  table_id: e,
                  page_number: p,
                  query_string: f,
                },
                d,
                i
              )
            : (window.location.href = i);
      }),
      $("body").on("click", ".awcpt-price-range-btn", function (n) {
        n.preventDefault();
        var j = $(this).parents(".awcpt-price-range-wrap"),
          a = $(this).parents(".awcpt-wrapper"),
          k = $(a).data("table-id");
        $(a).find(".awcpt-ft-loader").show(),
          $(a).find(".awcpt-product-found-msg").remove();
        var l = $(j).find(".awcpt-price-input-min").val(),
          m = $(j).find(".awcpt-price-input-max").val(),
          e = "";
        "" != l && "" != m && (e = l + "-" + m);
        var f = k + "_price_range",
          o = $(a).find(".awcpt-product-table").attr("data-pagination"),
          p = $(a).find(".awcpt-product-table").attr("data-ajax-pagination"),
          q = $(a).find(".awcpt-product-table").attr("data-loadmore"),
          r = $(a)
            .find(".awcpt-pagination-wrap .awcpt-pagination .current")
            .text();
        parseInt(
          $(a)
            .find(".awcpt-loadmore-btn-wrapper .awcpt-loadmore-btn")
            .attr("data-offset")
        );
        var g = window.location.href,
          h = g.split("?"),
          i = h[0],
          d = h.length >= 2 ? c(h[1], f) : "";
        (d = "" != d ? d + "&" + f + "=" + e : f + "=" + e),
          (g = "" != e ? i + "?" + d : "" != (d = c(d, f)) ? i + "?" + d : i),
          ("on" == o && "on" == p) || "on" == q
            ? b(
                {
                  action: "awcpt_filter",
                  table_id: k,
                  page_number: r,
                  query_string: d,
                },
                a,
                g
              )
            : (window.location.href = g);
      }),
      $("body").on("click", ".awcpt-search-submit", function (j) {
        j.preventDefault();
        var f = $(this)
            .parents(".awcpt-search-wrapper")
            .find(".awcpt-search-input")
            .val(),
          a = $(this).parents(".awcpt-wrapper"),
          i = $(a).data("table-id");
        $(a).find(".awcpt-ft-loader").show(),
          $(a).find(".awcpt-product-found-msg").remove();
        var k = $(a).find(".awcpt-product-table").attr("data-pagination"),
          l = $(a).find(".awcpt-product-table").attr("data-ajax-pagination"),
          m = $(a).find(".awcpt-product-table").attr("data-loadmore"),
          n = $(a)
            .find(".awcpt-pagination-wrap .awcpt-pagination .current")
            .text();
        parseInt(
          $(a)
            .find(".awcpt-loadmore-btn-wrapper .awcpt-loadmore-btn")
            .attr("data-offset")
        );
        var d = window.location.href,
          g = d.split("?"),
          o = g[0],
          h = i + "_search",
          e = g.length >= 2 ? c(g[1], h) : "";
        if ("" != f) {
          d = o + "?" + (e = "" != e ? e + "&" + h + "=" + f : h + "=" + f);
          var p = {
            action: "awcpt_filter",
            table_id: i,
            page_number: n,
            query_string: e,
          };
          ("on" == k && "on" == l) || "on" == m
            ? b(p, a, d)
            : (window.location.href = d),
            $(a).find(".awcpt-search-clear").show();
        } else $(a).find(".awcpt-ft-loader").hide();
      }),
      $("body").on("click", ".awcpt-search-clear", function (m) {
        var a = $(this).parents(".awcpt-wrapper"),
          g = $(a).data("table-id");
        $(a).find(".awcpt-ft-loader").show(),
          $(a).find(".awcpt-product-found-msg").remove();
        var i = $(a).find(".awcpt-product-table").attr("data-pagination"),
          j = $(a).find(".awcpt-product-table").attr("data-ajax-pagination"),
          k = $(a).find(".awcpt-product-table").attr("data-loadmore"),
          l = $(a)
            .find(".awcpt-pagination-wrap .awcpt-pagination .current")
            .text(),
          d = window.location.href,
          e = d.split("?"),
          h = e[0],
          f = e.length >= 2 ? c(e[1], g + "_search") : "";
        (d = "" != f ? h + "?" + f : h),
          ("on" == i && "on" == j) || "on" == k
            ? ($(a).find(".awcpt-search-input").val(""),
              $(a).find(".awcpt-search-clear").hide(),
              b(
                {
                  action: "awcpt_filter",
                  table_id: g,
                  page_number: l,
                  query_string: f,
                },
                a,
                d
              ))
            : (window.location.href = d);
      }),
      $("body").on("click", ".awcpt-clear-filter", function (m) {
        m.preventDefault();
        var a = $(this).parents(".awcpt-wrapper"),
          h = $(a).data("table-id");
        $(a).find(".awcpt-ft-loader").show(),
          $(a).find(".awcpt-product-found-msg").remove();
        for (
          var n = $(a).find(".awcpt-product-table").attr("data-pagination"),
            o = $(a).find(".awcpt-product-table").attr("data-ajax-pagination"),
            p = $(a).find(".awcpt-product-table").attr("data-loadmore"),
            q = $(a)
              .find(".awcpt-pagination-wrap .awcpt-pagination .current")
              .text(),
            d = window.location.href,
            f = d.split("?"),
            i = f[0],
            j = f.length >= 2 ? f[1] : "",
            k = [
              "order_by",
              "results_per_page",
              "categories",
              "price_range",
              "stock_status",
              "onsale",
              "rated",
              "search",
            ],
            c = j.split("&"),
            e = c.length - 1;
          e >= 0;
          e--
        )
          for (var r = c[e], l = "", g = 0; g < k.length; g++)
            (l = h + "_" + k[g]), -1 !== r.lastIndexOf(l, 0) && c.splice(e, 1);
        (d = "" != c ? i + "?" + (j = c.join("&")) : i),
          ("on" == n && "on" == o) || "on" == p
            ? ($(a)
                .find(".awcpt-filter-radio, .awcpt-filter-checkbox")
                .each(function () {
                  $(this).prop("checked", !1);
                }),
              $(a)
                .find(".awcpt-dropdown")
                .each(function () {
                  $(this).hasClass("awcpt-multi-select")
                    ? $(this).val(null)
                    : $(this).prop("selectedIndex", 0);
                }),
              $(a).find(".awcpt-dropdown").select2("destroy"),
              $(a).find(".awcpt-dropdown").selectWoo({
                minimumResultsForSearch: 15,
                dropdownCssClass: "awcpt-select2-dropdown",
              }),
              $(a)
                .find(
                  ".awcpt-nav input[type=text], .awcpt-nav input[type=number], .awcpt-nav input[type=search]"
                )
                .val(""),
              $(a).find(".awcpt-search-clear").hide(),
              b(
                {
                  action: "awcpt_filter",
                  table_id: h,
                  page_number: q,
                  query_string: "",
                },
                a,
                d
              ))
            : (window.location.href = d);
      }),
      $("body").on("click", ".awcpt-pagination a.page-numbers", function (l) {
        l.preventDefault();
        var g = $(this).parents(".awcpt-pagination"),
          d = $(this).parents(".awcpt-wrapper"),
          k = $(d).data("table-id"),
          a = "";
        if ($(this).hasClass("next")) {
          var h = parseInt($(g).find(".current").text());
          a = h + 1;
        } else if ($(this).hasClass("prev")) {
          var h = parseInt($(g).find(".current").text());
          a = h - 1;
        } else a = $(this).text();
        var e = window.location.href,
          i = e.split("?"),
          m = i[0],
          j = k + "_paged",
          f = i.length >= 2 ? c(i[1], j) : "";
        if (
          ("" != a &&
            (e = m + "?" + (f = "" != f ? f + "&" + j + "=" + a : j + "=" + a)),
          $(g).hasClass("awcpt-ajax-pagination"))
        ) {
          if (
            ($(d).find(".awcpt-ft-loader").show(),
            $(d).find(".awcpt-product-found-msg").remove(),
            "" != a)
          ) {
            var n = {
              action: "awcpt_filter",
              table_id: k,
              page_number: a,
              query_string: f,
            };
            b(n, d, e);
          } else $(d).find(".awcpt-ft-loader").hide();
        } else window.location.href = e;
      }),
      $("body").on("click", ".awcpt-loadmore-btn", function (d) {
        d.preventDefault();
        var e = parseInt($(this).attr("data-offset")),
          b = $(this).parents(".awcpt-wrapper"),
          f = $(b).data("table-id");
        $(b).find(".awcpt-ft-loader").show();
        var g = window.location.href,
          c = g.split("?"),
          h = c.length >= 2 ? c[1] : "";
        $.post(
          a,
          {
            action: "awcpt_filter",
            table_id: f,
            query_string: h,
            offset: e,
            loadmore_click: !0,
          },
          function (a) {
            var c = a.sidebar_result_count,
              d = a.head_left_result_count,
              f = a.head_right_result_count;
            if (!0 == a.success) {
              var g = a.table_data;
              e = a.offset;
              var h = a.found_posts;
              $(b).find(".awcpt-product-table tbody").append(g),
                $(b).find(".awcpt-loadmore-btn").attr("data-offset", e),
                e >= h && $(b).find(".awcpt-loadmore-btn").hide(),
                $(b).find(".awcpt-left-nav .awcpt-result-count").replaceWith(c),
                $(b)
                  .find(".awcpt-head-left-nav .awcpt-result-count")
                  .replaceWith(d),
                $(b)
                  .find(".awcpt-head-right-nav .awcpt-result-count")
                  .replaceWith(f);
            }
            $(b).find(".awcpt-ft-loader").hide();
          }
        );
      }),
    
    $(".awcpt-left-nav .awcpt-filter-row-heading").on("click", function () {
      var a = $(this).next(),
        b = $(this);
      $(this).hasClass("awcpt-accordion-close")
        ? (b.removeClass("awcpt-accordion-close"), a.slideDown())
        : (b.addClass("awcpt-accordion-close"), a.slideUp());
    }),
      $("body").on("click", ".remove_from_cart_button", function (a) {
        a.preventDefault();
        var b = parseInt($(this).attr("data-product_id")),
          c = "";
        $("body")
          .find(".awcpt-product-table")
          .each(function () {
            $(this)
              .find("> tbody > tr")
              .each(function () {
                (c = parseInt($(this).attr("data-id"))) == b &&
                  ($(this).attr("data-cart-in", 0),
                  $(this)
                    .find("> td")
                    .each(function () {
                      $(this)
                        .find(".awcpt-action-btn .awcpt-cart-badge")
                        .text(0)
                        .addClass("awcpt-cart-badge-hide");
                    }));
              });
          });
      });
  });

(function ($) {
  $(".variations_form.cart").on("show_variation", function (event, variation) {
    let product_id = event.currentTarget?.attributes["data-product_id"]?.value;
    let checkbox = document.getElementById(
      `awcpt-product-checkbox-0-${product_id}`
    );

    console.log(variation);

    checkbox.removeAttribute("disabled");
  });
})(jQuery);
