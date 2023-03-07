import * as vscode from 'vscode';
import Window = vscode.window;
import QuickPickItem = vscode.QuickPickItem;
import QuickPickOptions = vscode.QuickPickOptions;

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('pathmaker.getEditorUri', getEditorUri));
	context.subscriptions.push(vscode.commands.registerCommand('pathmaker.getExplorerContextMenuUri', getExplorerContextMenuUri));
}

function getExplorerContextMenuUri(resource: any) {
	buildQickPickOptions(resource);
}

function getEditorUri() {
	const editor = Window.activeTextEditor;

	if (!editor || editor.document.isUntitled) {
		Window.showErrorMessage(`Open an existing file to use PathMaker.`);
		return;
	}

	const resource = editor.document.uri;

	if (!vscode.workspace.getWorkspaceFolder(resource)) {
		Window.showErrorMessage(`File must be located within the currently-open workspace to use PathMaker.`);
		return;
	}

	buildQickPickOptions(resource);
}

function buildQickPickOptions(resource: any) {
	let opts: QuickPickOptions = { matchOnDescription: true, matchOnDetail: true, placeHolder: 'Select an action...', title: 'PathMaker' };
	let items: QuickPickItem[] = [];

	const config = vscode.workspace.getConfiguration('pathmaker', resource);

	if (!config) {
		Window.showErrorMessage(`Incorrect configuration.`);
		return;
	}

	const transformations: [] = config.get('transformations') || [];

	transformations.forEach((transformation: { name: string; action: string; replacements: [{ find: string; replace: string }] }) => {
		let workPath = resource.fsPath.replaceAll('\\', '/');

		const action = transformation.action || 'Copy';

		transformation.replacements.forEach((replacement) => {
			workPath = workPath.replace(replacement.find, replacement.replace);
		});

		items.push({ label: `${action} ${transformation.name}`, detail: workPath });
	});

	Window.showQuickPick(items, opts).then((selection) => {
		if (!selection) {
			return;
		}

		if (selection.label.indexOf('Copy ') === 0) {
			vscode.env.clipboard.writeText(selection.detail as string);
		} else if (selection.label.indexOf('Browse ') === 0) {
			try {
				vscode.env.openExternal(vscode.Uri.parse(selection.detail as string));
			} catch (error) {
				vscode.window.showErrorMessage(`${selection.detail} is not a valid URL.`);
				return;
			}
		}
	});
}

export function deactivate() {}
