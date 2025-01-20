import { App, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, requestUrl } from 'obsidian';
//import { promises as fs } from 'fs'; // Import fs module

interface XenQuotesSettings {
	mySetting: string;
	showRibbonIcon: boolean;
	enableImageQuote: boolean;
	imageDirectory: string;
	saveImagesLocally: boolean;
	enableOnThisDay: boolean;
	selectedCentury: number; 
	selectedDecade: number;   
	allCenturies: boolean;
	allDecades: boolean;
}

const DEFAULT_SETTINGS: XenQuotesSettings = {
	mySetting: 'random',
	showRibbonIcon: true,
	enableImageQuote: false,
	imageDirectory: './images',
	saveImagesLocally: false,
	enableOnThisDay: false,
	selectedCentury: 21,
	selectedDecade: 0,
	allCenturies: false,
	allDecades: false,
}

const cleanText = (text: string) => {
	return text.replace(/&#8211;/g, '-')
			   .replace(/\s+/g, ' ')
			   .trim(); // Remove extra spaces and trim
};

// Helper function to get century from year
const getCentury = (year: number): number => Math.ceil(year / 100);

// Helper function to get decade from year
const getDecade = (year: number): number => Math.floor((year % 100) / 10);

// Helper function to filter events by year
const filterEventsByYear = (events: any[], century: number | null = null, decade: number | null = null): any[] => {
    return events.filter(event => {
        const yearMatch = event.text.match(/\b\d{4}\b/);
        if (!yearMatch) return false;
        
        const year = parseInt(yearMatch[0]);
        const eventCentury = getCentury(year);
        const eventDecade = getDecade(year);
        
        if (century && decade) {
            return eventCentury === century && eventDecade === decade;
        } else if (century) {
            return eventCentury === century;
        } else if (decade) {
            return eventDecade === decade;
        }
        return true;
    });
};

// Function to format the date
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options).replace(/\s+/g, ' ');
};

export default class XenQuotes extends Plugin {
	settings: XenQuotesSettings;
	ribbonIconEl: HTMLElement | null = null;

	async onload() {
		await this.loadSettings();

		// Add ribbon icon
		if (this.settings.showRibbonIcon) {
			this.ribbonIconEl = this.addRibbonIcon('dice', 'XenQuotes plugin', async (evt: MouseEvent) => {
				console.log('Ribbon icon clicked');
				const activeLeaf = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!activeLeaf) {
					console.error('No active Markdown editor found.');
					new Notice('No active note to insert quote into.');
					return;
				}
				if (this.settings.enableImageQuote) {
                    await this.fetchRandomImageQuote(activeLeaf);
                } else if (this.settings.enableOnThisDay) {
                    await this.fetchOnThisDayQuote(activeLeaf);
                } else if (this.settings.enableQuoteOfTheDay) {
                   await this.fetchQuoteOfTheDay(activeLeaf);
               } else {
                   await this.fetchAndInsertQuote(activeLeaf);
               }
            });

			if (this.ribbonIconEl) {
				this.ribbonIconEl.addClass('xenquotes-ribbon-class');
			}
		}

		// Add command
         this.addCommand({
            id: 'fetch-quote-of-the-day',
            name: 'Fetch quote of the day',
            editorCallback: async (editor: Editor, view: MarkdownView) => {
                if (!view) {
                    new Notice("No active note to insert quote into.");
                    return;
               }
                if (this.settings.enableImageQuote) {
                    await this.fetchRandomImageQuote(view);
               } else if (this.settings.enableOnThisDay) {
                    await this.fetchOnThisDayQuote(view);
               } else {
                    await this.fetchAndInsertQuote(view);
               }
             }
         });

		

		// Add settings tab
		this.addSettingTab(new XenQuotesSettingTab(this.app, this));
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
					const quoteText = `>[!quote]+ Quote of the Day:\n>\n> ${quote.q}\n>\n> — <cite>${quote.a}</cite> \u270D\uFE0F\n---`;
					view.editor.replaceRange(quoteText, view.editor.getCursor());
					new Notice("Daily Quote inserted successfully!");
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

