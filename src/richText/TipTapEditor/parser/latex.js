


/*
* This function will parse html and find strings that are valid latex, then wrap them in a latex tag
*/
// export const parseMathJax = (html) => {
//     // Regular expression to match both inline and block LaTeX equations
//     const latexRegex = /\$\$([^$]+)\$\$|\$(.+?)\$|\\begin\{([a-z*]+)\}[\s\S]+?\\end\{\3\}/g;

//     // Find all matches
//     const matches = html.match(latexRegex);
//     if (matches) {
//         matches.forEach(match => {
//             // Wrap each match with <mathjax> tags
//             html = html.replace(match, `<mathjax>${match}</mathjax>`);
//         });
//     }


//     return html;
// }

// export const parseMathJax = (html) => {
//     // Regular expression to match both inline and block LaTeX equations
//     const latexRegex = /\$\$([^$]+)\$\$|\$(.+?)\$|\\begin\{([a-z*]+)\}[\s\S]+?\\end\{\3\}/g;

//     // Find all matches
//     const matches = html.match(latexRegex);
//     if (matches) {
//         matches.forEach(match => {
//             // Encode special HTML characters to ensure the LaTeX code does not break HTML structure
//             const latexCode = match.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
            
//             // Wrap the LaTeX code in an HTML element with proper attribute quoting
//             const latexCodeWrapped = `<inline-tex rawTex="${latexCode}"/>`;
//             html = html.replace(match, latexCodeWrapped);
//         });
//     }

//     return html;
// }


export const parseMathJax = (html) => {
    if(!html) return html;
    // Regular expression to match both inline and block LaTeX equations
    const latexRegex = /\$\$([^$]+)\$\$|\$(.+?)\$|\\begin\{([a-z*]+)\}[\s\S]+?\\end\{\3\}/g;

    // Function to escape HTML attribute values
    function escapeHtmlAttribute(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replaceAll("$", '')
            .replaceAll("align\*", 'aligned')
            .toString();
    }

    // Temporarily store replacements to avoid reprocessing
    let replacements = [];
    let counter = 0;

    // Find all matches
    html = html.replace(latexRegex, (match) => {
        const isMultiline = match.startsWith('\\begin');
        let tag = isMultiline ? 'block-tex' : 'inline-tex';

        const placeholder = `REPLACEMENT_${counter++}`;
        replacements.push({ placeholder, latexCode: `<${tag} rawTex="${escapeHtmlAttribute(match)}">${escapeHtmlAttribute(match)}</${tag}>` });
        return placeholder;
    });

    // Replace placeholders with final LaTeX HTML
    replacements.forEach(replacement => {
        html = html.replace(replacement.placeholder, replacement.latexCode);
    });

    return html;
};
