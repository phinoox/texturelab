// https://www.tutorialspoint.com/electron/electron_menus.htm
// https://programmer.help/blogs/use-electron-to-customize-menus.html
// https://electronjs.org/docs/api/menu
// https://alan.fyi/renderer-menu-functions-in-electron-vue/
const { app, Menu, BrowserWindow } = require("electron");
export var MenuCommands;
(function (MenuCommands) {
    MenuCommands["FileNew"] = "file_new";
    MenuCommands["FileOpen"] = "file_open";
    MenuCommands["FileSave"] = "file_save";
    MenuCommands["FileSaveAs"] = "file_saveas";
    MenuCommands["FileExit"] = "file_exit";
    MenuCommands["ExportZip"] = "export_zip";
    MenuCommands["ExportUnity"] = "export_unity";
    MenuCommands["ExportUnityZip"] = "export_unity_zip";
    MenuCommands["ExamplesGoldLinesMarbleTiles"] = "samples_1";
    MenuCommands["ExamplesGrenade"] = "samples_2";
    MenuCommands["ExamplesScrews"] = "samples_3";
    MenuCommands["ExamplesWoodenPlanks"] = "samples_4";
    MenuCommands["HelpTutorials"] = "help_tutorials";
    MenuCommands["HelpAbout"] = "help_about";
    MenuCommands["HelpSubmitBug"] = "help_submitbug";
})(MenuCommands || (MenuCommands = {}));
export function setupMenu() {
    const template = [
        {
            label: "File",
            submenu: [
                {
                    label: "New",
                    accelerator: "CmdOrCtrl+N",
                    click: (item, focusedWindow) => {
                        focusedWindow.webContents.send(MenuCommands.FileNew);
                    }
                },
                {
                    label: "Open",
                    accelerator: "CmdOrCtrl+O",
                    click: (item, focusedWindow) => {
                        focusedWindow.webContents.send(MenuCommands.FileOpen);
                    }
                },
                {
                    label: "Save",
                    accelerator: "CmdOrCtrl+S",
                    click: (item, focusedWindow) => {
                        focusedWindow.webContents.send(MenuCommands.FileSave);
                    }
                },
                {
                    label: "Save As..",
                    accelerator: "CmdOrCtrl+Shift+S",
                    click: (item, focusedWindow) => {
                        focusedWindow.webContents.send(MenuCommands.FileSaveAs);
                    }
                },
                {
                    label: "Exit",
                    click: (item, focusedWindow) => {
                        focusedWindow.webContents.send(MenuCommands.FileExit);
                    }
                }
            ]
        },
        {
            label: "Export",
            submenu: [
                {
                    label: "Zip",
                    click: (item, focusedWindow) => {
                        focusedWindow.webContents.send(MenuCommands.ExportZip);
                    }
                },
                {
                    label: "Unity Material",
                    click: (item, focusedWindow) => {
                        focusedWindow.webContents.send(MenuCommands.ExportUnity);
                    }
                },
                {
                    label: "Unity (Zip)",
                    click: (item, focusedWindow) => {
                        focusedWindow.webContents.send(MenuCommands.ExportUnityZip);
                    }
                }
            ]
        },
        {
            label: "Examples",
            submenu: [
                {
                    label: "GoldLinedMarbleTiles",
                    click: (item, focusedWindow) => {
                        focusedWindow.webContents.send(MenuCommands.ExamplesGoldLinesMarbleTiles);
                    }
                },
                {
                    label: "Grenade",
                    click: (item, focusedWindow) => {
                        focusedWindow.webContents.send(MenuCommands.ExamplesGrenade);
                    }
                },
                {
                    label: "Screws",
                    click: (item, focusedWindow) => {
                        focusedWindow.webContents.send(MenuCommands.ExamplesScrews);
                    }
                },
                {
                    label: "WoodenPlanks",
                    click: (item, focusedWindow) => {
                        focusedWindow.webContents.send(MenuCommands.ExamplesWoodenPlanks);
                    }
                }
            ]
        },
        // {
        //   label: "Help",
        //   submenu: [
        //     {
        //       label: "Tutorials"
        //     },
        //     {
        //       label: "About"
        //     },
        //     {
        //       label: "Submit Bug"
        //     }
        //   ]
        // },
        ...(process.env.NODE_ENV !== "production"
            ? [
                {
                    label: "Dev",
                    submenu: [
                        { role: "reload" },
                        {
                            role: "forcereload",
                            click: function (item, focusedWindow) {
                                if (focusedWindow) {
                                    // After overloading, refresh and close all secondary forms
                                    if (focusedWindow.id === 1) {
                                        BrowserWindow.getAllWindows().forEach(function (win) {
                                            if (win.id > 1) {
                                                win.close();
                                            }
                                        });
                                    }
                                    focusedWindow.reload();
                                }
                            }
                        },
                        { role: "toggledevtools" },
                        { type: "separator" },
                        { role: "resetzoom" },
                        { role: "zoomin" },
                        { role: "zoomout" },
                        { type: "separator" },
                        { role: "togglefullscreen" }
                    ]
                }
            ]
            : [])
    ];
    //console.log(template);
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}
//# sourceMappingURL=menu.js.map