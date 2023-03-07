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

		items.push({ label: `${action} ${transformation.name}`, description: workPath });
	});

	Window.showQuickPick(items, opts).then((selection) => {
		if (!selection) {
			return;
		}

		console.log(selection);

		if (selection.label.indexOf('Copy ') === 0) {
			vscode.env.clipboard.writeText(selection.description as string);
		} else if (selection.label.indexOf('Open ') === 0) {
			try {
				vscode.env.openExternal(vscode.Uri.parse(selection.description as string));
			} catch (error) {
				vscode.window.showErrorMessage(`${selection.description} is not a valid URL.`);
				return;
			}
		}
	});
}

export function deactivate() {}
