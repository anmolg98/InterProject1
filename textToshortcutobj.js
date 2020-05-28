var shortcutString;
var InstructionString;
var outputObj;
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
//addition of function keys to map
var sampleShortcutInstruction2 = `g & i
Send 2
Sleep 100
Send 3
Sleep 500
Send 1
`
var sampleShortcutInstruction = `a & i
Send hey whats up
Sleep 100
Send everything fine
Sleep 500
Send 1
`
for (var i = 1; i < 20; ++i) {
    _MAP[111 + i] = 'f' + i;
} 
//addition of numkeys to map
for (i = 0; i <= 9; ++i) {
    _MAP[i + 48] = i.toString();
}
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
    'Z':90
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
SampleInstructionString='Send abcShiftDown{tab}ctrl';
/*for(key in _REVERSE_MAP){
    console.log(key,' ',_REVERSE_MAP[key]);
}*/

function Shortcut_parse(Shortcut_string){
    var RequiredShortcutFormat=[];
    var splited = Shortcut_string.split(" ").filter(Boolean);
    console.log(splited);
    var index = 0;
    var check_index=1;
    while(check_index<splited.length){
        if(splited[check_index]!='&'){
            return null;
        }
        check_index=check_index+2;
    }
   while(index<splited.length){
       if(_REVERSE_MAP[splited[index]]){
           RequiredShortcutFormat.push(_REVERSE_MAP[splited[index]]);
       }
       else{
           return null;
       }
       index=index+2;
   }
   return RequiredShortcutFormat.join('+');
}
var SampleShortcut='f5 & r';
console.log(Shortcut_parse(SampleShortcut));
function Instruction_parse(InstructionString){
    var i=0;
    var CommandType=[];
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
   else return;
}
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
                var key= createKeyObject('default',_REVERSE_MAP[CurrentString],CurrentString,shift,ctrl,alt);
                 ArrayofKeys.push(key);
                }
            }
            
        }
        else{
            if(InstructionString[index]){
           var key=createKeyObject('default',_REVERSE_MAP[InstructionString[index]],InstructionString[index],shift,ctrl,alt);
           ArrayofKeys.push(key);
           
            }
            index++;
        }
    }
    return ArrayofKeys;
}
function AddSleep(InstructionString){
    var SleepTime =  parseInt(InstructionString);
    return SleepTime;

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

sampleShortcutInstruction=sampleShortcutInstruction.split("\n").filter(Boolean);
console.log(sampleShortcutInstruction);
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
console.log(output);
chrome.storage.sync.set(output);

