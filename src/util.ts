
import cp = require('child_process');
// import fs = require('fs');
// import os = require('os');
// import path = require('path');
// import semver = require('semver');
// import util = require('util');
import vscode = require('vscode');


export function getFileArchive(document: vscode.TextDocument): string {
	const fileContents = document.getText();
	return document.fileName + '\n' + Buffer.byteLength(fileContents, 'utf8') + '\n' + fileContents;
}

export function byteOffsetAt(document: vscode.TextDocument, position: vscode.Position): number {
	const offset = document.offsetAt(position);
	const text = document.getText();
	return Buffer.byteLength(text.substr(0, offset));
}


export function unCommitedChanges(dir: string):boolean {
	let buf = cp.execSync(`cd ${dir} && git status`);
	return buf.includes('nothing to commit, working tree clean');
}