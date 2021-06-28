/**
 * Created by ashok on 17/03/17.;
 */

const ncp = require('ncp').ncp;
const fs = require('fs-extra');

// const mygolf_app_src = '../mygolf-app/src';
const mygolf_app_src = '../player-app/src';
const mygolf_app_provider = mygolf_app_src + "/providers";
const mygolf_app_pages = mygolf_app_src + "/pages";
const mygolf_app_theme = mygolf_app_src + "/theme";
const pages = './src/pages';

fs.ensureDir('./src/pages/competition');
fs.ensureDir('./src/pages/normalgame');


var providers = ['normalgame-service',
    'competition-service',
    'scorecard-service', 'geolocation-service', 'player-service',
    'pushnotification-service',
    'filetransfer-service', 'club-service',
    'friend-service', 'image-service', 'serverinfo-service', 'eventlog-service',
    'connection-service',
    'device-service', 'ad-service','club-flight-service','payment-service',
    'booking-chart-service','chartcrud.service','chartdate.service',
  'ReferencedataService', 'handicap-service'];

var stat = {
  totalFiles: 0,
  totalErrors: 0
}
var resources = [
    {src: mygolf_app_pages + '/gameround-scoring', trg: pages+'/gameround-scoring'},
    {src: mygolf_app_pages + '/scorecard-display', trg: pages+'/scorecard-display'},
    {src: mygolf_app_pages + '/competition/competition-leaderboard', trg: pages+'/competition/competition-leaderboard'},
    {src: mygolf_app_pages + '/about', trg:pages+ '/about'},
    {src: mygolf_app_pages + '/add-club-list', trg:pages+ '/add-club-list'},
    {src: mygolf_app_pages + '/add-location', trg: pages + '/add-location'},
    {src: mygolf_app_pages + '/add-state-list', trg: pages + '/add-state-list'},
    {src: mygolf_app_pages + '/change-password', trg: pages + '/change-password'},
    {src: mygolf_app_pages + '/edit-profile', trg: pages + '/edit-profile'},
    {src: mygolf_app_pages + '/normalgame/change-course', trg: pages + '/normalgame/change-course'},
    {src: mygolf_app_pages + '/normalgame/club-list', trg: pages + '/normalgame/club-list'},
    {src: mygolf_app_pages + '/player-favourite-list', trg: pages + '/player-favourite-list'},
    {src: mygolf_app_pages + '/scorecard-local-list', trg: pages + '/scorecard-local-list'},
    {src: mygolf_app_pages + '/event-log', trg: pages + '/event-log'},
    {src: mygolf_app_pages + '/profile', trg: pages + '/profile'},    
    {src: mygolf_app_pages + '/handicap-history', trg: pages + '/handicap-history'},
    {src: mygolf_app_pages + '/handicap-history-details', trg: pages + '/handicap-history-details'},
    {src: mygolf_app_pages + '/scorecard-filter', trg: pages + '/scorecard-filter'},
    {src: mygolf_app_pages + '/modal-screens', trg: pages + '/modal-screens'},
    {src: mygolf_app_pages + '/booking', trg: pages + '/booking'},
    {src: mygolf_app_pages + '/search-player-list', trg: pages + '/search-player-list'},
    {src: mygolf_app_pages + '/performance', trg: pages + '/performance'},
    {src: mygolf_app_pages + '/faq', trg: pages + '/faq'},
    {src: mygolf_app_pages + '/contact-us', trg: pages + '/contact-us'},
    // {src: mygolf_app_pages + '/performance', trg: pages + '/performance'},
    
    {src: mygolf_app_pages + '/player-groups', trg: pages + '/player-groups'},
    
    {src: mygolf_app_pages + '/hole-analysis', trg: pages + '/hole-analysis'},
    {src: mygolf_app_pages + '/hole-analysis-filter', trg: pages + '/hole-analysis-filter'},
    {src: mygolf_app_pages + '/new-contact', trg: pages + '/new-contact'},
    {src: mygolf_app_pages + '/notifications', trg: pages + '/notifications'},
    {src: mygolf_app_src + '/data', trg: './src/data'},
    {src: mygolf_app_src + '/custom', trg: './src/custom'},
    {src: mygolf_app_src + '/i18n', trg: './src/i18n'},
    {src: mygolf_app_src + '/storage', trg: './src/storage'},
    {src: mygolf_app_src + '/redux/device', trg: './src/redux/device'},
    {src: mygolf_app_src + '/redux/server', trg: './src/redux/server'},
    {src: mygolf_app_src + '/redux/pushnotf', trg: './src/redux/pushnotf'},
    {src: mygolf_app_src + '/redux/scorecard', trg: './src/redux/scorecard'},
    {src: mygolf_app_src + '/redux/wstomp', trg: './src/redux/wstomp'},
    {src: mygolf_app_src + '/redux/session', trg: './src/redux/session'},
    {src: mygolf_app_src + '/redux/player-home', trg: './src/redux/player-home'},
    {src: mygolf_app_src + '/redux/create-action.ts', trg: './src/redux/create-action.ts'},
    {src: mygolf_app_src + '/redux/storage-sync.ts', trg: './src/redux/storage-sync.ts'},
    {src: mygolf_app_src + '/redux/player-home', trg: './src/redux/player-home'},
    {src: mygolf_app_src + '/theme', trg: './src/theme'},
    {src: mygolf_app_src + '/charts', trg: './src/charts'},
];
var others = [{src: mygolf_app_src + '/globals.ts', trg: './src/globals.ts'},
    {src: mygolf_app_src + '/authentication-service.ts', trg: './src/authentication-service.ts'},
    {src: mygolf_app_src + '/json-util.ts', trg: './src/json-util.ts'},
    {src: mygolf_app_src + '/message-display-utils.ts', trg: './src/message-display-utils.ts'},
    {src: mygolf_app_src + '/mygolf-events.ts', trg: './src/mygolf-events.ts'},
    {src: mygolf_app_src + '/remote-http.ts', trg: './src/remote-http.ts'},
    {src: mygolf_app_src + '/remote-request.ts', trg: './src/remote-request.ts'},
    {src: mygolf_app_src + '/RemoteResponse.ts', trg: './src/RemoteResponse.ts'}];
providers.forEach(function(provider){
    var source = mygolf_app_provider+'/' + provider;
    var target = './src/providers/' + provider;
    ncp(source,target, function(error){
            onError(source, target, error);
        });
});
resources.forEach((resource)=>{
    ncp(resource.src, resource.trg, (error)=>{
        onError(resource.src, resource.trg, error);
    });
});

others.forEach((file)=>{
    fs.copy(file.src, file.trg, (error)=>{
      onError(file.src, file.trg, error);
    })
});

function onError(source, target, error){
  stat.totalFiles++;
  if(error){
    stat.totalErrors++;
    console.error("Error copying " + source + " to " + target);
    console.error(error);
  }
  else {
    console.log("Copied " + source + " to " + target);
  }
}
console.log("Total Files: " + stat.totalFiles + ", Errors: " + stat.totalErrors);
