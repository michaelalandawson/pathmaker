import * as vscode from 'vscode';
import Window = vscode.window;
import QuickPickItem = vscode.QuickPickItem;
import QuickPickOptions = vscode.QuickPickOptions;

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('pathmaker.showPathOptions', showPathOptions));
}

function showPathOptions() {
	const editor = Window.activeTextEditor;

	if (!editor) {
		Window.showErrorMessage(`Open a file to use PathMaker.`);
		return;
	}

	if (editor.document.isUntitled) {
		Window.showErrorMessage(`File must be saved to use PathMaker.`);
		return;
	}

	const resource = editor.document.uri;

	if (!vscode.workspace.getWorkspaceFolder(resource)) {
		Window.showErrorMessage(`File must be located within the currently-open workspace to use PathMaker.`);
		return;
	}

	let opts: QuickPickOptions = { matchOnDescription: true, matchOnDetail: true, placeHolder: 'Select an action...', title: 'PathMaker' };
	let items: QuickPickItem[] = [];

	items.push({ label: 'Copy Path', description: resource.fsPath });

	const filename = resource.fsPath.split('\\').pop();
	items.push({ label: 'Copy Filename', description: filename });

	const config = vscode.workspace.getConfiguration('pathmaker', resource);

	if (!config) {
		Window.showErrorMessage(`Incorrect configuration.`);
		return;
	}

	const transformations: [] = config.get('transformations') || [];

	transformations.forEach((transformation: { name: string; replacements: [{ find: string; replace: string }] }) => {
		let workPath = resource.fsPath.replaceAll('\\', '/');

		transformation.replacements.forEach((replacement) => {
			workPath = workPath.replace(replacement.find, replacement.replace);
		});

		items.push({ label: `Copy ${transformation.name}`, description: workPath });
	});

	Window.showQuickPick(items, opts).then((selection) => {
		if (!selection) {
			return;
		}

		vscode.env.clipboard.writeText(selection.description as string);
	});
}

export function deactivate() {}
