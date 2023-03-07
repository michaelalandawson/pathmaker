# PathMaker

An extension for Visual Studio Code that generates user-defined path variations based on the current editor or through the explorer view context menu.

Generated paths, displayed in the Quick Pick list, can then be copied to the clipboard or opened in the default browser.

![PathMaker-readme](https://user-images.githubusercontent.com/39276677/219970869-6443d3ba-fd88-45a6-8087-b07fb986a654.gif)

## Features and Functionality

- Generates multiple path formats based on the selected file or current editor.
- Transforms the file path using user-specified values.
- Supports regular expressions.
- Supports unlimited path transformations and unlimited replacements within each transformation.
- Supports multi-folder workspaces.
- Generated paths will be displayed in VS Code's Quick Pick list.
- Allows regular or compact list display.

## Support

If you find this extension to be useful, please consider supporting further development.

[<img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif"/>](https://www.paypal.com/donate/?business=UH4GUUNGPUXMA&no_recurring=1&item_name=Thank+you+for+supporting+future+development+of+this+extension+and+others%21&currency_code=USD)

## Configuration

NOTE: *Path separators are normalized to "/" before any transformations are processed.*

Paths are generated using one or more transformations. Each transformation can provide one or more replacements.

A replacement can be either a simple string or a regular expression.

### Compact list display

settings.json

```
{
    "pathmaker.compact": <boolean>,
    "pathmaker.transformations": [...snip...]
}
```

When true, the transformations are displayed on one line in the QuickPick list.  When false, the transformation is displayed on two lines.  The default is false.

### Transformation properties:

- "name": A custom name to describe the action. This will be displayed in the Quick Pick list.
- "actions": An array of actions. Values include "Copy" and "Browse".
  - ["Copy"]: Displays an option to copy the selected path to the clipboard.
  - ["Browse"]: Displays an option to open the selected path in the default browser.
  - ["Copy", "Browse"]: Displays options to copy or browse the selected path.
- "replacements": An array of find/replace pairs. The replacements take place in the order of the array. Regular expressions are supported.  If the array is empty, PathMaker will return the full file path.

## Example Transformations

### Local path to a remote URI

Input: `c:\home\mydomain.com\wwwroot\index.htm`<br>
Output: `https://mydomain.com/index.htm`

By default, an entry to copy the transformed path will appear in the QuickPick list.

settings.json

```
{
	"pathmaker.compact": true,
	"pathmaker.transformations": [
		{
			"name": "URL",
			"replacements": [{ "find": "c:/home/mydomain.com/wwwroot", "replace": "https://mydomain.com" }]
		}
	]
}
```

---

### Case-insensitive regular expression

Input: `c:\home\mydomain.com\wwwroot\index.htm`<br>
Input: `c:\home\mydomain.com\includes\index.htm`<br>
Output: `https://mydomain.com/index.htm`

An entry to browse the transformed path will appear in the QuickPick list.

settings.json

```
{
	"pathmaker.transformations": [
		{
			"name": "URL",
			"actions": ["Browse"],
			"replacements": [{
				"find": "c:/home/mydomain.com/(wwwroot|includes)",
				"replace": "https://mydomain.com",
				"isRegex": true,
				"flags": "i"
			}]
		}
	]
}
```

---

### Multiple replacements in a single transformation

Input: `c:\home\mydomain.com\wwwroot\site-modules\form.htm`<br>
Input: `c:\home\mydomain.com\wwwroot\modules\form.htm`<br>
Output: `https://mytestdomain.com/form.php`

Entries to copy or browse the transformed path will appear in the QuickPick list.

settings.json

```
{
	"pathmaker.transformations": [
		{
			"name": "Testing Site URL",
			"actions": ["Copy", "Browse"],
			"replacements": [
				{ "find": "c:/home/mydomain.com/wwwroot", "replace": "https://mytestdomain.com" },
				{ "find": "(/site-modules|/modules)", "replace": "", "isRegex": true },
				{ "find": "/form.htm", "replace": "/form.php" }
			]
			}]
		}
	]
}
```

---

### Multiple transformations

settings.json

```
{
	"pathmaker.transformations": [
		{
			"name": "URL 1",
			"replacements": [{ "find": "c:/home/mydomain.com/wwwroot", "replace": "https://mydomain.com" }]
		},
		{
			"name": "URL 2",
			"actions": ["Browse"],
			"replacements": [{
				"find": "c:/home/mydomain.com/(wwwroot|includes)",
				"replace": "https://mydomain.com",
				"isRegex": true,
				"flags": "i" }]
		},
		{
			"name": "Testing Site URL",
			"actions": ["Copy", "Browse"],
			"replacements": [
				{ "find": "c:/home/mydomain.com/wwwroot", "replace": "https://mytestdomain.com" },
				{ "find": "(/site-modules|/modules)", "replace": "", "isRegex": true },
				{ "find": "/form.htm", "replace": "/form.php" }
			]
		}
	]
}
```
## Change Log

[View the change log](CHANGELOG.md)
