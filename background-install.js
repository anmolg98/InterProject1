
var _MAP = {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    20: 'capslock',
    27: 'esc',
    32: 'space',
    33: 'pageup',
    34: 'pagedown',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    45: 'ins',
    46: 'del',
    91: 'meta',
    93: 'meta',
    224: 'meta',
    106: '*',
    107: '+',
    109: '-',
    110: '.',
    111 : '/',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: '\\',
    221: ']',
};
var _SHIFT_MAP = {
    '~': '`',
    '!': '1',
    '@': '2',
    '#': '3',
    '$': '4',
    '%': '5',
    '^': '6',
    '&': '7',
    '*': '8',
    '(': '9',
    ')': '0',
    '_': '-',
    '+': '=',
    ':': ';',
    '\"': '\'',
    '<': ',',
    '>': '.',
    '?': '/',
    '|': '\\'
};
//addition of function keys to map
for (var i = 1; i < 20; ++i) {
    _MAP[111 + i] = 'f' + i;
} 
//addition of numkeys to map
for (i = 0; i <= 9; ++i) {
    _MAP[i + 48] = i.toString();
}
for (i = 0; i <= 9; ++i) {
    _MAP[i + 96] = i.toString();
}
// map of character keycode pairs
var _REVERSE_MAP={
    'a':65,
    'b':66,
    'c':67,
    'd':68,
    'e':69,
    'f':70,
    'g':71,
    'h':72,
    'i':73,
    'j':74,
    'k':75,
    'l':76,
    'm':77,
    'n':78,
    'o':79,
    'p':80,
    'q':81,
    'r':82,
    's':83,
    't':84,
    'u':85,
    'v':86,
    'w':87,
    'x':88,
    'y':89,
    'z':90,
    'A':65,
    'B':66,
    'C':67,
    'D':68,
    'E':69,
    'F':70,
    'G':71,
    'H':72,
    'I':73,
    'J':74,
    'K':75,
    'L':76,
    'M':77,
    'N':78,
    'O':79,
    'P':80,
    'Q':81,
    'R':82,
    'S':83,
    'T':84,
    'U':85,
    'V':86,
    'W':87,
    'X':88,
    'Y':89,
    'Z':90,
    'numpad0':96,
    'numpad1':97,
    'numpad2':98,
    'numpad3':99,
    'numpad4':100,
    'numpad5':101,
    'numpad6':102,
    'numpad7':103,
    'numpad8':104,
    'numpad9':105,
    'numpadins':45 ,
    'numpadend':35,
    'numpaddown':40,
    'numpadpgdn':34,
    'numpadleft':37,
    'numpadclear':12,
    'numpadright':39,
    'numpadhome':36,
    'numpadup':38,
    'numpadpgup':33,
    'numpaddel':46,
    ' ':32
};
function _getReverseMap() {
    
        
        for (var key in _MAP) {

            // pull out the numeric keypad from here cause keypress should
            // be able to detect the keys from the character
            if (key > 95 && key < 112) {
                continue;
            }

            if (_MAP.hasOwnProperty(key)) {
                _REVERSE_MAP[_MAP[key]] = key;
            }
        }
    
    
}
_getReverseMap();
ArrayofKeys=[];
var text=[];
function AddSend(InstructionString){
    var ArrayofKeys=[];
    var shift=0;
    var ctrl=0;
    var alt=0;
    var index=0;
    InstructionString=InstructionString.trim();
    console.log(InstructionString);
  while(index   <  InstructionString.length){
        if(InstructionString[index]=='{'){
            index++;
            var CurrentArray=[];
            while(InstructionString[index]!='}'){
                CurrentArray.push(InstructionString[index]);
                index++;
            }
            index++;
            CurrentString = CurrentArray.join('');
            CurrentString=CurrentString.toLowerCase();
            if(CurrentString=='shiftdown'){
                shift=1;
             var key= createKeyObject('down',16,'Shift',shift,ctrl,alt);
                 ArrayofKeys.push(key);
            }
            else if(CurrentString=='ctrldown'){
                ctrl=1;
                var key= createKeyObject('down',17,'Control',shift,ctrl,alt);
                 ArrayofKeys.push(key);
            }
            else if(CurrentString=='altdown'){
                alt=1;
                var key= createKeyObject('down',18,'Alt',shift,ctrl,alt);
                 ArrayofKeys.push(key);
            }
            else if(CurrentString=='shiftup'){
                shift=0;
             var key= createKeyObject('up',16,'Shift',shift,ctrl,alt);
                 ArrayofKeys.push(key);
            }
            else if(CurrentString=='ctrlup'){
                ctrl=0;
                var key= createKeyObject('up',17,'Control',shift,ctrl,alt);
                 ArrayofKeys.push(key);
            }
            else if(CurrentString=='altup'){
                alt=0;
                var key= createKeyObject('up',18,'Alt',shift,ctrl,alt);
                 ArrayofKeys.push(key);
            }
            else{
                if(_REVERSE_MAP[CurrentString]){
                var key= createKeyObject('default',_REVERSE_MAP[CurrentString],'',shift,ctrl,alt);
                 ArrayofKeys.push(key);
                }
            }
            
        }
        else{
            if(_REVERSE_MAP[InstructionString[index]]){
           var key=createKeyObject('default',_REVERSE_MAP[InstructionString[index]],InstructionString[index],shift,ctrl,alt);
           ArrayofKeys.push(key);
           
            }
            else if(_REVERSE_MAP[_SHIFT_MAP[InstructionString[index]]]){
                var key=createKeyObject('default',_REVERSE_MAP[_SHIFT_MAP[InstructionString[index]]],InstructionString[index],shift,ctrl,alt);
           ArrayofKeys.push(key);
            }
            index++;
        }
    }
    return ArrayofKeys;
}
/*
*Adds sleep command in the array of corresponding 
* shortcut
*/
function AddSleep(InstructionString){
    var SleepTime =  parseInt(InstructionString);
    return SleepTime;

}
function AddClick(InstructionString){
    console.log('addclick');
    InstructionString = InstructionString.trim();
    var CoordinateArray = InstructionString.split(/[ ,]+/);
    console.log(InstructionString,CoordinateArray);
    return CoordinateArray;
}
function createKeyObject(type,keyCode,key,shift,ctrl,alt){
   var obj= {                     
        "type" :type,
        "keyCode" : keyCode,
        "key" : key,
        "shift" : shift,
        "ctrl" : ctrl,
        "alt" : alt
    };
    return obj
}
/*
* To convert lines of text
* to Paragraphs, each 
* paragraph contains  a shortcut along with
  instructions    
*/
function toArrayofParagraphs(ArrayofLines){
    
    var currentParagraph=[];
       for(var i=0;i<ArrayofLines.length;i++){
               if(ArrayofLines[i].length>1){
               
              currentParagraph.push(ArrayofLines[i]);
              console.log(i,'y',currentParagraph,ArrayofLines[i].length);
              console.log(currentParagraph);
           }
           else{
           
               if(currentParagraph.length){
                 
                   console.log('current',currentParagraph);
                  paragraph_parse(currentParagraph);
                  
                   currentParagraph.length=0;
               }
           }
       }
       
}
/*
* Shortcut along with its 
* instruction refered as a paragraph.
* function to parse a paragraph
*/ 
function paragraph_parse(sampleShortcutInstruction){
var index=0;
var key=Shortcut_parse(sampleShortcutInstruction[index]);
console.log(key);
var obj=[];
index++;
while(index < sampleShortcutInstruction.length){
    obj.push(Instruction_parse(sampleShortcutInstruction[index]));
    index++;
}
var output={};
output[key]=obj;
console.log('setting it',output);
chrome.storage.sync.set(output);
}

