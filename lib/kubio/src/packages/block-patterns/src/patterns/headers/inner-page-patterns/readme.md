How to export a header

- Go to the page that contains the header
- Select the header block and open the chrome developer tools console
- Write this command: 
  - kubio.utils.transformBlockToTemplate(wp.data.select('core/block-editor').getSelectedBlock())
- Copy the header code in the data and delete the slug and theme attributes
- At this point the header's third parameter is an empty array. This parameter contains the innerBlocks
- Select the header children one by one and use the command from above and add the result manually in the header
- Add name, index and other data like the other headers to be compatible with colibri templates
