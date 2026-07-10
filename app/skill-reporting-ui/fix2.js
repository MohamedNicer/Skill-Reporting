const fs = require('fs');

let app = fs.readFileSync('webapp/controller/App.controller.ts', 'utf8');
app = app.replace('// private async openNotificationSocket() {', 'private async openNotificationSocket() {');
app = app.replace('private pullNotifications() {', '// private pullNotifications() {'); // wait, I already did this. Let's just do it again safely.

// Replace unused event params
app = app.replace(/public async onOpenNotifications\(event: ShellBar\$NotificationsPressedEvent\) {/, 'public async onOpenNotifications(_event: ShellBar$NotificationsPressedEvent) {');
app = app.replace(/private setAppVisibilities\(event: Router\$RouteMatchedEvent\)/, 'private setAppVisibilities(_event: Router$RouteMatchedEvent)');
app = app.replace(/connection.attachMessage\(\(event: WebSocket\$MessageEvent\) => {/, 'connection.attachMessage((_event: WebSocket$MessageEvent) => {');

fs.writeFileSync('webapp/controller/App.controller.ts', app);

let pm = fs.readFileSync('webapp/util/common/PersonalMenu.ts', 'utf8');
pm = pm.replace(/const getRootControl = \(control: Element\) => {/, 'const getRootControl = (_control: Element) => {');
fs.writeFileSync('webapp/util/common/PersonalMenu.ts', pm);

let userApi = fs.readFileSync('webapp/util/session/UserAPI.ts', 'utf8');
userApi = userApi.replace(/reject: any/, '_reject: any');
userApi = userApi.replace(/resolve, reject/, 'resolve, _reject');
userApi = userApi.replace(/this.oDataModel.read/g, 'this.oDataModel!.read'); // fix possibly null
fs.writeFileSync('webapp/util/session/UserAPI.ts', userApi);

console.log("Done");
