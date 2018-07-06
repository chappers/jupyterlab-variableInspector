export
namespace Languages{
    export
    type LanguageModel = {
            initScript : string;
            queryCommand : string;
    }
}




export
abstract class Languages{
    /**
     * Init and query script for supported languages.
     */
    static py_script: string = `import json
from sys import getsizeof

from IPython import get_ipython
from IPython.core.magics.namespace import NamespaceMagics

_nms = NamespaceMagics()
_Jupyter = get_ipython()
_nms.shell = _Jupyter.kernel.shell

try:
    import numpy as np  # noqa: F401
except ImportError:
    pass


def _getsizeof(x):
    # return the size of variable x. Amended version of sys.getsizeof
    # which also supports ndarray, Series and DataFrame
    if type(x).__name__ in ['ndarray', 'Series']:
        return x.nbytes
    elif type(x).__name__ == 'DataFrame':
        return x.memory_usage().sum()
    else:
        return getsizeof(x)


def _getshapeof(x):
    # returns the shape of x if it has one
    # returns None otherwise - might want to return an empty string for an empty collum
    try:
        return x.shape
    except AttributeError:  # x does not have a shape
        return None


def _var_dic_list():
    types_to_exclude = ['module', 'function', 'builtin_function_or_method','instance', '_Feature', 'type', 'ufunc']
    values = _nms.who_ls()
    vardic = [{'varName': v, 'varType': type(eval(v)).__name__, 'varSize': str(_getsizeof(eval(v))), 'varShape': str(_getshapeof(eval(v))) if _getshapeof(eval(v)) else '', 'varContent': str(eval(v))[:200]}  # noqa
        for v in values if ((str(eval(v))[0] != "<") or (isinstance(eval(v), str)))] #Prevent showing classes, modules etc.
    return json.dumps(vardic)
`;
    static scripts: { [index: string]: Languages.LanguageModel } = {
           "python3" : { initScript : Languages.py_script,
    queryCommand : "_var_dic_list()"},
"python2" : { initScript : Languages.py_script,
    queryCommand : "_var_dic_list()"},
"python" : { initScript : Languages.py_script,
    queryCommand : "_var_dic_list()"}
                };
   
    public static getScript(lang:string):Promise<Languages.LanguageModel>{
        return new Promise(function(resolve, reject) {
            if (lang in Languages.scripts){
                resolve(Languages.scripts[lang] );
            }else{
                reject("Language " + lang + " not supported yet!");
            } 
        });
       
    }
        
    
}



