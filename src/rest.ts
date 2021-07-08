// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
'use strict';

import cp = require('child_process');
import vscode = require('vscode');
import path = require('path');
import { getFileArchive, byteOffsetAt, unCommitedChanges } from './util';
import fs = require('fs');

// Interface for settings configuration for adding and removing tags
interface GoTagsConfig {
	[key: string]: any;
	tags: string;
	options: string;
	promptForTags: boolean;
	template: string;
}

export function generateRest(commandArgs: GoTagsConfig) {
	const args = getCommonArgs();
	run(args);
}

function getCommonArgs(): string[] {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showInformationMessage('No editor is active.');
		return [];
	}
	if (!editor.document.fileName.endsWith('.go')) {
		vscode.window.showInformationMessage('Current file is not a Go file.');
		return [];
	}
	const args = ['-file', editor.document.fileName, '-type', 'rest'];
	if (
		editor.selection.start.line === editor.selection.end.line
	) {
		// Add tags to the whole struct
		const offset = byteOffsetAt(editor.document, editor.selection.start);
		args.push('-line');
		args.push(`${editor.selection.start.line}`);
	} else if (editor.selection.start.line < editor.selection.end.line) {
		// Add tags to selected lines
		args.push('-line');
		args.push(`${(editor.selection.end.line + editor.selection.start.line) / 2}`);
	}

	return args;
}


function run(args: string[]) {
	// const gomodifytags = getBinPath('gomodifytags');
	const cmd = 'lazy-go';
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No editor is active.');
		return;
	}
    if ( !domainObject(editor.document.fileName) ) {
        vscode.window.showErrorMessage('only can run in domain directory');
        return;
    }
    const outputFile = outputFilePath(editor.document.fileName);

    if ( !unCommitedChanges(path.dirname(outputFile)) ){
        vscode.window.showErrorMessage('Make sure all changes are commited before generating code');
        return;
    }

	const input = getFileArchive(editor.document);
	const p = cp.execFile(cmd, args, {}, (err, stdout, stderr) => {
		// if (err && (<any>err).code === 'ENOENT') {
		// 	promptForMissingTool('gomodifytags');
		// 	return;
		// }
		if (err) {
			vscode.window.showInformationMessage(`Cannot generate db implementation: ${stderr}`);
			return;
		}

		// const output = <GomodifytagsOutput>JSON.parse(stdout);
		// vscode.window.showInformationMessage(stdout);
		fs.writeFile(outputFile, stdout, {}, () => {});
		vscode.window.showTextDocument(vscode.Uri.file(outputFile));

		editor.edit((editBuilder) => {
		// 	editBuilder.insert(new vscode.Position(0, 0), 'i love you\n');
			// editBuilder.replace(new vscode.Range(output.start - 1, 0, output.end, 0), output.lines.join('\n') + '\n');
		});
	});
	if (p.pid) {
		if (p.stdin){
			p.stdin.end(input);
		}
	}

	vscode.window.showInformationMessage('db implementation generated at', outputFile);
}

function outputFilePath(cur: string): string {
    const filename = path.basename(cur);
    const p = path.dirname(cur).replace('domain', 'rest');
    return path.join(p, filename);
}

function domainObject(cur: string): boolean {
    return path.dirname(cur).includes('/internal/domain');
}
