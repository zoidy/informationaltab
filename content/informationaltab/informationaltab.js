var InformationalTabService = { 
	PREFROOT : 'extensions.informationaltab@piro.sakura.ne.jp',

	POSITION_BEFORE_FAVICON  : 0,
	POSITION_BEFORE_LABEL    : 1,
	POSITION_BEFORE_CLOSEBOX : 2,
	 
/* Utilities */ 
	 
	get browser() 
	{
		return gBrowser;
	},
  
/* Initializing */ 
	 
	init : function() 
	{
		if (!('gBrowser' in window)) return;

		window.removeEventListener('load', this, false);

//		this.addPrefListener(this);
//		this.observe(null, 'nsPref:changed', 'extensions.informationaltab.tabdrag.mode');

		this.initTabBrowser(gBrowser);
	},
	 
	initTabBrowser : function(aTabBrowser) 
	{
		var addTabMethod = 'addTab';
		var removeTabMethod = 'removeTab';
		if (aTabBrowser.__tabextensions__addTab) {
			addTabMethod = '__tabextensions__addTab';
			removeTabMethod = '__tabextensions__removeTab';
		}

		var originalAddTab = aTabBrowser[addTabMethod];
		aTabBrowser[addTabMethod] = function() {
			var tab = originalAddTab.apply(this, arguments);
			try {
				InformationalTabService.initTab(tab);
			}
			catch(e) {
			}
			return tab;
		};

		var originalRemoveTab = aTabBrowser[removeTabMethod];
		aTabBrowser[removeTabMethod] = function(aTab) {
			InformationalTabService.destroyTab(aTab);
			var retVal = originalRemoveTab.apply(this, arguments);
			try {
				if (aTab.parentNode)
					InformationalTabService.initTab(aTab);
			}
			catch(e) {
			}
			return retVal;
		};

		var tabs = aTabBrowser.mTabContainer.childNodes;
		for (var i = 0, maxi = tabs.length; i < maxi; i++)
		{
			this.initTab(tabs[i]);
		}

		delete addTabMethod;
		delete removeTabMethod;
		delete i;
		delete maxi;
		delete tabs;
	},
 
	initTab : function(aTab) 
	{
		if (aTab.__informationaltab__progressListener) return;

		var filter = Components.classes['@mozilla.org/appshell/component/browser-status-filter;1'].createInstance(Components.interfaces.nsIWebProgress);
		var listener = new InformationalTabProgressListener(aTab, aTab.linkedBrowser);
		filter.addProgressListener(listener, Components.interfaces.nsIWebProgress.NOTIFY_ALL);
		aTab.linkedBrowser.webProgress.addProgressListener(filter, Components.interfaces.nsIWebProgress.NOTIFY_ALL);

		aTab.__informationaltab__progressListener = listener;
		aTab.__informationaltab__progressFilter   = filter;
return;

		var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
		var label  =  document.getAnonymousElementByAttribute(aTab, 'class', 'tab-text');

		switch(this.getPref('extensions.informationaltab.thumbnail.position'))
		{
			case this.POSITION_BEFORE_FAVICON:
				label.parentNode.insertBefore(canvas, label.parentNode.firstChild);
				break;

			case this.POSITION_BEFORE_LABEL:
				label.parentNode.insertBefore(canvas, label);
				break;

			case this.POSITION_BEFORE_CLOSEBOX:
				label.parentNode.appendChild(canvas);
				break;
		}


		aTab.__informationaltab__canvas = canvas;
	},
  
	destroy : function() 
	{
		this.destroyTabBrowser(gBrowser);

		window.removeEventListener('unload', this, false);

//		this.removePrefListener(this);

		var tabs = gBrowser.mTabContainer.childNodes;
		for (var i = 0, maxi = tabs.length; i < maxi; i++)
		{
			this.destroyTab(tabs[i]);
		}
	},
	 
	destroyTabBrowser : function(aTabBrowser) 
	{
	},
 
	destroyTab : function(aTab) 
	{
		try {
			aTab.linkedBrowser.webProgress.removeProgressListener(aTab.__informationaltab__progressFilter);
			aTab.cachedCanvas.progressFilter.removeProgressListener(aTab.__informationaltab__progressListener);
			delete aTab.__informationaltab__progressFilter;
			delete aTab.__informationaltab__progressListener;
		}
		catch(e) {
		}
	},
  	 
	updateThumbnail : function(aTab, aBrowser) 
	{
return;
		var canvas = aTab.__informationaltab__canvas;
		canvas.getContext('2d');
	},
 
/* Event Handling */ 
	 
	handleEvent : function(aEvent) 
	{
		switch (aEvent.type)
		{
			case 'load':
				this.init();
				break;

			case 'unload':
				this.destroy();
				break;
		}
	},
  
/* Pref Listener */ 
	 
	domain : 'extensions.informationaltab', 
 
	observe : function(aSubject, aTopic, aPrefName) 
	{
		if (aTopic != 'nsPref:changed') return;

		var value = this.getPref(aPrefName);
		switch (aPrefName)
		{
			case 'extensions.informationaltab.tabdrag.mode':
				this.tabDragMode = value;
				break;

			default:
				break;
		}
	},
  
/* Save/Load Prefs */ 
	 
	get Prefs() 
	{
		if (!this._Prefs) {
			this._Prefs = Components.classes['@mozilla.org/preferences;1'].getService(Components.interfaces.nsIPrefBranch);
		}
		return this._Prefs;
	},
	_Prefs : null,
 
	getPref : function(aPrefstring) 
	{
		try {
			switch (this.Prefs.getPrefType(aPrefstring))
			{
				case this.Prefs.PREF_STRING:
					return decodeURIComponent(escape(this.Prefs.getCharPref(aPrefstring)));
					break;
				case this.Prefs.PREF_INT:
					return this.Prefs.getIntPref(aPrefstring);
					break;
				default:
					return this.Prefs.getBoolPref(aPrefstring);
					break;
			}
		}
		catch(e) {
		}

		return null;
	},
 
	setPref : function(aPrefstring, aNewValue) 
	{
		var pref = this.Prefs ;
		var type;
		try {
			type = typeof aNewValue;
		}
		catch(e) {
			type = null;
		}

		switch (type)
		{
			case 'string':
				pref.setCharPref(aPrefstring, unescape(encodeURIComponent(aNewValue)));
				break;
			case 'number':
				pref.setIntPref(aPrefstring, parseInt(aNewValue));
				break;
			default:
				pref.setBoolPref(aPrefstring, aNewValue);
				break;
		}
		return true;
	},
 
	clearPref : function(aPrefstring) 
	{
		try {
			this.Prefs.clearUserPref(aPrefstring);
		}
		catch(e) {
		}

		return;
	},
 
	addPrefListener : function(aObserver) 
	{
		var domains = ('domains' in aObserver) ? aObserver.domains : [aObserver.domain] ;
		try {
			var pbi = this.Prefs.QueryInterface(Components.interfaces.nsIPrefBranchInternal);
			for (var i = 0; i < domains.length; i++)
				pbi.addObserver(domains[i], aObserver, false);
		}
		catch(e) {
		}
	},
 
	removePrefListener : function(aObserver) 
	{
		var domains = ('domains' in aObserver) ? aObserver.domains : [aObserver.domain] ;
		try {
			var pbi = this.Prefs.QueryInterface(Components.interfaces.nsIPrefBranchInternal);
			for (var i = 0; i < domains.length; i++)
				pbi.removeObserver(domains[i], aObserver, false);
		}
		catch(e) {
		}
	}
   
}; 

