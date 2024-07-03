import { Plugin } from 'prosemirror-state';
import 'katex/dist/katex.min.css';
import katex from 'katex';

const latexPlugin = new Plugin({
  props: {
    decorations(state) {
      const decorations = [];
      state.doc.descendants((node, pos) => {
        if (node.isText) {
          const regex = /\$\$([^$]+)\$\$|\\begin\{([a-z*]+)\}[\s\S]+?\\end\{\2\}/g;
          let match;
          while ((match = regex.exec(node.text)) !== null) {
            const start = pos + match.index;
            const end = start + match[0].length;

            const decoration = document.createElement('div');
            decoration.classList.add('latex');
            katex.render(match[0], decoration, { displayMode: true });

            decorations.push(Decoration.widget(start, decoration));
            decorations.push(Decoration.widget(end, document.createTextNode('')));
          }
        }
      });
      return DecorationSet.create(state.doc, decorations);
    },
  },
});

export default latexPlugin;
