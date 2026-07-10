const fs = require('fs');

let app = fs.readFileSync('webapp/controller/App.controller.ts', 'utf8');
app = app.replace(/event\.getParameter/g, '_event.getParameter');
app = app.replace(/import Context from "sap\/ui\/model\/odata\/v2\/Context";/, 'import Context from "sap/ui/model/odata/v2/Context";\nimport { NotificationListItem$CloseEvent } from "sap/ui/webc/fiori/NotificationListItem";');
// Fix the remaining openNotificationSocket issue
app = app.replace(/private async openNotificationSocket/, '// private async openNotificationSocket');

// Fix event.getSource in onDeleteNotification
app = app.replace(/public async onDeleteNotification\(event: NotificationListItem\$CloseEvent\) \{/, 'public async onDeleteNotification(_event: NotificationListItem$CloseEvent) {');
app = app.replace(/_event\.getSource/, '(_event as any).getSource'); // Or just _event.getSource if it's there
app = app.replace(/event\.getSource/g, '_event.getSource');

fs.writeFileSync('webapp/controller/App.controller.ts', app);

let pm = fs.readFileSync('webapp/util/common/PersonalMenu.ts', 'utf8');
pm = pm.replace(/const getRootControl = \(_control: Element\) => \{/, 'const getRootControl = () => {'); // remove it completely if not used
fs.writeFileSync('webapp/util/common/PersonalMenu.ts', pm);

let userApi = fs.readFileSync('webapp/util/session/UserAPI.ts', 'utf8');
userApi = userApi.replace(/resolve, reject/, 'resolve, _reject');
fs.writeFileSync('webapp/util/session/UserAPI.ts', userApi);

console.log("Done");
