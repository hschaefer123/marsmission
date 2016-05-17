/*eslint node: true */
"use strict";

/**
 * Main method to be executed once SAPUI5 has been initialized.
 */
function main() {
    "use strict";
    
    // remove no-js class
	$("html").removeClass("no-js");

    // CacheBuster	
    if (window["openui5-timestamp"]) {
        window["openui5-cache-buster"] = new CacheBuster(
            window["openui5-timestamp"],
            [ "/" ]
        );
    }
	
    // device APIs are available
    function onDeviceReady() {
        jQuery.sap.initMobile({});
        
        var sIconPath = "mimes/icons/";
        jQuery.sap.setIcons({
           'phone': sIconPath + 'icon-57.png',
           'phone@2': sIconPath + 'icon-57-2x.png',
           'tablet': sIconPath + 'icon-72.png',
           'tablet@2': sIconPath + 'icon-72-2x.png',
           'favicon': sIconPath + 'icon.png',
           'precomposed': true
        });
        
        // create our application
        var bUseMockServer = false; // currently mockserver does not support web audio requests! 
        sap.ui.require([
            "de/uniorg/martian/localService/mockserver",
            "sap/ui/core/ComponentContainer"
        ], function (server, ComponentContainer) {
            // set up test service for local testing
            if (bUseMockServer) {
                // currently mockserver does not support web audio requests! 
                server.init();
            }
            // initialize the UI component
            new ComponentContainer("app", {
                height : "100%",
                name : "de.uniorg.martian"
            }).placeAt("root");
        });
    }
    
    // check if running inside SAP Fiori Client v1.2.4
    window["uniorg-ui-issapfioriclient"] = (location.search.indexOf("smphomebuster") !== -1);
    // handle SAP Fiori Client (native cordova app)
    if (window["uniorg-ui-issapfioriclient"]) {
        // on native client wait for device ready event from cordova/phonegap to call app
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        // on browser directly call app
        onDeviceReady();
    }
}