/**
 * @param {Generator} generator
 * @return {[Function, Promise]}
 */
var cancellable = function(generator) {
    let isCancelled = false;
    let rejectPromise, resolvePromise;
    const promise = new Promise((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;
    });
    const cancel = () =>{
        isCancelled = true;
    };
    function nextStep(gen, value, isError = false) {
        if (isCancelled) {
            try {
                const result = gen.throw("Cancelled");
                if (result.done) {
                    resolvePromise(result.value);
                } else {
                    handlePromise(result.value);
                }
            } catch (e) {
                if (e === "Cancelled") {
                    rejectPromise(e);
                } else {
                    rejectPromise(e);
                }
            }
            return;
        }
        
        try {
            const result = isError ? gen.throw(value) : gen.next(value);
            
            if (result.done) {
                resolvePromise(result.value);
            } else {
                handlePromise(result.value);
            }
        } catch (e) {
            rejectPromise(e);
        }
    }
    
    function handlePromise(promise) {
        Promise.resolve(promise)
            .then(value => nextStep(generator, value))
            .catch(error => nextStep(generator, error, true));
    }
    
    nextStep(generator);
    
    return [cancel, promise];
};

/**
 * function* tasks() {
 *   const val = yield new Promise(resolve => resolve(2 + 2));
 *   yield new Promise(resolve => setTimeout(resolve, 100));
 *   return val + 1;
 * }
 * const [cancel, promise] = cancellable(tasks());
 * setTimeout(cancel, 50);
 * promise.catch(console.log); // logs "Cancelled" at t=50ms
 */