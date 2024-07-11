
import { pipeline, env } from '@xenova/transformers';

/**
 * This class uses the Singleton pattern to ensure that only one instance of the
 * pipeline is loaded. This is because loading the pipeline is an expensive
 * operation and we don't want to do it every time we want to translate a sentence.
 */
env.allowLocalModels = false;

// hide all warnings from this worker
env.logLevel = 'error';

class GPT2Pipeline {
    // static task = 'text-generation';
    // static model = 'gpt2';
    // static instance = null;
    static task = "text-generation"
    static model = "Xenova/gpt2"
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            console.log(this.task, this.model)
            this.instance = await pipeline(this.task, this.model, { progress_callback });
            console.log("Pipeline loaded")
        }

        return this.instance;
    }
}

// Clean token text; strip all the newline and tab characters
const clean = (s) => s.replace("\n", "\\n").replace("\t", "\\t").trim();

/* Visually Creates a structured table that shows tokens along with the scores and steps along the beam search
 * (We can pick this apart later :/)
 */
const generateMarkdownTable = (scores, previousCumulScore, scoreDivider, topK = 4, chosenTokens = null) => {

    // Initialize a markdown table for token, step score, and total score
    let markdownTable = `
    <table>
        <tr>
            <th><b>Token</b></th>
            <th><b>Step score</b></th>
            <th><b>Total score</b></th>
        </tr>`;

    // take topK elements, for each score take its tokenIndex
    scores.slice(-topK).reverse().forEach((score, tokenIndex) => {

        // get the actual token string, determine the itemClass of the token for styling purposes
        const token = GPT2Pipeline.instance.tokenizer.decode([tokenIndex]);
        const itemClass = chosenTokens && chosenTokens.includes(token) ? "chosen-token" : "";

        // for each score, add a new row in the markdownTable string
        markdownTable += `
        <tr class=${itemClass}>
            <td>${clean(token)}</td>
            <td>${score.toFixed(4)}</td>
            <td>${(score + previousCumulScore / scoreDivider).toFixed(4)}</td>
        </tr>`;
    });

    // close the table before returning
    markdownTable += `</table>`;

    return markdownTable;
};

/* Function to recursively generate HTML for the tree nodes
 * @node = current node in the tree
 * @step = current depth of the tree
 * 
 * returns a HTML list item w/ a link w/ end of text child, appropriate selected class
 */
const generateNodes = (node, step) => {
    const token = GPT2Pipeline.instance.tokenizer.decode([node.currentTokenIx]);
    let htmlContent = `
        <li> 
            <a class='${node.isFinal ? (node.isSelectedSequence ? "selected-sequence" : "nonselected-sequence") : "nonfinal child"}'> 
                <span> <b>${clean(token)}</b> </span>`;
    
    // add the markdown table if it does not exist
    if (node.table !== null) {
        htmlContent += node.table;
    }
    htmlContent += "</a>";

    // If a node has children append them to an unordered list
    if (Object.keys(node.children).length > 0) {
        htmlContent += "<ul>";

        // iterate over the children, and generateNodes with another generateion of children
        Object.values(node.children).forEach(subnode => {
            htmlContent += generateNodes(subnode, step + 1);
        });
        htmlContent += "</ul>";
    }

    htmlContent += "</li>";
    return htmlContent;
};

/* Wrapper for generateNodes
 * @startSentence = initial sentence at the root of the tree
 * @originalTree = root node of the tree
 */
const generateHtml = (startSentence, originalTree) => {
    let htmlOutput = `
    <div class="custom-container">
        <div class="tree">
            <ul>
                <li>
                    <a id='root' class="nopadding"> 
                        <span> <b>${startSentence}</b> </span> ${originalTree.table} 
                    </a>
                    <ul>`;

    // iterate over children of the root, call generateNodes for each of the children
    Object.values(originalTree.children).forEach(subnode => {
        htmlOutput += generateNodes(subnode, 1);
    });
    htmlOutput += `
                    </ul>
                </li>
            </ul>
        </div>
    </div>`;
    return htmlOutput;
};

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    // Retrieve the translation pipeline. When called for the first time,
    // this will load the pipeline and save it for future use.
    let gpt2TextGen = await GPT2Pipeline.getInstance(x => {
        // We also add a progress callback to the pipeline so that we can
        // track model loading.
        self.postMessage(x);
    });

    // Actually perform the translation
    let output = await gpt2TextGen([event.data.text], {
        max_new_tokens: event.data.numberSteps,
        num_beams: event.data.numberBeams,
        num_return_sequences: event.data.numReturnSequences,
        length_penalty: event.data.lengthPenalty,
        output_scores: true,
        do_sample: false,
        return_dict_in_generate: true,

        // Allows for partial output
        callback_function: x => {
            console.log(x)

            // self.postMessage({
            //     status: 'complete',
            //     output: html,
            // });
            
            self.postMessage({
                status: 'update',
                output: gpt2TextGen.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true })
            });
        }
    });

    // Send the output back to the main thread
    self.postMessage({
        status: 'complete',
        output: generateHtml(event.data.text, output),
    });
});