	async fetchRandomImageQuote(view: MarkdownView) {
    try {
        const response = await requestUrl({ 
            url: "https://zenquotes.io/api/image", 
            method: "GET"
        });

        if (response.status === 200) {
            if (this.settings.saveImagesLocally) {
                const imageDir = this.settings.imageDirectory;
                const imagePath = `${imageDir}/random-image.jpg`;

                // Check if the directory exists
                const dirExists = await this.app.vault.adapter.exists(imageDir);
                if (!dirExists) {
                    // Create the directory if it doesn't exist
                    await this.app.vault.createFolder(imageDir);
                }

                // Write the binary data
                if (response.arrayBuffer) {
                    await this.app.vault.createBinary(imagePath, Buffer.from(response.arrayBuffer));
                    
                    // Use a relative path for the markdown link
                    const relativePath = `${this.settings.imageDirectory}/random-image.jpg`;
                    const quote = ""; // Placeholder for the quote
                    const quoteText = `## Daily Image\n\n![Random Image](${relativePath})\n\n ${quote}`;
                    view.editor.replaceRange(quoteText, view.editor.getCursor());
                    new Notice("Random image and quote inserted successfully!");
                } else {
                    throw new Error("No binary data available in response");
                }
            } else {
                const quote = ""; // Placeholder for the quote
                const quoteText = `## Daily Image & Quote\n\n![Random Image](${response.url})\n\n> ${quote}`;
                view.editor.replaceRange(quoteText, view.editor.getCursor());
                new Notice("Random image and quote inserted successfully!");
            }
        } else {
            new Notice("Failed to fetch random image and quote.");
        }
    } catch (error) {
        console.error("Error fetching random image and quote:", error);
        new Notice("An error occurred while fetching the random image and quote.");
    }
}

