
import { pipeline, env, softmax } from '@xenova/transformers';

/*
 * This class uses the Singleton pattern to ensure that only one instance of the
 * pipeline is loaded. This is because loading the pipeline is an expensive
 * operation and we don't want to do it every time we want to translate a sentence.
 */
env.allowLocalModels = false;

// hide all warnings from this worker
env.logLevel = 'error';

console.warn = () => {};

const gptToTree = (steps, input) => {
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

let steps = [];

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
        max_new_tokens: event.data.maxDepth,
        num_beams: event.data.numBeams,
        // length_penalty: 1.0,
        // output_scores: true,
        do_sample: false,
        early_stopping: "never",
        // return_dict_in_generate: true,

        // Allows for partial output
        callback_function: x => {
            // for (let i = 0; i < x.length; i++) {
            //     console.log("Full Object", x[i])
            //     console.log("Score: ", x[i].score)
            //     console.log("Token IDs: ", x[i].output_token_ids)
            //     console.log(gpt2TextGen.tokenizer.decode(x[i].output_token_ids, { skip_special_tokens: true }))
            //     console.log(typeof(gpt2TextGen.tokenizer.decode(x[i].output_token_ids, { skip_special_tokens: true })))
            // }

            console.log(x)

            const TOP_K = 2

            const next_step = x.map(elem => {
                const sequence = gpt2TextGen.tokenizer.decode(elem.output_token_ids, { skip_special_tokens: true })
                const token = gpt2TextGen.tokenizer.decode(elem.output_token_ids.slice(-1), { skip_special_tokens: true })
                const rawName = String.raw`${token}`
                return {
                    // top_tokens_decoded: topIndices.map(index => gpt2TextGen.tokenizer.decode([index], { skip_special_tokens: true })),
                    sequence: sequence,
                    name: rawName,
                    token: token,
                    output_token_ids: elem.output_token_ids,
                    score: elem.score,
                    // top_tokens: topIndices,
                    //decoded_top_tokens: gpt2TextGen.tokenizer.decode(topIndices, { skip_special_tokens: true }),
                    // probabilities: topIndices.map(index => softmaxProbs[index])
                };
            })

            steps.push(next_step);

            self.postMessage({
                status: 'update',
                // output: gpt2TextGen.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true })
            });
        }
    });

    // Highlight the final output
    steps[steps.length - 1][0].highlighted = true;

    // Send the output back to the main thread
    self.postMessage({
        status: 'complete',
        output: gptToTree(steps, event.data.text, gpt2TextGen.tokenizer)
    });
});