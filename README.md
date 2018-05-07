# Welcome to Mars Mission

This is the corresponsing repository for my [OpenUI5 Developer Blog](http://openui5.blogspot.com/2016/05/mars-mission-part-one.html)!

Online Demo (on SAP HCP)
https://marsmission-p1940953245trial.dispatcher.hanatrial.ondemand.com

Online Demo (on RawGit) with repo sources
[Development](https://rawgit.com/hschaefer123/marsmission/master/webapp/index.html)
[Production](https://cdn.rawgit.com/hschaefer123/marsmission/master/webapp/index.html) (delayed using CDN)

### Highlights

> - animated boot loading splash screen with transision into app.
> - custom cache buster to avoid issues on iOS Homescreen apps (sadly HCP does not support App CacheBuster).
> - animated star background with warp effect, stars are moving to side on router slides and on touch devices you can control starflow with motion sensor.
> - background sound playing with cancas web audio animation using spectrum analysis.
> - custom radial chart control using svg to display values the martian way.
> - embedding svg chart control from Alexander Graebe and expanding it a little bit ;-).
> - wavesurfer.js based sound player with speed change.
> - signature.js control to allow writing signature for testing my new apple pencil with export to image and svg. The control still has some resize issues i am working on.
> - using svg for icons

### Bugs / Issues
 
> - Using OData with the MockServer kills web audio! I think the mockserver manipulates XMLHTTPRequests and does not proper handle/prototype specific context-types. For this reason i made a fallback using a JSONModel instead till the bug is fixed [Ticket #989](https://github.com/SAP/openui5/issues/989).
> - performance on starfield needs to be better! need to spend some time on this.
> - need to dive deeper into ResizeHandler for custom controls.

### Things to come...
 
> - more inline code documentation ;-)
> - animated side panel to introduce user personalisation and app launcher.
> - animated signature path for svg in general
> - svg to inline svg util to be able to theme svg with css (should be a core feature of UI5!).
> - ...
