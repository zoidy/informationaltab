pref("extensions.informationaltab.thumbnail.enabled", true);
pref("extensions.informationaltab.thumbnail.partial", true);
pref("extensions.informationaltab.thumbnail.partial.maxPixels", 300);
pref("extensions.informationaltab.thumbnail.partial.maxPercentage", 50);
pref("extensions.informationaltab.thumbnail.partial.startX", 0);
pref("extensions.informationaltab.thumbnail.partial.startY", 0);
// [0][favicon][1][label][2][closebox], 301-303 is above, 401-403 is below, 501-503 is behind
pref("extensions.informationaltab.thumbnail.position", 1);
// 0 = fixed size, 1 = flexible size
pref("extensions.informationaltab.thumbnail.size_mode", 0);
pref("extensions.informationaltab.thumbnail.max",       45);
pref("extensions.informationaltab.thumbnail.pow",       20);
pref("extensions.informationaltab.thumbnail.update_delay", 50);
pref("extensions.informationaltab.thumbnail.update_all_delay", 500);
pref("extensions.informationaltab.thumbnail.fix_aspect_ratio", true);
pref("extensions.informationaltab.thumbnail.fixed_aspect_ratio", "0.75");
pref("extensions.informationaltab.thumbnail.animation", false);
pref("extensions.informationaltab.thumbnail.scrolled", true);

// 0 = only in status bar, 1 = only in each tab, 2 = both
pref("extensions.informationaltab.progress.mode", 1);
pref("extensions.informationaltab.progress.position", "top");
// default, lighting-green, lighting-blue
// pref("extensions.informationaltab.progress.style", "lighting-green");
pref("extensions.informationaltab.platform.default.progress.style", "default");
pref("extensions.informationaltab.platform.WINNT.progress.style", "lighting-green");
pref("extensions.informationaltab.platform.Darwin.progress.style", "lighting-green");
pref("extensions.informationaltab.platform.Linux.progress.style", "default");

pref("extensions.informationaltab.unread.enabled", true);
// 0 = just selected, 1 = scrolled
pref("extensions.informationaltab.unread.readMethod", 1);


pref("extensions.informationaltab.backup.browser.tabs.closeButtons", -1);
pref("extensions.informationaltab.backup.browser.tabs.tabClipWidth", -1);
pref("extensions.informationaltab.close_buttons.force_show", false);
// 0 = auto, 1 = always hide, 2 = always show
pref("extensions.informationaltab.close_buttons.force_show.last_tab", 0);


pref("extensions.informationaltab.restoring_backup_prefs", false);

pref("extensions.informationaltab.prefsVersion", 0);
