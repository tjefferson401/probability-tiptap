
import { pipeline, env } from '@xenova/transformers';

/**
 * This class uses the Singleton pattern to ensure that only one instance of the
 * pipeline is loaded. This is because loading the pipeline is an expensive
 * operation and we don't want to do it every time we want to translate a sentence.
 */
env.allowLocalModels = false;

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
    let output = await gpt2TextGen(event.data.text, {

        // Allows for partial output
        callback_function: x => {
            console.log(x)
            self.postMessage({
                status: 'update',
                output: gpt2TextGen.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true })
            });
        }
    });

    // Send the output back to the main thread
    // self.postMessage({
    //     status: 'complete',
    //     output: output,
    // });
});