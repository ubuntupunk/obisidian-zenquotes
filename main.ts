import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, requestUrl } from 'obsidian';

interface XenQuotesSettings {
	mySetting: string;
	showRibbonIcon: boolean;
}

const DEFAULT_SETTINGS: XenQuotesSettings = {
	mySetting: 'random',
	showRibbonIcon: true
}

export default class XenQuotes extends Plugin {
	settings: XenQuotesSettings;
	ribbonIconEl: HTMLElement | null = null;

	async onload() {
		await this.loadSettings();

		// Add ribbon icon
		if (this.settings.showRibbonIcon) {
			this.ribbonIconEl = this.addRibbonIcon('dice', 'XenQuotes Plugin', async (evt: MouseEvent) => {
				console.log('Ribbon icon clicked');
				const activeLeaf = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!activeLeaf) {
					console.error('No active Markdown editor found.');
					new Notice('No active note to insert quote into.');
					return;
				}
				await this.fetchAndInsertQuote(activeLeaf);
			});

			if (this.ribbonIconEl) {
				this.ribbonIconEl.addClass('my-plugin-ribbon-class');
			}
		}

		// Add command
		this.addCommand({
			id: 'fetch-quote-of-the-day',
			name: 'Fetch Quote of the Day',
			callback: async () => {
				const activeLeaf = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!activeLeaf) {
					new Notice("No active note to insert quote into.");
					return;
				}
				await this.fetchAndInsertQuote(activeLeaf);
			}
		});

		// Add settings tab
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	async fetchAndInsertQuote(view: MarkdownView) {
		try {
			console.log('Fetching quote...');
			const response = await requestUrl({ url: "https://zenquotes.io/api/random" });
			console.log('Response received:', response.status);
			
			if (response.status === 200) {
				const quoteData = JSON.parse(response.text);
				if (quoteData && quoteData.length > 0) {
					const quote = quoteData[0];
					const quoteText = `**Quote of the Day:**\n\n> ${quote.q}\n\n— ${quote.a}`;
					view.editor.replaceRange(quoteText, view.editor.getCursor());
					new Notice("Quote inserted successfully!");
				} else {
					new Notice("No quote available today.");
				}
			} else {
				new Notice(`Failed to fetch quote. Status: ${response.status}`);
			}
		} catch (error) {
			console.error("Error fetching quote:", error);
			new Notice("An error occurred while fetching the quote.");
		}
	}

	onunload() {
		if (this.ribbonIconEl) {
			this.ribbonIconEl.remove();
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: XenQuotes;

	constructor(app: App, plugin: XenQuotes) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		const announcementEl = containerEl.createDiv('announcement');
		announcementEl.addClass('announcement');

		const messageEl = announcementEl.createEl('p');
		messageEl.innerHTML = 'This plugin is currently limited to fetching random or daily quotes. You can also fetch quotes from specific authors! ' +
			'However, this feature requires a subscription to the ZenQuotes API. If you\'d like to help make this feature available to everyone, ' +
			'please consider supporting the project by: <br>' +
			'1. ⭐ Starring our repository on <a href="https://github.com/ubuntpunk/obsidian-xenquotes">GitHub</a><br>' +
			'2. 💝 Funding development and unlocking features for the entire community via <a href="https://buymeacoffee.com/ubuntupunk">buymeacoffee.com</a><br>' +
			'3. 🤝 Joining our <a href="https://github.com/ubuntupunk/discussion">community discussions on GitHub</a>';

		new Setting(containerEl)
			.setName('Quote Mode')
			.setDesc('Choose how you want to fetch quotes')
			.addDropdown(dropdown => dropdown
				.addOption('random', 'Random Quote')
				.addOption('today', 'Quote of the Day')
				.addOption('author', 'By Author (Coming Soon)')
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
						if (!this.plugin.ribbonIconEl) {
							this.plugin.ribbonIconEl = this.plugin.addRibbonIcon('dice', 'XenQuotes Plugin', async (evt: MouseEvent) => {
								console.log('Ribbon icon clicked');
								const activeLeaf = this.plugin.app.workspace.getActiveViewOfType(MarkdownView);
								if (!activeLeaf) {
									console.error('No active Markdown editor found.');
									new Notice('No active note to insert quote into.');
									return;
								}
								await this.plugin.fetchAndInsertQuote(activeLeaf);
							});
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
