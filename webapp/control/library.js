sap.ui.define([
    "jquery.sap.global", 
    "sap/ui/core/library", 
    "sap/ui/core/Core",
    "sap/m/library"], 
    function(jQuery, c, C, l) {
    "use strict";
    sap.ui.getCore().initLibrary({
        name: "de.uniorg.martian.control",
        version: "1.36.6",
        dependencies: ["sap.ui.core", "sap.m"],
        types: [],
        interfaces: [],
        controls: ["de.uniorg.martian.control.RadialMicroChart"],
        elements: []
    });
    return de.uniorg.martian.control;
});