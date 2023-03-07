# PathMaker

An extension for Visual Studio Code that generates user-defined path variations based on the current editor or through the explorer view context menu. Generated paths can then be copied to the clipboard or opened in the default browser.

Why Pathmaker?

[reasons for pathmaker]

## Features and Functionality

- Generates multiple path formats based on the selected file or current editor.
- Transforms the file path using user-specified values.
- Supports unlimited path transformations and unlimited replacements within each transformation.
- Supports multi-folder workspaces.
- Generated paths will be displayed in VS Code's quick pick list.

## Configuration

Paths are generated using one or more transformations. Each transformation contains a name and an array of replacements.

All transformations can be copied to the clipboard. Optionally, an action can be specified to open the generated path in the default browser.

Path separators are normalized to "/".

Sample configration:

```
{
	"pathmaker.transformations": [
		{
			"name": "URL",
			"action": "Browse",
			"replacements": [{ "find": "c:/home/mydomain.com/wwwroot", "replace": "https://mydomain.com" }]
		},
		{
			"name": "Include",
			"replacements": [{ "find": "c:/home/mydomain.com/wwwroot", "replace": "" }]
		},
		{
			"name": "Parent URL",
			"action": "Browse",
			"replacements": [
				{ "find": "c:/home/mydomain.com/wwwroot", "replace": "https://mydomain.com" },
				{ "find": "/_modules", "replace": "" }
			]
		}
	]
}
```

Transformation properties:

- "name": A custom name to describe the action. This will be displayed in the Quick Pick list.
- "action": An array of actions. Values can be "Copy" or "Browse".
  - ["Copy"]: Displays an option to copy the selected path to the clipboard.
  - ["Browse"]: Displays an option to open the selected path in the default browser.
  - ["Copy", "Browse"]: Displays options to copy or browse the selected path.

This configuration provides three path transformations:

1. "URL", replaces the local path with a domain name.
2. "Include", generates a path that can be used as an include file.
3. "Parent URL", replaces the local path with a domain name, and removes the "/\_modules" folder from the path.

## Change Log

[View the change log](CHANGELOG.md)
