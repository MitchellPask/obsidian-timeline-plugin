# Obsidian Vertical Timeline Plugin
A simple Obsidian plugin that adds a vertical timeline with some basic custom styling

## Features
- Vertical timeline organization
- Side ribbon button to insert a timeline block template on the cursor
- Simple markdown style formatting
- Custom flavor tags and date/ranges in headers/subheaders

## Future Plans
- Additional styling options

## Installation
1. Clone or download this repository
2. Move the timeline plugin folder to your vault's `plugins` directory
3. Enable the timeline plugin
    - `Settings` > `Community Plugins` > Turn off `Safe Mode` > Enable `Vertical Timeline` plugin

## Syntax Example
```markdown
```timeline
# [blue:Tag Text] Example Heading (1999 - 2000 AD)
- Headers/Subheaders:
    - Tags are formatted like [color:text]
    - Date/range(s) can take any characters within parantheses before and/or after header text
## [purple:tagtagtag] Example Subheading (1999)
- The Obsidian markdown renderer is reactivated within content areas*
- (*Below and between headers and subheaders)
- All standard Obsidian rendered markdown should work within the block
```
```

## Screenshots
N/A

## License
[MIT License](LICENSE.md)