	async fetchOnThisDayQuote(view: MarkdownView) {
		const today = new Date();
		const month = today.getMonth() + 1; // Months are zero-based
		const day = today.getDate();
		const century = this.settings.selectedCentury;
		const decade = this.settings.selectedDecade;
		
		const url = `https://today.zenquotes.io/api/${month}/${day}`;
		
		console.log("Calling URL:", url);

		try {
			const response = await requestUrl({ url, method: "GET" });
			console.log("API Response Status:", response.status);

			if (response.status === 200 && response.json) {
				const apiData = response.json;
				
				if (apiData.data) {
					let { Events = [], Births = [], Deaths = [] } = apiData.data;
					
					// Apply filters based on settings
					if (this.settings.allCenturies && this.settings.allDecades) {
						// No filtering needed, show all events
					} else if (this.settings.allCenturies) {
						// Filter only by decade
						Events = filterEventsByYear(Events, null, decade);
						Births = filterEventsByYear(Births, null, decade);
						Deaths = filterEventsByYear(Deaths, null, decade);
					} else if (this.settings.allDecades) {
						// Filter only by century
						Events = filterEventsByYear(Events, century, null);
						Births = filterEventsByYear(Births, century, null);
						Deaths = filterEventsByYear(Deaths, century, null);
					} else if (century && decade) {
						// Filter by both century and decade
						Events = filterEventsByYear(Events, century, decade);
						Births = filterEventsByYear(Births, century, decade);
						Deaths = filterEventsByYear(Deaths, century, decade);
					}

					console.log("API Response Data:", apiData);	
					let currentYear = today.getFullYear(); // Get the current year	
					let output = `## On This Day ${formatDate(`${month}/${day}/${currentYear}`)}\n\n`;
					if (Events && Events.length) {
						output += "### Events:\n";
						Events.forEach(event => {
							output += `- [${cleanText(event.text)}](https://wikipedia.org/wiki/${cleanText(event.text)})\n`;
						});
					}

					if (Births && Births.length) {
						output += "\n### Births:\n";
						Births.forEach(birth => {
							output += `- [${cleanText(birth.text)}](https://wikipedia.org/wiki/${cleanText(birth.text)})\n`;
						});
					}

					if (Deaths && Deaths.length) {
						output += "\n### Deaths:\n";
						Deaths.forEach(death => {
							output += `- [${cleanText(death.text)}](https://wikipedia.org/wiki/${cleanText(death.text)})\n`;
						});
					}

					if (!Events.length && !Births.length && !Deaths.length) {
						output += "No events found for the selected time period.\n";
					}

					view.editor.replaceRange(output, view.editor.getCursor());
					new Notice("On This Day information inserted successfully!");
				} else {
					console.error("Unexpected data structure:", apiData);
					new Notice("Received unexpected data structure from API.");
				}
			} else {
				new Notice(`Failed to fetch On This Day information. Status: ${response.status}`);
			}
		} catch (error) {
			console.error("Error fetching On This Day information:", error);
			new Notice("An error occurred while fetching the On This Day information.");
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

//@PluginSettingTab
class XenQuotesSettingTab extends PluginSettingTab {
	plugin: XenQuotes;

	constructor(app: App, plugin: XenQuotes) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(container: HTMLElement) {
		const {containerEl} = this;

		containerEl.empty();

		const announcementEl = containerEl.createDiv('announcement');
		announcementEl.addClass('announcement');

		const messageEl = announcementEl.createEl('p');
	    messageEl.empty();
		
		messageEl.createSpan({
			text:  'This plugin is currently limited to fetching random or daily quotes, historical onthisday data and images. You can also fetch quotes from specific authors! ' +
          'However, this feature requires a subscription to the ZenQuotes API. If you\'d like to help make this feature available to everyone, and support further development such as formatting the quote & tags, ' +
          'please consider supporting the project by:'
		});

		const bulletList = messageEl.createEl('ul');

		const links = [
			{
				text: '⭐ Starring our repository on ',
                link: 'https://github.com/ubuntpunk/obsidian-xenquotes',
                linkText: 'GitHub'
			},
			{
				text: '💝 Funding development and unlocking features for the entire community via ',
                link: 'https://buymeacoffee.com/ubuntupunk',
                linkText: 'buymeacoffee.com'
			},
			{
				text: '🤝 Joining our ',
                link: 'https://github.com/ubuntupunk/obsidian-xenquotes/discussions',
                linkText: 'community discussions on GitHub'
			}
		];

		links.forEach(({ text, link, linkText }) => {
			const li = bulletList.createEl('li');
			li.createSpan({ text });
			li.createEl('a', { text: linkText, href: link });
		});
		

		new Setting(containerEl)
			.setName('Quote mode')
			.setDesc('Choose how you want to fetch quotes')
			.addDropdown(dropdown => dropdown
				.addOption('random', 'Random quote')
				.addOption('today', 'Quote of the day')
				.addOption('author', 'By author (coming soon)')
				.addOption('on-this-day', 'On this day quote')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Enable random image and quote')
			.setDesc('Toggle to fetch a random image along with the quote.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableImageQuote)
				.onChange(async (value) => {
					this.plugin.settings.enableImageQuote = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Image directory')
			.setDesc('Directory to save images locally')
			.addText(text => text
				.setPlaceholder('/Images')
				.setValue(this.plugin.settings.imageDirectory)
				.onChange(async (value) => {
					this.plugin.settings.imageDirectory = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Save images locally')
			.setDesc('Toggle to save images locally')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.saveImagesLocally)
				.onChange(async (value) => {
					this.plugin.settings.saveImagesLocally = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Enable on this day quotes')
			.setDesc('Fetch quotes from historical data based on the current date.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableOnThisDay)
				.onChange(async (value) => {
					this.plugin.settings.enableOnThisDay = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
            .setName('Custom decade')
            .setDesc('Enter a custom decade (0-9)')
            .addText(text => text
                .setPlaceholder('Enter decade')
                .setValue(this.plugin.settings.selectedDecade.toString())
                .onChange(async (value) => {
                    const decadeValue = parseInt(value);
                    if (!isNaN(decadeValue) && decadeValue >= 0 && decadeValue <= 9) {
                        this.plugin.settings.selectedDecade = decadeValue;
                        await this.plugin.saveSettings();
                    }
                }));

		new Setting(containerEl)
            .setName('Custom century')
            .setDesc('Enter the century for On ths day quotes (e.g., 21 for 21st century)')
            .addText(text => text
                .setPlaceholder('Enter century')
                .setValue(this.plugin.settings.selectedCentury.toString())
                .onChange(async (value) => {
                    const centuryValue = parseInt(value);
                    if (!isNaN(centuryValue) && centuryValue > 0) {
                        this.plugin.settings.selectedCentury = centuryValue;
                        await this.plugin.saveSettings();
                   }
               }));

		new Setting(containerEl)
			.setName('All centuries')
			.setDesc('Fetch quotes from all centuries')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.allCenturies)
				.onChange(async (value) => {
					this.plugin.settings.allCenturies = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('All decades')
			.setDesc('Fetch quotes from all decades')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.allDecades)
				.onChange(async (value) => {
					this.plugin.settings.allDecades = value;
					await this.plugin.saveSettings();
				}));

		const attribution = containerEl.createEl('div', { cls: 'xenquotes-attribution' });
		attribution.createSpan({ text: 'Inspiration quotes, images & historical data provided by ' });
		attribution.createEl('a', {
			     text: 'ZenQuotes API',
			     href: 'https://zenquotes.io/',
			     attr: { target: '_blank' }
			 });	
		attribution.createSpan({ text: ' • Developed by ' });
		attribution.createEl('a', {
			     text: 'ubuntupunk',
			     href: 'https://github.com/ubuntupunk',
			     attr: { target: '_blank' }
			  });	
		containerEl.appendChild(attribution);
	}
}
