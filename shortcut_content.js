console.log('running');
var CurrentPressed = [];
var PressedKeysCount = 0;
var PressedKeyTrack= new Map();
var currentInstructions;
chrome.storage.sync.clear();

/*var obj={
	"71+72": [{
		"Send": [{"keyCode":49,"key":1}]
    },
    {
        "Sleep" : 1000
    },
    {
		"Send": [{"keyCode":49,"key":1},{"keyCode":51,"key":1}]
	}]
};*/
//chrome.storage.sync.set(obj);
function PressKey(keyCode,key,shiftkey,ctrlkey){
         
        var CurrentEvent= createmyKey(keyCode,key,shiftkey,ctrlkey);
        if(document.activeElement.tagName=='TEXTAREA'){
            var pressedkey=CurrentEvent.key;
            console.log(pressedkey);
            var box=document.activeElement;
           var cursorposition=box.selectionStart;
            document.activeElement.value=[(box.value).slice(0, cursorposition),
               pressedkey, (box.value).slice(cursorposition)].join('');
        }
        else{
        document.dispatchEvent(CurrentEvent);
        }

}
function createmyKey(keyCode,key,shiftkey,ctrlkey){
    var keyevent = new KeyboardEvent('keypress',{"keyCode" : keyCode,"ctrlKey":ctrlkey,"key":key,"shiftKey":shiftkey});
    return keyevent;
}

function KeydownHandler(event){
    //console.log('present or not',PressedKeyTrack.has(PressedKey))
    console.log('keydown',PressedKeysCount,PressedKeyTrack.size);
    var PressedKey= event.which;
    if( ! (PressedKeyTrack.has(PressedKey)) ){
        console.log('inside first if',CurrentPressed.length,PressedKeysCount);
        if(CurrentPressed.length==PressedKeysCount){
        PressedKeyTrack.set(PressedKey,1);
        //console.log('present or not',PressedKeyTrack.has(PressedKey));
        PressedKeysCount++;
        console.log(PressedKeysCount);
        CurrentPressed.push(PressedKey);
        var CurrentString=CurrentPressed.join("+");
        CheckShortcut(CurrentString);
        }
    }
   
}

function KeyupHandler(event){
    console.log('keyup');
    var ReleasedKey = event.which;
    PressedKeyTrack.delete(ReleasedKey);
    PressedKeysCount--;
    CurrentPressed.length=0;

}

function CheckShortcut(shortcut){
    console.log('check_shortcut',shortcut);

    chrome.storage.sync.get(shortcut,function(data){
        console.log(data,data[shortcut],shortcut);
        if(data[shortcut]){
            //chrome.runtime.sendMessage({'Instruct':data[shortcut]});
            currentInstructions=data[shortcut];
            ExecuteSet(data[shortcut],0);
            
        }
    });
}
function ExecuteSet(Instructions,start){
    console.log('here');
    var InstructionNumber=start;
    var size = Instructions.length;
    while(InstructionNumber<size){
        var state=0;
       
        for(x in Instructions[InstructionNumber]){
            if(x=='Send'){
                
                nextInstructionNumber=InstructionNumber+1;

                if(nextInstructionNumber<size){
                    var nextInstruction= Instructions[nextInstructionNumber];
                    var nextInstructionKey=Object.keys(nextInstruction);
                    if(nextInstructionKey=='Sleep') state=1;
                }
                ExecuteSend(Instructions[InstructionNumber][x],state,InstructionNumber,Instructions);
                if(state==1) break;
            }
            else if(x=='Sleep'){
                sleep(Instructions[InstructionNumber][x]);
            }
        }
        if(state==1) break;
        InstructionNumber++;
    }
}
function ExecuteSend(SendSequence,state,Number,Instructions){
    var shift=0;
    var ctrl=0;
    console.log('Executing Send',SendSequence);
    if(state==1){
        chrome.runtime.sendMessage({'InstructionN':Number,'Instructions':Instructions});
    }
    var size = SendSequence.length;
    var i=0;
    while(i<size){
        console.log(i,' ',SendSequence[i]);
        var temp=SendSequence[i].keyCode;
        var tempKey=SendSequence[i].key;
        PressKey(temp,tempKey,shift,ctrl);
      
 i++;
}
}
$(document).on("keydown", KeydownHandler);
$(document).on("keyup", KeyupHandler);
chrome.runtime.onMessage.addListener(function(response,sender,sendResponse){
      if(response.InstructionN){
          ExecuteSet(response.Instructions,response.InstructionN);
      }
});