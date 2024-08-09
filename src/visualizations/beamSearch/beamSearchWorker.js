
import { pipeline, env } from '@xenova/transformers';

/*
 * This class uses the Singleton pattern to ensure that only one instance of the
 * pipeline is loaded. This is because loading the pipeline is an expensive
 * operation and we don't want to do it every time we want to translate a sentence.
 */
env.allowLocalModels = false;

// hide all warnings from this worker
env.logLevel = 'error';

console.warn = () => {};

/* gptToTree - Converts the output of the GPT-2 model into a tree structure that is used by the visualization
 * @param {Array} steps - The output of the GPT-2 model
 * @param {String} input - The input sentence
 * @returns {Object} The tree structure that is used by the visualization
 */
const gptToTree = (steps, input) => {

    // Work backwards to build the tree, making each step a parent of the previous step
    for (let i = steps.length - 1; i > 0; i--) {
        let children = steps[i];
        let parents = steps[i - 1];

        parents.forEach(parent => {
            parent.children = [];
            children.forEach(child => {           
                if (child.output_token_ids.slice(0, -1).join(" ") === parent.output_token_ids.join(" ")) {
                    if (child.highlighted) {
                        parent.highlighted = true;
                    }
                    parent.children.push(child);
                }
            });
        });
    }


    return {
        name: 'root',
        children: [
            {
                name: input,
                children: steps[0]
            }
        ]
    };
}

/* GPT2Pipeline - A class that loads the GPT-2 model and provides a method to translate text
 * @property {String} task - The task that the pipeline will perform
 * @property {String} model - The model that the pipeline will use
 * @property {Object} instance - The pipeline instance
 */
class GPT2Pipeline {
    static task = "text-generation"
    static model = "Xenova/gpt2"
    static instance = null;


    /* getInstance - A method that returns the pipeline instance. If the instance is null, it will load the pipeline
     * @param {Function} progress_callback - A callback function that is called when the model is loading
     * @returns {Object} The pipeline instance
     */
    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            console.log(this.task, this.model)
            this.instance = await pipeline(this.task, this.model, { progress_callback });
            console.log("Pipeline loaded")
        }

        return this.instance;
    }
}

let steps = [];
let bestBeam = undefined;


// Listens for messages from the main thread and retrieves the translation pipeline
self.addEventListener('message', async (event) => {
    // When called for the first time, will load the pipeline and save it for future use.
    let gpt2TextGen = await GPT2Pipeline.getInstance(x => {

        // progress callback to the pipeline to track model loading.
        self.postMessage(x);
    });

    // Actually perform the translation
    let output = await gpt2TextGen([event.data.text], {
        max_new_tokens: Number(event.data.maxDepth),
        num_beams: Number(event.data.numBeams),
        do_sample: false,
        early_stopping: "never",


        // Allows for partial output
        callback_function: x => {

            // Decode the output token ids to get the sequence
            bestBeam = gpt2TextGen.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true })
            const TOP_K = 2

            // decode the top k token sequences and IDs, skipping the special tokens
            const next_step = x.map((elem, index) => {
                const sequence = gpt2TextGen.tokenizer.decode(elem.output_token_ids, { skip_special_tokens: true })
                const token = gpt2TextGen.tokenizer.decode(elem.output_token_ids.slice(-1), { skip_special_tokens: true })

                // Each node returned has the sequence, token, token's output token IDs, score, and rank to be used in the visualization
                return {
                    sequence: sequence,
                    name: token,
                    token: token,
                    output_token_ids: elem.output_token_ids,
                    score: elem.score,
                    rank: index + 1,
                };
            })

            steps.push(next_step);

            self.postMessage({
                status: 'update',
                sequence: bestBeam,
            });
        }
    });

    // Highlight the final output
    steps[steps.length - 1][0].highlighted = true;

    const final_output = gptToTree(steps, event.data.text);
    steps = []

    // Send the output back to the main thread, this is what is displayed in the bottom left generation panel
    self.postMessage({
        status: 'complete',
        output: final_output,
        sequence: bestBeam
    });
});