window.addEventListener('load', InformationalTabService, false);
window.addEventListener('unload', InformationalTabService, false);
 
function InformationalTabProgressListener(aTab, aBrowser) 
{
	this.mTab = aTab;
	this.mBrowser = aBrowser;
}
InformationalTabProgressListener.prototype = {
	mTab           : null,
	mBrowser       : null,
	onProgressChange: function (aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress)
	{
		if (aMaxTotalProgress < 1)
			return;

		var label = document.getAnonymousElementByAttribute(this.mTab, 'class', 'tab-text');

		var percentage = parseInt((aCurTotalProgress * 100) / aMaxTotalProgress);
		if (percentage > 0 && percentage < 100)
			label.setAttribute('informationaltab-progress', percentage);
		else if (percentage <= 0 || percentage >= 100)
			label.removeAttribute('informationaltab-progress');
	},
	onStateChange : function(aWebProgress, aRequest, aStateFlags, aStatus)
	{
		const nsIWebProgressListener = Components.interfaces.nsIWebProgressListener;
		if (
			aStateFlags & nsIWebProgressListener.STATE_STOP &&
			aStateFlags & nsIWebProgressListener.STATE_IS_NETWORK
			) {
			InformationalTab.updateThumbnail(this.mTab, this.mBrowser);
		}
	},
	onLocationChange : function(aWebProgress, aRequest, aLocation)
	{
	},
	onStatusChange : function(aWebProgress, aRequest, aStatus, aMessage)
	{
	},
	onSecurityChange : function(aWebProgress, aRequest, aState)
	{
	},
	QueryInterface : function(aIID)
	{
		if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
			aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
			aIID.equals(Components.interfaces.nsISupports))
			return this;
		throw Components.results.NS_NOINTERFACE;
	}

};
 
