import * as vscode from 'vscode';
import Window = vscode.window;
import QuickPickItem = vscode.QuickPickItem;
import QuickPickOptions = vscode.QuickPickOptions;

class PathQuickPickItem implements QuickPickItem {
	label: string;
	detail: string;
	action: string;

	constructor(transformationName: string, path: string, transformationAction: string) {
		this.label = transformationName;
		this.detail = path;
		this.action = transformationAction;
	}
}

type Transformation = {
	name: string;
	actions: [action: string];
	replacements: [{ find: string; replace: string; isRegex: boolean; flags: string }];
};

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

	return;
}

function buildQickPickOptions(resource: any) {
	const config = vscode.workspace.getConfiguration('pathmaker', resource);

	if (!config) {
		Window.showErrorMessage(`Incorrect configuration.`);
		return;
	}

	let opts: QuickPickOptions = { matchOnDescription: true, matchOnDetail: true, placeHolder: 'Select an action...', title: 'PathMaker' };
	let items: PathQuickPickItem[] = [];

	const transformations: [] = config.get('transformations') || [];

	transformations.forEach((transformation: Transformation) => {
		let workPath = resource.fsPath.replaceAll('\\', '/');

		const actions = transformation.actions || ['Copy'];

		transformation.replacements.forEach((replacement) => {
			if (replacement.isRegex) {
				var regExp = new RegExp(replacement.find, replacement.flags || '');
				workPath = workPath.replace(regExp, replacement.replace);
			} else {
				workPath = workPath.replace(replacement.find, replacement.replace);
			}
		});

		actions.forEach((action: string, index: number) => {
			items.push(new PathQuickPickItem(`${action.toLocaleLowerCase() === 'copy' ? `$(clippy)` : `$(globe)`} ${action} ${transformation.name}`, workPath, action));
		});
	});

	Window.showQuickPick(items, opts).then((selection) => {
		if (!selection) {
			return;
		}

		switch (selection.action.toLocaleLowerCase()) {
			case 'copy':
				vscode.env.clipboard.writeText(selection.detail as string);

				return;

			case 'browse':
				try {
					vscode.env.openExternal(vscode.Uri.parse(selection.detail as string));
				} catch (error) {
					vscode.window.showErrorMessage(`${selection.detail} is not a valid URL.`);
				}

				return;

			default:
				Window.showErrorMessage(`Incorrect configuration.`);

				break;
		}

		return;
	});
}

export function deactivate() {}
