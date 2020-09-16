var Pastease=function(){var SOCKET,URL_DETECTION,ID,TEST=!1,Base_url=document.location.protocol+"//deploy.mopinion.com",Cookie_pro_active_days=365,LOG=!1,STREAM=!1,TRIGGERS=["passive","proactive","exit"],SERVICES=["mopinion"],USE_$=!1,AJAX_$=!1,SEPARATE_COOKIES=!0,CHECK_JOB=!0,MOPINION_VERSION="1.3",MOPINION_FILE="survey.min",USE_COLLECT=!1,EXIT=!1,EXIT_ACTIVATED=!1,DEBUG=!1,REPARSERS={},ACTIVE_RULES={},LOADED_SERVICES=[],LOCAL_FILE=null;return{load:function(a){ID=a,Pastease.debug(),Pastease.log("loading Pastea.se "+a),USE_$&&Pastease.jquery(),STREAM&&(Pastease.socketio(),SOCKET=Pastease.socket()),Pastease.config(a)},config:function(a){var b="/config/"+a,c={},d=Pastease.parse,e="get";USE_$||AJAX_$?Pastease.send(b,c,d,e):Pastease.sendXML(b,c,d,e)},parse:function(a,b,c){try{a=JSON.parse(a)}catch(a){Pastease.log(a)}if(!a.OK)return Pastease.log("Status not OK!"),!1;if(a.code&&a.global&&(Pastease.log("Global settings:"),Pastease.log("service: "+a.global.service),Pastease.log("version: "+a.global.version),"mopinion"==a.global.service&&a.global.version&&(MOPINION_VERSION=a.global.version)),"code"in a&&200==a.code&&"deployment"in a&&"rules"in a.deployment)var d=a.deployment.rules;else{Pastease.log("code: "+a.code),Pastease.log(JSON.stringify(a)),ID="";var d=[];return!1}if("undefined"==typeof a||null==a||"published"in a.deployment&&!a.deployment.published)return Pastease.log("Not published!"),!1;if("version"in a.deployment&&(MOPINION_VERSION=a.deployment.version,Pastease.log("MOPINION VERSION customized to "+MOPINION_VERSION)),"file"in a.deployment&&(MOPINION_FILE=a.deployment.file,Pastease.log("MOPINION FILE customized to "+MOPINION_FILE)),"local_file"in a.deployment&&(LOCAL_FILE=a.deployment.local_file,Pastease.log("MOPINION FILE local: "+LOCAL_FILE)),"use_collect"in a.deployment&&(USE_COLLECT=a.deployment.use_collect,Pastease.log("Use collect as survey host "+USE_COLLECT)),0==d.length)return!1;for(var e=0;e<d.length;e++){if(Pastease.log("============================"),Pastease.log("---RULE "+e),Pastease.log(JSON.stringify(d[e])),!("if"in d[e])||!("then"in d[e]))return!1;if("id"in d[e]&&null!=d[e].id&&SEPARATE_COOKIES)var f=d[e].id;if(Pastease.log("RULE ID: "+f),"show_form"in d[e])var g=d[e].show_form;else var g=null;"debug"in d[e]&&d[e].debug&&(DEBUG=!0);for(var h=d[e]["if"],l=d[e].then,m=0;m<h.length;m++){Pastease.log("-----------------------"),Pastease.log("if rule "+m);var n=h[m];Pastease.log("condition: "+JSON.stringify(n));var o=!1,p=null;if("session"in n)try{p=+n.session}catch(a){}Pastease.log("Condition session "+p+" days");var q=Pastease.testCondition(n,m,f,c,l);q.condition&&(o=!0);for(var s,t=[],u=0;u<l.length;u++){if(s=l[u],!("service"in s)||!("args"in s))return!1;-1==LOADED_SERVICES.indexOf(s.service)&&o?(LOADED_SERVICES.push(s.service),t.push(Pastease.services(s))):-1<LOADED_SERVICES.indexOf(s.service)&&o&&"mopinion"==s.service&&t.push(Pastease.services(s,!0))}if(!o){var v=function(){};if(Pastease.log("not all OK..."),Pastease.log("Rule id: "+f+" not ok"),ACTIVE_RULES.hasOwnProperty(f)&&ACTIVE_RULES[f]["rule_"+m]&&(ACTIVE_RULES[f]["rule_"+m].hasOwnProperty("timeout")&&clearTimeout(ACTIVE_RULES[f]["rule_"+m].timeout),ACTIVE_RULES[f]["rule_"+m].hasOwnProperty("scroll")&&"function"==typeof ACTIVE_RULES[f]["rule_"+m].scroll&&Pastease.listeners().removeListener(window,"scroll",ACTIVE_RULES[f]["rule_"+m].scroll),ACTIVE_RULES[f]["rule_"+m].hasOwnProperty("exit")&&"function"==typeof ACTIVE_RULES[f]["rule_"+m].exit&&Pastease.listeners().removeListener(document.getElementsByTagName("html")[0],"mouseleave",ACTIVE_RULES[f]["rule_"+m].exit),(!ACTIVE_RULES[f]["rule_"+m].triggered||c)&&(delete ACTIVE_RULES[f]["rule_"+m],!Object.keys(ACTIVE_RULES[f]).length))){var w=!0;for(var y in ACTIVE_RULES){var x=ACTIVE_RULES[y];for(var r in x){var z=x[r];if(r!==f&&z.initialized&&!c){var A="";try{A=z.rules.then[0].args[0]}catch(a){}A==s.args[0]&&(w=!1)}}}w&&Pastease.clearService(s.service,s.args),delete ACTIVE_RULES[f]}}else if(!b||!ACTIVE_RULES.hasOwnProperty(f)){ACTIVE_RULES.hasOwnProperty(f)||(ACTIVE_RULES[f]={}),ACTIVE_RULES[f]["rule_"+m]={rules:d[e]},Pastease.log("All OK!");var v=function(){for(var b=0;b<t.length;b++)t[b](),Pastease.log("basic code: "+t[b]);var d=Pastease.triggers(s[["service"]],s.args,h[m].trigger,h[m].percentage,h[m].time,p,g,h[m].time_in_session,!1,f,h[m],a,"rule_"+m);d(),Pastease.log("trigger code: "+d),Pastease.log("triggered!")}}else Pastease.log("Just updating... Rule id: "+f+" still ok.");o&&Pastease.run(v,!0,!1)}}STREAM&&Pastease.streamInfo(),REPARSERS.set||Pastease.reparse(a)},reparse:function(a){REPARSERS.set=!0;var b=Pastease.debounce(function(b){Pastease.parse(a,!0,b)},500);REPARSERS.forceReparse=function(){b()},REPARSERS.mopinionShown=Pastease.listeners().addListener(document,"mopinion_shown",function(){b()}),REPARSERS.mopinionHidden=Pastease.listeners().addListener(document,"mopinion_hidden",function(){b()}),REPARSERS.mopinionLoaded=Pastease.listeners().addListener(document,"mopinion_loaded",function(){b()}),URL_DETECTION||(URL_DETECTION=document.location.href);var c=setInterval(function(){document.location.href!==URL_DETECTION&&(URL_DETECTION=document.location.href,b(!0))},500);REPARSERS.pollURL=c},forceParse:function(){if(REPARSERS&&"function"==typeof REPARSERS.forceReparse)return REPARSERS.forceReparse()},testCondition:function(a,b,c,d,e){if(Pastease.log("-----------------------"),(!("trigger"in a)||0>TRIGGERS.indexOf(a.trigger))&&Pastease.log("WARNING: no trigger!"),"pause"in a&&a.pause)return Pastease.log("Condition paused"),!1;var f=function(a){var b=!1;try{document.querySelector(a)&&(b=!0)}catch(a){}return b},g=!0;if(e&&e instanceof Array&&"object"==typeof e[0]&&e[0].disableMakeDiv&&e[0].args&&e[0].args[2]){var h=Pastease.getSelector(e[0].args[2]);g=f(h),g||REPARSERS[c]||function(a){REPARSERS[c]=setInterval(function(){f(a)&&(clearInterval(REPARSERS[c]),Pastease.log(a+" found, rechecking rules"),Pastease.forceParse())},500)}(h)}Pastease.log("Render div: "+g);var j=function(a){if("string"==typeof a&&(a={value:a}),"object"==typeof a&&"value"in a){if("operator"in a&&-1<["exists","does not exist"].indexOf(a.operator))var b=a.operator;else var b="exists";var c="boolean"!=typeof a.regex||a.regex;return Pastease.searchLocation(a.value,!1,b,c)}return!0},k=!0;if("location"in a&&0<a.location.length){var l=a.location.every(function(a){return a instanceof Array?a.every(function(a){return"does not exist"===a.operator}):"object"==typeof a?"does not exist"===a.operator:void 0}),m=l?"every":"some";k=a.location[m](function(a){if(a instanceof Array){var b=a.filter(function(a){return!!a.value});return 0!==b.length&&b.every(function(a){return j(a)})}return!!a.value&&j(a)})}Pastease.log("location: "+k);var n=!0;if("referrer"in a&&0<a.referrer.length){n=!1,0==a.referrer.length&&(n=!0);for(var o,r=0;r<a.referrer.length;r++)if(o=Pastease.referrer(a.referrer[r],!1),o){n=!0;break}}Pastease.log("referrer: "+n);var s=function(a){if("name"in a&&("value"in a||"operator"in a)){if("operator"in a&&-1<["exists","does not exist","contains","matches exactly","does not contain"].indexOf(a.operator))var b=a.operator;else var b=null;if(null==b)return Pastease.getCookie(a.name,!0)==a.value;if("exists"==b)return""!=Pastease.getCookie(a.name,!0);if("does not exist"==b)return""==Pastease.getCookie(a.name,!0);if("matches exactly"==b)return Pastease.getCookie(a.name,!0)==a.value;if("contains"==b)return null!=Pastease.getCookie(a.name,!0).match(a.value);if("does not contain"==b)return null==Pastease.getCookie(a.name,!0).match(a.value)}else return!0},t=!0;"cookie"in a&&0<a.cookie.length&&(t=a.cookie.some(function(a){return a instanceof Array?a.every(function(a){return s(a)}):s(a)})),Pastease.log("cookie: "+t);var u=function(a){if("name"in a&&("value"in a||"operator"in a)){if("operator"in a&&-1<["exists","does not exist","contains","matches exactly","does not contain"].indexOf(a.operator))var b=a.operator;else var b=null;return Pastease.jsVar(a.name,a.value,b)}return!0},v=!0;"js"in a&&0<a.js.length&&(v=a.js.some(function(a){return a instanceof Array?a.every(function(a){return u(a)}):u(a)})),Pastease.log("js: "+v);var w=function(a){if("name"in a&&("value"in a||"operator"in a)){if("operator"in a&&-1<["exists","does not exist","contains","matches exactly","does not contain"].indexOf(a.operator))var b=a.operator;else var b=null;return Pastease.cssSelector(a.name,a.value,b)}return!0},x=!0;"css_selector"in a&&0<a.css_selector.length&&(x=a.css_selector.some(function(a){return a instanceof Array?a.every(function(a){return w(a)}):w(a)})),Pastease.log("css_selector: "+x);var y=!0;y=!("number_of_pages"in a&&"check"in a.number_of_pages&&"amount"in a.number_of_pages)||Pastease.numberOfPages(a.number_of_pages.check,a.number_of_pages.amount,!1,c,"rule_"+b),Pastease.log("nr of pages: "+y+" for iteration "+b);var z=!0;if("devices"in a&&0<a.devices.length){for(var A=!1,B=Pastease.testDevice(),C=0;C<a.devices.length;C++)"desktop"!=a.devices[C]||B.phone||B.seven_inch||B.tablet?"tablet"==a.devices[C]&&(!0===B.tablet||!0===B.seven_inch)?A=!0:"mobile"==a.devices[C]&&!0===B.phone&&(A=!0):A=!0;z=A}Pastease.log("device: "+z);var D=!0;D=!("type"in a&&-1<["new","returning"].indexOf(a.type))||Pastease.type(a.type,!1,c,"rule_"+b,a.session),Pastease.log("new/returning visitor: "+D);var E=!0;"date"in a&&"object"==typeof a.date&&(a.date.date&&-1<["earlier","exactly","later"].indexOf(a.date.operator)?E=Pastease.datetime("date",a.date.date,a.date.operator):a.date.date&&a.date.date2&&-1<["between"].indexOf(a.date.operator)&&(E=Pastease.datetime("date",a.date.date,a.date.operator,a.date.date2))),Pastease.log("Date: "+E);var F=!0;if("clock"in a&&"object"==typeof a.clock&&(a.clock.time&&-1<["earlier","exactly","later"].indexOf(a.clock.operator)?F=Pastease.datetime("time",a.clock.time,a.clock.operator):a.clock.time&&a.clock.time2&&-1<["between"].indexOf(a.clock.operator)&&(F=Pastease.datetime("time",a.clock.time,a.clock.operator,a.clock.time2))),Pastease.log("Clock: "+F),"scrollpos"in a&&"from"in a.scrollpos&&"px"in a.scrollpos)var G=!0;else var G=!1;var H=g&&k&&n&&t&&v&&y&&z&&D&&x&&E&&F,I=!0;if(H&&"percentage"in a){var J=a.session,K=isNaN(parseFloat(a.percentage,10))?100:parseFloat(a.percentage,10).toFixed(1),L="proactive"===a.trigger?"pro_active":a.trigger,M=Pastease.getCookie("Pastease."+L+".chance",!1,c)&&-1===Pastease.getCookie("Pastease."+L+".chance",!1,c).indexOf("chance");if(M&&1!=Pastease.getCookie("Pastease."+L+".activated",!1,c)||!Pastease.getCookie("Pastease."+L+".chance",!1,c)){var N=Pastease.rnd();Pastease.setCookie("Pastease."+L+".chance","chance"+N,J,"/",void 0,!1,c),Pastease.setCookie("Pastease."+L+".activated",0,J,"/",void 0,!1,c),Pastease.log(L+" condition set, random nr: "+N)}(+Pastease.getCookie("Pastease."+L+".chance",!1,c).replace("chance","")>K||1==Pastease.getCookie("Pastease."+L+".activated",!1,c))&&(I=!1)}return Pastease.log("Percentage: "+I),{condition:H&&I,scroll:G}},run:function(code,try_catch,return_code){if(!!DEBUG)Pastease.log("DEBUG MODE, code will not be executed");else if(try_catch="undefined"!=typeof try_catch&&try_catch,try_catch)try{return_code?(Pastease.log("code: "+code),eval(code)):code()}catch(a){Pastease.log(a)}else return_code?(Pastease.log("code: "+code),eval(code)):code()},searchLocation:function(a,b,c,d){return b="undefined"==typeof b||b,b?"(document.location.host+document.location.pathname+location.search+location.hash).match(\""+a+"\") != null":d?"exists"==c?null!=(document.location.host+document.location.pathname+location.search+location.hash).match(a):null==(document.location.host+document.location.pathname+location.search+location.hash).match(a):"exists"==c?-1<(document.location.host+document.location.pathname+location.search+location.hash).indexOf(a):0>(document.location.host+document.location.pathname+location.search+location.hash).indexOf(a)},referrer:function(a,b){return b="undefined"==typeof b||b,b?"(document.referrer).match(\""+a+"\") != null":null!=document.referrer.match(a)},jsVar:function(name,value,operator){if(-1<name.indexOf("[*]")&&null!=operator){var split=name.split("[*]"),array=split[0],key=split[1];if(!(window[array]instanceof Array))return!1;var found=window[array].some(function(el,index){var exists,arrayString=array+"["+index+"]"+key;try{exists=eval(arrayString)}catch(a){}return"undefined"!=typeof exists&&(name=arrayString),"undefined"!=typeof exists})}var jsVar;try{jsVar=eval(name)}catch(a){}if(null==operator)return"undefined"!=typeof jsVar&&jsVar==value;return"exists"===operator?"undefined"!=typeof jsVar:"does not exist"===operator?"undefined"==typeof jsVar:"matches exactly"===operator?"undefined"!=typeof jsVar&&jsVar==value:"contains"===operator?"undefined"!=typeof jsVar&&null!=(jsVar+"").match(value):"does not contain"===operator?"undefined"!=typeof jsVar&&null==(jsVar+"").match(value):void 0},cssSelector:function(a,b,c){if(!c)return!1;var d;try{d=document.querySelectorAll(a)}catch(a){}if("exists"===c){if("undefined"!=typeof d)return 0<d.length;}else if("does not exist"===c){if("undefined"!=typeof d)return 0===d.length;}else if("contains"===c){if("undefined"!=typeof d&&0<d.length){d=d[0];var e=d.textContent||d.innerText;return b=b||"",e.match(new RegExp(b,"gi"))}}else if("matches exactly"===c){if("undefined"!=typeof d&&0<d.length){d=d[0];var e=d.textContent||d.innerText;return e=e.replace(/^\s+|\s+$/g,""),b==e}}else if("does not contain"===c&&"undefined"!=typeof d&&0<d.length){d=d[0];var e=d.textContent||d.innerText;return b=b||"",!e.match(new RegExp(b,"gi"))}},numberOfPages:function(a,b,c,d,e){return!(c="undefined"==typeof c||c,d="undefined"==typeof d?null:d,b=+b,a="min"==a?">":"max"==a?"<":null,count=""==Pastease.getCookie("page_count",!1,d+e)?0:+Pastease.getCookie("page_count",!1,d+e),(""==Pastease.getCookie("last_page",!1,d+e)||""!=Pastease.getCookie("last_page",!1,d+e)&&Pastease.getCookie("last_page",!1,d+e)!=document.location.pathname)&&(count+=1),Pastease.setCookie("last_page",document.location.pathname+document.location.hash,0,"/",void 0,!1,d+e),Pastease.setCookie("page_count",count,0,"/",void 0,!1,d+e),null!=a)||(">"==a?count>=b:"<"==a?count<=b:void 0)},type:function(a,b,c,d,e){b="undefined"==typeof b||b,c="undefined"==typeof c?null:c;var f=function(a){return Math.floor(a/1e3)},g=function(a){Pastease.setCookie("Pastease.session",a,e,"/",void 0,!1)},h=function(){var a=f(new Date().getTime()),b=+Pastease.getCookie("Pastease.session");return 60>a-b},j=function(){return(Pastease.getCookie("Pastease.session")||g(f(new Date().getTime())),1!=Pastease.getCookie("Pastease.returning")&&1!=Pastease.getCookie("Pastease.returning",!1,c+d))&&(h()?!!h()||void 0:(Pastease.setCookie("Pastease.returning",1),!1))};return REPARSERS.sessionPoll||(REPARSERS.sessionPoll=setInterval(function(){g(f(new Date().getTime()))},1e4)),"new"===a?j():!j()},datetime:function(a,b,c,d){if(a&&b&&c){var e={earlier:function(a,b){return a>b},exactly:function(a,b){return a==b},later:function(a,b){return a<b},between:function(a,b,c){return e.later(a,c)&&e.earlier(b,c)}},f=function(a,b){if(b){var c=a.split("/"),e=c[0];c[0]=c[1],c[1]=e,a=c.join("-")}if(a)var f=new Date(a);else var f=new Date;return new Date(f.setHours(0,0,0,0)).getTime()};if("date"==a)return"between"===c?e[c](f(b,!0),f(d,!0),f()):e[c](f(b,!0),f());if("time"==a){var g=new Date;return g=("0"+g.getHours()).slice(-2)+":"+("0"+g.getMinutes()).slice(-2),"between"===c?e[c](b,d,g):e[c](b,g)}}},scroll:function(a,b,c,d,e){a="undefined"===a?"top":a;var f=isNaN(b);f&&(b=b.replace("%","")),b=parseInt(b);var g=!1,h=USE_$?$(document).height():document.body.scrollHeight,j=USE_$?$(window).height():window.innerHeight;if(USE_$)$(window).scroll(function(){g=Pastease.onScroll(event,a,b,c,f,g,h,j,d)});else{ACTIVE_RULES[d][e].scroll=Pastease.debounce(function(k){Pastease.onScroll(k,a,b,c,f,g,h,j,d,e)},200);var k=Pastease.listeners();k.addListener(window,"scroll",ACTIVE_RULES[d][e].scroll)}return"true"},onScroll:function(a,b,c,d,e,f,g,h,j,k){var l=USE_$?$(window).scrollTop():(window.pageYOffset||document.scrollTop)-(document.clientTop||0),m=100*((l+h)/g),n=g-(l+h),o=100-m,p=Pastease.listeners();return Pastease.log("top: "+l),Pastease.log("top: "+m+" %"),Pastease.log("bottom: "+n),Pastease.log("bottom: "+o+" %"),Pastease.log("code loaded: "+f),"top"==b?!f&&(!e&&l>=c||e&&m>=c)&&(Pastease.run(d,!1),f=!0,p.removeListener(window,"scroll",ACTIVE_RULES[j][k].scroll)):"bottom"==b&&!f&&(!e&&n<=c||e&&o<=c)&&(Pastease.run(d,!1),f=!0,p.removeListener(window,"scroll",ACTIVE_RULES[j][k].scroll)),f},exit:function(a,b,c,d,e,f,g,h){c="undefined"!=typeof c&&null!=c?c:Cookie_pro_active_days,d="undefined"!=typeof d&&null!=d?d:"once",a="undefined"!=typeof a&&null!=a?a:0,e="undefined"==typeof e?null:e,Pastease.log("Exit activated!");var j,k=100;if(!USE_$)var l=Pastease.listeners(),m=l.addListener,n=l.removeListener;if(USE_$)$(document).mousemove(function(a){a=a?a:window.event,IE=!!document.all,mouseY=IE?a.clientY:a.clientY,j=mouseY});else{var o=function(a){a=a?a:window.event,IE=!!document.all,mouseY=IE?a.clientY:a.clientY,Pastease.log("mouseY: "+mouseY),j=mouseY};m(document,"mousemove",o)}a=Pastease.outAtime(a,e,"Pastease.exit.timestamp",g,c),Pastease.log("trigger time: "+a);var p=setTimeout(function(){if(Pastease.log("waiting for exit..."),USE_$)$(document).mouseleave(function(){j<=k&&Pastease.getExit()&&!EXIT_ACTIVATED&&(EXIT_ACTIVATED=!0,b(),Pastease.log("Oh no, left page...exit!"))});else{var a=document.getElementsByTagName("html")[0];ACTIVE_RULES[g][h].exit=function(){Pastease.log("y : "+j),Pastease.log("y_min : "+k),Pastease.log("EXIT_ACTIVATED : "+EXIT_ACTIVATED),j<=k&&Pastease.getExit()&&!EXIT_ACTIVATED&&(EXIT_ACTIVATED=!0,Pastease.log("exit code:"),Pastease.log(b),b(),Pastease.log("Oh no, left page...exit!"),n(a,"mousemove",ACTIVE_RULES[g][h].exit),n(document,"mousemove",o))},m(a,"mouseleave",ACTIVE_RULES[g][h].exit)}try{ACTIVE_RULES[g][h].initialized=!0}catch(a){}},a);return ACTIVE_RULES[g][h].timeout=p,f?"Pastease.setExit();":Pastease.setExit},listeners:function(){var a,b;return document.addEventListener?(a=function(a,b,c){return a.addEventListener(b,c,!1)},b=function(a,b,c){return a.removeEventListener(b,c,!1)}):(a=function(a,b,c){return a.attachEvent("on"+b,c)},b=function(a,b,c){return a.detachEvent("on"+b,c)}),{addListener:a,removeListener:b}},setExit:function(a){"undefined"==typeof a&&(a=!0),EXIT=!!a},getExit:function(){return EXIT},passive:function(a,b,c,d,e,f,g,h){c="undefined"!=typeof c&&null!=c?c:Cookie_pro_active_days,d="undefined"!=typeof d&&null!=d?d:"once",a="undefined"==typeof a?null:a,e="undefined"==typeof e?null:e,g="undefined"==typeof g?null:g;if(a=Pastease.outAtime(a,e,"Pastease.passive.timestamp",g,c),f)var j="var INIT_TIMER = setTimeout(function() { "+b+" }, "+a+"); ACTIVE_RULES[rule_id].timeout = INIT_TIMER;";else var j=function(){var c=setTimeout(function(){b();try{ACTIVE_RULES[g][h].initialized=!0}catch(a){}},a);ACTIVE_RULES[g][h].timeout=c};return Pastease.log("service starting in "+a/1e3+" seconds..."),j},proActive:function(a,b,c,d,e,f,g,h){c="undefined"!=typeof c&&null!=c?c:Cookie_pro_active_days,d="undefined"!=typeof d&&null!=d?d:"once",a="undefined"==typeof a?null:a,e="undefined"==typeof e?null:e,g="undefined"==typeof g?null:g;if(a=Pastease.outAtime(a,e,"Pastease.pro_active.timestamp",g,c),f)var j="var INIT_TIMER = setTimeout(function() { "+b+" Pastease.setCookie( \"Pastease.pro_active.activated\", 1, "+c+", \"/\", undefined, false ); }, "+a+"); ACTIVE_RULES[rule_id].timeout = INIT_TIMER;";else var j=function(){var c=setTimeout(function(){b();try{ACTIVE_RULES[g][h].initialized=!0}catch(a){}},a);ACTIVE_RULES[g][h].timeout=c};return Pastease.log("service starting in "+a/1e3+" seconds..."),j},clearService:function(a,b){if("mopinion"==a){Pastease.log("Clearing form key "+b[0]+" from service Mopinion.");try{srv.clearForm(b[0])}catch(a){}}},getActive:function(){return ACTIVE_RULES},getConfigID:function(){return ID},outAtime:function(a,b,c,d,e){if(d="undefined"==typeof d?null:d,null!=b&&0!=b){var f=+Pastease.getCookie(c,!1,d),a=b-f;Pastease.log("time_passed: "+f),Pastease.log("time: "+a),REPARSERS["timePoll"+d]||0===a||(REPARSERS["timePoll"+d]=setInterval(function(){var a=+Pastease.getCookie(c,!1,d)+1;Pastease.setCookie(c,a,e,"/",void 0,!1,d)},1e3))}return 1e3*a},timestamp:function(){return Date.now||(Date.now=function(){return new Date().getTime()}),Math.floor(Date.now()/1e3)},rnd:function(){return(100*Math.random()).toFixed(1).toString()},observer:function(){MutationObserver=window.MutationObserver||window.WebKitMutationObserver;var a=new MutationObserver(function(a,b){Pastease.log(a,b),Pastease.stream("dom",{html:document.documentElement.innerHTML})});a.observe(document,{subtree:!0,attributes:!0,characterData:!0,subtree:!0,attributeOldValue:!0,characterDataOldValue:!0,attributeFilter:!0})},streamInfo:function(){$(document).mousemove(function(a){a=a?a:window.event,IE=!!document.all,IE?(mouseX=event.clientX,mouseY=event.clientY+document.body.scrollTop):(mouseX=a.pageX,mouseY=a.pageY),Pastease.stream("mouse",{x:mouseX,y:mouseY})}),Pastease.observer(),Pastease.stream("dom",{html:document.documentElement.innerHTML})},stream:function(a,b){try{var c=SOCKET,d={id:Pastease.getId(),type:a,vars:b,agent:navigator.userAgent,host:document.location.host,protocol:document.location.protocol,resolution:{width:screen.width,height:screen.height},viewport:{width:Math.max(document.documentElement.clientWidth,window.innerWidth||0),height:Math.max(document.documentElement.clientHeight,window.innerHeight||0)}};c.emit("json",d)}catch(a){Pastease.log("stream ERROR: "+a)}Pastease.log("stream: "+JSON.stringify(d))},getId:function(){var a=Pastease.getCookie("stream_id");if(a&&""!=a)return a;var b=Pastease.randomString(30);return Pastease.setCookie("stream_id",b),b},debounce:function(a,b,c){var d,e=null;return function(){var f=this,g=arguments,h=c&&!e;return clearTimeout(e),e=setTimeout(function(){e=null,c||(d=a.apply(f,g))},b),h&&(d=a.apply(f,g)),d}},randomString:function(a){return Math.round(Math.pow(36,a+1)-Math.random()*Math.pow(36,a)).toString(36).slice(1)},getCookie:function(a,b,c){c="undefined"==typeof c?null:c,"undefined"==typeof b&&(b=!1);var d=document.cookie.split(";"),e="",f="",g="",h=!1;for(SEPARATE_COOKIES&&null!=c&&!b&&(a+="."+c),i=0;i<d.length;i++){if(e=d[i].split("="),f=e[0].replace(/^\s+|\s+$/g,""),f==a)return h=!0,1<e.length&&(g=unescape(e[1].replace(/^\s+|\s+$/g,""))),g;e=null,f=""}if(!h)return""},setCookie:function(a,b,c,d,e,f,g){g="undefined"==typeof g?null:g;var h=new Date;h.setTime(h.getTime()),c&&(c=24*(60*(60*(1e3*c)))),SEPARATE_COOKIES&&null!=g&&(a+="."+g);var j=new Date(h.getTime()+c);document.cookie=a+"="+escape(b)+(c?";expires="+j.toGMTString():"")+(d?";path="+d:"")+(e?";domain="+e:"")+(f?";secure":"")},makeDiv:function(a){if(!document.getElementById(a)){var b=document.createElement("div");b.setAttribute("id",a),document.getElementsByTagName("body")[0].appendChild(b),Pastease.log("inserted div: "+a)}else Pastease.log("Div: "+a+" found, nothing inserted")},triggers:function(a,b,c,d,e,f,g,h,j,k,l,m,n){j=!("undefined"!=typeof j)||j,k="undefined"==typeof k?null:k,e=null==e?0:e,h=null==h?0:h;var o="",p=!!("object"==typeof l&&"from"in l.scrollpos&&"px"in l.scrollpos)&&l.scrollpos,q=function(a,b,c,d,e,f){var g=function(){if(1!=Pastease.getCookie("Pastease."+b+".activated",!1,d)||e)var f=setInterval(function(){var e={key:a,trigger_method:b.replace("_",""),cookie_expire:c};"passive"===b&&(e.showButton=!0),("exit"===b||"proactive"===b)&&(e.openForm=!0);try{srv.open(e),"passive"!==b&&0!==c&&Pastease.setCookie("Pastease."+b+".activated",1,c,"/",void 0,!1,d),clearInterval(f),ACTIVE_RULES[d][n].triggered=!0,REPARSERS["timePoll"+d]&&clearInterval(REPARSERS["timePoll"+d])}catch(a){Pastease.log(a)}},150)};f?Pastease.scroll(f.from,f.px,g,d,n):g()};if("mopinion"==a){if("passive"==c){if(Pastease.log("trigger: passive"),j)o="srv.open({key:\""+b[0]+"\",trigger_method:\"passive\", cookie_expire:"+f+"});",o="var try_code; try_code = setInterval(function() { try { "+o+" clearInterval(try_code); } catch(e) { Pastease.log(e); }; }, 100);";else var o=function(){q(b[0],"passive",f,k,g,p,m)};return-1<[null,0].indexOf(e)&&-1<[null,0].indexOf(h)?(Pastease.log("plain passive code"),o):(Pastease.log("passive code with timeout or %..."),Pastease.passive(e,o,f,g,h,j,k,n))}if("proactive"==c){if(Pastease.log("trigger: proactive"),j){var o="srv.open({key:\""+b[0]+"\", trigger_method:\"proactive\",cookie_expire:"+f+"});";o="var try_code; try_code = setInterval(function() { try { "+o+" clearInterval(try_code); } catch(e) { Pastease.log(e); }; }, 100);"}else var o=function(){q(b[0],"pro_active",f,k,g,p,m)};return Pastease.proActive(e,o,f,g,h,j,k,n)}if("exit"==c){if(Pastease.log("trigger: exit"),j){var o="srv.open({key:\""+b[0]+"\", trigger_method:\"exit\",cookie_expire:"+f+"});";o="var try_code = setInterval(function() { try { "+o+" clearInterval(try_code); } catch(e) { Pastease.log(e); }; }, 100);"}else var o=function(){q(b[0],"exit",f,k,g,p,m)};return Pastease.exit(e,o,f,g,h,j,k,n)}if("test"==c)return Pastease.log("test trigger"),j?"":function(){}}},testDevice:function(){var a=/iPhone/i,b=/iPod/i,c=/iPad/i,d=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,e=/Android/i,f=/(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,g=/(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,h=/Windows Phone/i,j=/(?=.*\bWindows\b)(?=.*\bARM\b)/i,k=/BlackBerry/i,l=/BB10/i,m=/Opera Mini/i,n=/(CriOS|Chrome)(?=.*\bMobile\b)/i,o=/(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,p=function(a,b){return a.test(b)};return new function(q){var r=q||navigator.userAgent,s=r.split("[FBAN");if("undefined"!=typeof s[1]&&(r=s[0]),s=r.split("Twitter"),"undefined"!=typeof s[1]&&(r=s[0]),this.apple={phone:p(a,r),ipod:p(b,r),tablet:!p(a,r)&&p(c,r),device:p(a,r)||p(b,r)||p(c,r)},this.amazon={phone:p(f,r),tablet:!p(f,r)&&p(g,r),device:p(f,r)||p(g,r)},this.android={phone:p(f,r)||p(d,r),tablet:!p(f,r)&&!p(d,r)&&(p(g,r)||p(e,r)),device:p(f,r)||p(g,r)||p(d,r)||p(e,r)},this.windows={phone:p(h,r),tablet:p(j,r),device:p(h,r)||p(j,r)},this.other={blackberry:p(k,r),blackberry10:p(l,r),opera:p(m,r),firefox:p(o,r),chrome:p(n,r),device:p(k,r)||p(l,r)||p(m,r)||p(o,r)||p(n,r)},this.seven_inch=p(/(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)/i,r),this.any=this.apple.device||this.android.device||this.windows.device||this.other.device||this.seven_inch,this.phone=this.apple.phone||this.android.phone||this.windows.phone,this.tablet=this.apple.tablet||this.android.tablet||this.windows.tablet,"undefined"==typeof window)return this}},services:function(serviceObj,init_more,return_code){return_code="undefined"!=typeof return_code&&return_code;var service=serviceObj.service||"",args=serviceObj.args||"",disableMakeDiv=serviceObj.disableMakeDiv||!1,useQuerySelectorAll=serviceObj.useQuerySelectorAll||!1,code="";if("mopinion"==service){if(!init_more){var subdom="collect",src=null!=LOCAL_FILE&&"undefined"!=typeof LOCAL_FILE&&LOCAL_FILE!=null?LOCAL_FILE:"https://collect.mopinion.com/assets/surveys/"+MOPINION_VERSION+"/js/"+MOPINION_FILE+".js?d=30032020";code="(function(d, e, v) {var f = d.createElement(e),vars = {\"key\":\"{0}\",\"domain\":\"{1}\",\"divName\":\"{2}\",\"button\":false, \"use_collect\": "+USE_COLLECT+", \"useQuerySelectorAll\": "+useQuerySelectorAll+"};f.async=\"async\";f.id=\"mopinionFeedbackScript\";f.src = \""+src+"\";f.onload = f.onreadystatechange = function() {var r = this.readyState; if (r) if (r != \"complete\") if (r != \"loaded\") return;try {srv.loadSurvey(vars);} catch (x) {}};var s = d.getElementsByTagName(e)[0],p = s.parentNode;p.insertBefore(f, s);})(document, \"script\", \""+MOPINION_VERSION+"\");"}else init_more&&(code="(function() {var try_catch = setInterval(function() { try {srv.loadSurvey({key:\"{0}\",\"domain\":\"{1}\", divName:\"{2}\", \"use_collect\": "+USE_COLLECT+", \"useQuerySelectorAll\": "+useQuerySelectorAll+"}); clearInterval(try_catch)} catch(e) {} },100)})()");3<=args.length&&!disableMakeDiv&&Pastease.makeDiv(args[2])}else"CFMS"==service&&(code="Mgo.loadMopinion(\"mopinion\",\"{0}\",\"none\",\"{1}\");");for(var j=0;j<args.length;j++){var match="{"+j+"}",token=args[j];code=code.replace(match,token)}return return_code?code:function(){eval(code)}},getSelector:function(a){a=a||"";var b=a.charAt(0),c=a.split(" ");return b.match(/\#|\.|\*|\[|\:/g)||1<c.length?a:1<c.length?a:"#"+a},jquery:function(){var a=document.location.protocol+"//code.jquery.com/jquery-1.9.1.js";if(!1===Pastease.fileExists(a)){var b=document.createElement("script");b.type="text/javascript",b.src=a,document.getElementsByTagName("head")[0].appendChild(b)}var c=function(){window.jQuery?Pastease.log("jQuery loaded!"):window.setTimeout(function(){c()},200)};c()},socketio:function(){var a=document.location.protocol+"//cdn.socket.io/socket.io-1.4.5.js";if(!1===Pastease.fileExists(a)){var b=document.createElement("script");b.type="text/javascript",b.src=a,document.getElementsByTagName("head")[0].appendChild(b)}var c=function(){window.io?Pastease.log("Socket.io loaded!"):window.setTimeout(function(){c()},200)};c()},fileExists:function(a){for(var b=document.getElementsByTagName("script"),c=0;c<b.length;c++)if(Pastease.log("looking for: "+a),Pastease.log("found: "+b[c].src),b[c].src==a)return!0;return!1},socket:function(){var a="pastea.se"==document.location.host?"socket.pastea.se":"localhost:8585";return io.connect(document.location.protocol+"//"+a)},sendXML:function(a,b,c,d){var e=new XMLHttpRequest;e.onreadystatechange=function(){if(!(e.readyState==XMLHttpRequest.DONE||4==e.readyState));else if(200==e.status){var a=e.responseText;c(a,!1,!0)}else Pastease.log("Ajax ERROR "+e.status)},e.open(d,Base_url+a,!0),e.send()},send:function(a,b,c,d){var e=Base_url+a;$.ajax({url:e,type:d,data:b,dataType:"json",success:function(a){c(a)},error:function(a){Pastease.log("AJAX ERROR: "+JSON.stringify(a)),Pastease.log("url: "+e),Pastease.log(a,!0)}})},use$:function(a){"undefined"==typeof a&&(a=!1),USE_$=a},ajax$:function(a){"undefined"==typeof a&&(a=!1),AJAX_$=a},debug:function(a){"undefined"==typeof a&&(a=!1),LOG="true"==Pastease.getCookie("LOG")||a},log:function(a,b){if("undefined"==typeof b&&(b=!1),LOG)try{b?console.log(a):console.log("P> "+a)}catch(a){}}}}();