function Shortcut_parse(Shortcut_string){
    console.log('shortcut',Shortcut_string);
    var RequiredShortcutFormat=[];
    var splited = Shortcut_string.split(" ").filter(Boolean);
    console.log(splited);
    console.log(splited[0]);
    var index = 0;
    var check_index=1;
    while(check_index<splited.length){
        if(splited[check_index]!='&'){
            console.log(splited[check_index],check_index);
            return null;
        }
        check_index=check_index+2;
    }
   while(index<splited.length){
       console.log(splited[index],_REVERSE_MAP[splited[index]]);
       console.log('type',typeof(splited[index]),splited[index].length,splited[index][0]);
       console.log(splited[index][1]);
       console.log(_REVERSE_MAP);
       
           splited[index]=splited[index].trim();
       
       if(_REVERSE_MAP[splited[index]]){
           RequiredShortcutFormat.push(_REVERSE_MAP[splited[index]]);
       }
       
       else{
           return null;
       }
       index=index+2;
   }
   console.log(RequiredShortcutFormat.join('+'));
   return RequiredShortcutFormat.join('+');
}
/*
*Parsing the instruction
*
*/
function Instruction_parse(InstructionString){
    var i=0;
    var CommandType=[];
    InstructionString=InstructionString.trim();
    while(InstructionString[i]!=' '){
        CommandType.push(InstructionString[i]);
        i++;
    }
    
    var CommandString=CommandType.join('');
    InstructionString= InstructionString.substr(i);
    if(CommandString=='Send'){
         
         var value=AddSend(InstructionString);
         var obj={'Send':value};
         return obj;
         }
   else if(CommandString=='Sleep'){
    var value=AddSleep(InstructionString);
    var obj={'Sleep':value};
    return obj;
   }
   else if(CommandString=='Click'){
       var value = AddClick(InstructionString);
       console.log('click');
       var obj = {'Click':value};
       return obj;
   }
   else return;
}
/*
*
*When Installed, data taken from text file 
* parsed and stored in appropriate format
*/
chrome.runtime.onInstalled.addListener(function(details){
    var xhr = new XMLHttpRequest();
xhr.onreadystatechange =function ()
{
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200)
    {
                var text=xhr.responseText;
                setTimeout(function (){
                    console.log(text);
                    var textArray = text.split("\n");
                    console.log(textArray);
                    toArrayofParagraphs(textArray);
                   // console.log(arrayOfParagraphs,arrayOfParagraphs.length);
                },1000);
                console.log("xyz");
            
    }
};
xhr.open("GET", chrome.extension.getURL('textfile.txt'),true);

xhr.send();

} );

