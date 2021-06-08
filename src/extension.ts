// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';

import cp = require('child_process');
import vscode = require('vscode');
import {getFileArchive, byteOffsetAt} from './util';
import fs = require('fs');
import { generatePostgres } from './postgres';





// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "go-lazy" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('go-lazy.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from go-lazy!');
	// });

	context.subscriptions.push(
		vscode.commands.registerCommand('go-lazy.generate-postgres', (args) => {
			generatePostgres(args);
		})
	);

}

// this method is called when your extension is deactivated
export function deactivate() {}
