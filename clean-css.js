/**
 * Created by ashok on 17/03/17.
 */

const fs = require('fs');
const cleancss = require('clean-css');

fs.readFile('./www/build/main.css', (error, data)=>{
    if(error) throw error;
    //otherwise process
    var data = new cleancss({}).minify(data);
    // console.log(data);
    fs.writeFile('./www/build/main.min.css', data.styles, (error)=>{
        if(error) console.error(error);
        else console.log('Minify success');
    })
});