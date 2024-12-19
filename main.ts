import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, requestUrl } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
	showRibbonIcon: boolean;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'random',
	showRibbonIcon: true
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	ribbonIconEl: HTMLElement | null = null;

	async onload() {
		await this.loadSettings();

		if (this.settings.showRibbonIcon) {
			const ribbonIconEl = this.addRibbonIcon('dice', 'XenQuotes Plugin', (evt: MouseEvent) => {
				this.app.commands.executeCommandById('fetch-quote-of-the-day');
			});
			if (ribbonIconEl) {
				ribbonIconEl.addClass('my-plugin-ribbon-class');
			}
		}

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});

		// This adds a command to fetch and insert a quote of the day
		this.addCommand({
			id: 'fetch-quote-of-the-day',
			name: 'Fetch Quote of the Day',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				try {
					const mode = this.settings.mySetting;
					const response = await requestUrl(`https://zenquotes.io/api/${mode}`);
					if (response.status === 200) {
						const quoteData = response.json;
						if (quoteData && quoteData.length > 0) {
							const quote = quoteData[0];
							const quoteText = `**Quote of the Day:**\n\n> ${quote.q}\n\n— ${quote.a}`;
							editor.replaceSelection(quoteText);
							new Notice('Quote inserted successfully!');
						} else {
							new Notice("No quote available today.");
						}
					} else {
						new Notice(`Failed to fetch quote. Status: ${response.status}`);
					}
				} catch (error) {
					console.error("Error fetching quote:", error);
					new Notice("An error occurred while fetching the quote. Check console for details.");
				}
			}
		});

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		// Add feature announcement
		const announcementEl = containerEl.createEl('div', {
			cls: 'xenquotes-announcement'
		});

		announcementEl.createEl('h3', {
			text: '🌟 Coming Soon: Author-Specific Quotes!'
		});

		const messageEl = announcementEl.createEl('p');
		messageEl.innerHTML = 'We have an exciting feature in development that will allow you to fetch quotes from specific authors! ' +
			'This feature requires a paid ZenQuotes API access. If you\'d like to help make this feature available to everyone, ' +
			'please consider supporting the project by: <br>' +
			'1. ⭐ Starring our repository on <a href="https://github.com/ubuntpunk/obsidian-xenquotes">GitHub</a><br>' +
			'2. 💝 Fund development and unlock features for the entire community via <a href="https://buymeacoffee.com/ubuntupunk">buymeacoffee.com</a> ' +
			'3. 🤝 Joining our community discussions on GitHub';

		// Add some spacing
		containerEl.createEl('br');

		new Setting(containerEl)
			.setName('Choose quotation mode')
			.setDesc('Choose from [quotes, today, random]')
			.addText(text => text
				.setPlaceholder('Enter mode here')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Show Ribbon Icon')
			.setDesc('Toggle the visibility of the ribbon icon')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showRibbonIcon)
				.onChange(async (value) => {
					this.plugin.settings.showRibbonIcon = value;
					await this.plugin.saveSettings();
					if (value) {
						this.plugin.ribbonIconEl = this.plugin.addRibbonIcon('dice', 'XenQuotes Plugin', (evt: MouseEvent) => {
							this.plugin.app.commands.executeCommandById('fetch-quote-of-the-day');
						});
						if (this.plugin.ribbonIconEl) {
							this.plugin.ribbonIconEl.addClass('my-plugin-ribbon-class');
						}
					} else {
						if (this.plugin.ribbonIconEl) {
							this.plugin.ribbonIconEl.remove();
							this.plugin.ribbonIconEl = null;
						}
					}
				}));
	}
}

class XenQuotes extends Plugin {
    async onload() {
        this.addCommand({
            id: 'fetch-quote-of-the-day',
            name: 'Fetch Quote of the Day',
            callback: async () => {
                try {
                    const response = await this.requestUrl({ url: "https://zenquotes.io/api/random" });
                    if (response.status === 200) {
                        const quoteData = JSON.parse(response.text);
                        if (quoteData && quoteData.length > 0) {
                            const quote = quoteData[0];
                            const quoteText = `**Quote of the Day:**\n\n> ${quote.q}\n\n— ${quote.a}`;
                            // Assuming you want to insert this into the current note
                            const activeLeaf = this.app.workspace.getActiveViewOfType(MarkdownView);
                            if (activeLeaf) {
                                activeLeaf.editor.replaceRange(quoteText, activeLeaf.editor.getCursor());
                            } else {
                                new Notice("No active note to insert quote into.");
                            }
                        } else {
                            new Notice("No quote available today.");
                        }
                    } else {
                        new Notice("Failed to fetch quote.");
                    }
                } catch (error) {
                    console.error("Error fetching quote:", error);
                    new Notice("An error occurred while fetching the quote.");
                }
            }
        });
    }
}
