const platform = weex.config.env.platform.toLowerCase();
let doc;
if(platform==='web'){
    doc = document;
}else{
    doc = weex.document;
}
export default  doc;