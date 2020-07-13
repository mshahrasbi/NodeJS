

const num1Element = document.getElementById('num1') as HTMLInputElement;
const num2Element = document.getElementById('num2')  as HTMLInputElement;
const buttonElement =document.querySelector('button')!; // do ! if we add tsconfig.json when strict option is true // as HTMLButtonElement;

// const numResults: number[] = [];
const numResults: Array<number> = [];
const textResults: string[] = [];

type numOrString = number | string;
type Result = { val: number; timeStamp: Date };

interface ResultObj {
    val: number;
    timeStamp: Date
}

function add_v1(a:any, b:any) {
    return a + b;
}

console.log('call add_v1: ', add_v1(1, 3));
console.log('call add_v1: ', add_v1(10, 7));
console.log('call add_v1: ', add_v1('1', '7'));

/**--------------------------------------- */

function add_v2(num1: number, num2: number) {
    return num1 + num2;
}

console.log('call add_v2: ', add_v2(1, 3));
console.log('call add_v2: ', add_v2(10, 7));
console.log('call add_v2: ', add_v2('1', '7')); // Here tsc will compile this but show us the error as well. The produced JS code for add_v2(..) there is no datatype.
                                                // this is just to make sure that the developer is aware of this datatype.

/**--------------------------------------- */

function add_unionType(num1: number | string, num2: number | string) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    } else if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + ' ' + num2;
    } else {
        return +num1 + +num2;
    }
}

/**--------------------------------------- */
function printResult(resultObj: { val: number; timeStamp: Date }) {
    console.log('printResult: ', resultObj.val);
}

/**--------------------------------------- */
// promise as generic
const myPromise = new Promise<string>( (resolve, reject) => {
    setTimeout( () => { console.log('It worked!')}, 1000);
});

myPromise.then( (result) => { console.log(result.split('w')); });


/**--------------------------------------- */
buttonElement.addEventListener('click', () => {
    const num1 = num1Element.value;
    const num2 = num2Element.value;

    const result = add_v2(+num1, +num2);
    console.log('call add_v2: ', result);

    const result1 = add_unionType(+num1, +num2)
    const stringResult = add_unionType(num1, num2);
    console.log('call add_unionType: ', result1);

    printResult({ val: result, timeStamp: new Date() });

    numResults.push(result);
    textResults.push(stringResult as string);
    console.log('array results: ', numResults, textResults);
});