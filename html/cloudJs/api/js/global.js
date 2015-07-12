$(document).ready(function(){
    prettyPrint();
});

function writeCode(example, type){
    var code = '', $this = $(example), ele,
        html=$this.html();
    if(!-[1,]){
        html=html.replace(/<\/?([A-Z]+)/gm,function($1){return $1.toLowerCase()}).replace(/>\s?</gm,'>\n<');
    }
    html=html.replace(/</gm,'&lt;').replace(/>/gim,'&gt;');
    code += '<pre class="prettyprint linenums"';
    code += '>';
    code += $.trim(html);
    code += '</pre>';
    document.write(code);
};
