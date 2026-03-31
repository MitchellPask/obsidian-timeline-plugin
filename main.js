const { Plugin, MarkdownView, Notice, MarkdownRenderer } = require('obsidian');

class TimelinePlugin extends Plugin {
    async onload() {
        console.log('Timeline plugin successfully loaded!');

        // https://lucide.dev/icons/
        // cat, panda, activity, calendar-plus, calendar-sync, chart-gantt
        // Ribbon icon for plugin - Inserts very basic timeline structure to get started with
        this.addRibbonIcon('cat', 'Insert Timeline', (evt) => {
            // console.log('Ribbon Icon Clicked!')
            const view = this.app.workspace.getActiveViewOfType(MarkdownView);
            const editor = view?.editor;

            if (!editor) {
                console.log("No active editor. Cursor not in document.");
                new Notice ("Cursor must be inside an open document.")
                return;
            }

            // Trailing formatting only for preserving code indentation
            const template = 
                `\`\`\`timeline
                # [blue:Tag Text] Example Heading (1999 - 2000 AD)
                - Headers/Subheaders:
                    - Tags are formatted like [color:text]
                    - Date/range(s) can take any characters between round brackets
                        - They can also go in front of the header/subheader, or behind
                - The Obsidian markdown renderer is reactivated within content areas*
                - (*Below, and between, headers and subheaders)
                - Unordered lists, numbered lists, callouts, whatever, **should** all be functional

                ## [purple:tagtagtag] (1999) Example Subheading
                Obligatory Lorem Ispum placeholder:
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                
                > [!ABSTRACT]- Example Callout
                > Callouts function below headings.
                > They can also be nested still.
                \`\`\``
                .split('\n')
                .map(line => line.trim())
                .filter(line => Boolean(line))
                .join('\n');

            editor.replaceSelection(template);

            new Notice ("Timeline template inserted :)")
        });

    this.registerMarkdownCodeBlockProcessor('timeline', (source, container, context) => {
        const lines = source.split('\n');
        const timeline = container.createEl('div', { cls: 'timeline' });

        let currentSection = null;
        let currentHeading = null;
        let contentBuffer = [];

        const flushBuffer = () => {
            if (contentBuffer.length === 0 || !currentSection) return;
            const entry = currentSection.createEl('div', { cls: 'tl-entry' });
            MarkdownRenderer.render(this.app, contentBuffer.join('\n'), entry, context.sourcePath, this);
            contentBuffer = [];
        };

        for (const line of lines) {
            if (line.startsWith('# ')) {
                flushBuffer();
                currentSection = timeline.createEl('details', { cls: 'tl-section' });
                currentHeading = currentSection;
                const summary = currentSection.createEl('summary', { cls: 'tl-heading' });
                this.buildSummary(summary, line.slice(2));

                } else if (line.startsWith('## ')) {
                flushBuffer();
                const subSection = currentHeading.createEl('details', { cls: 'tl-section' });
                const summary = subSection.createEl('summary', { cls: 'tl-subheading' });
                this.buildSummary(summary, line.slice(3));
                currentSection = subSection;

            } else {
                contentBuffer.push(line);
            }
        }

        flushBuffer();
        });
    }

    onunload() {
        console.log('Timeline plugin unloaded!')
    }

    buildSummary(summary, line) {
        const { tag, tagText, parts } = this.parseHeading(line);

        if (tag) {
            summary.createEl('span', { cls: `tl-tag tl-${tag}`, text: tagText });
        }
        for (const part of parts) {
            if (part.type === 'date') {
                summary.createEl('span', { cls: 'tl-date', text: `(${part.value})` });
            } else if (part.value) {
                summary.createEl('span', { text: `${part.value}` });
            }
        }
    }

    parseHeading(line) {
        const parts = [];

        // Match tags
        const tagMatch = line.match(/^\[(\w+)(?::([^\]]+))?\]\s*/);
        /* Regex breakdown: 
            ^ = start from beginning of string
            [ ] = match square brackets
            (w+) = capture one or more or more characters as a capture group
            ?:: = find if separating colon is present
            ([^\]]+))? = if colon is present, match following content
            s* = match zero or more spaces after the bracket */
        const tag = tagMatch ? tagMatch[1] : null;
        const tagText = tagMatch ? (tagMatch[2] || tagMatch[1]) : null;
        line = tagMatch ? line.slice(tagMatch[0].length) : line;

        // Split remaining line into date and text parts in order
        const dateRegex = /\(([^)]+)\)/g;
        /* Regex breakdown:
            ( ) = match round brackets
            [^)]+ = capture group of characters before the closing round bracket
            g = global - find all matches of pattern within the string */
        let lastIndex = 0;
        let match;

        while ((match = dateRegex.exec(line)) !== null) {
            if (match.index > lastIndex) {
                parts.push({ type: 'text', value: line.slice(lastIndex, match.index).trim() });
            }
            parts.push({ 
                type: 'date', 
                value: match[1] 
            });
            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < line.length) {
            parts.push({ type: 'text', value: line.slice(lastIndex).trim() });
        }

        return { tag, tagText, parts };
    }
}

module.exports = TimelinePlugin;