//! To Run: node compile.js
// running this file will delete + rebuild the "Build" folder/contents

const path = require('path'); //for crossplatform
const fs = require('fs-extra'); //file system module 
const solc = require('solc');


//* delete entire "build" folder
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);


//* read "Campain.sol" from the 'contracts' folder
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol')
const source = fs.readFileSync(campaignPath, 'utf8'); //change to utf8 to UTF-

//* compile both contracts with solidity compiler 
// use the Solidity compiler to compile everything we just pulled out of that 'source'
const output = solc.compile(source, 1).contracts;

// creates the build folder
fs.ensureDirSync(buildPath) // checks to see if this directory exists. If not, it creates on for us 



//* write output to the 'build' directory 
console.log(output);

// for-in loop is used to itterate over the keys of an object
for (let contract in output) { // campagin + campaignFactory contracts 
    fs.outputJSONSync(
        // build the path where we want to save it to.
        path.resolve(buildPath, contract.replace(":", "") + '.json'),
        output[contract] // the contents we want to write to the JSON file
    )
}



//! END RESULT: we only have to run this 1x and then we can run the app without having to wait for the compiler again. Wow. 