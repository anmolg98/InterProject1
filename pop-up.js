function myfunc(){
    var x = document.getElementsById("cars").selectedIndex;
    console.log(x);
}
console.log($('#button1'));
$(function(){
    $('button').on("click",function(){
        console.log('clicked',this.id);
      var x=document.getElementById("cars").selectedIndex;
      var choice= document.getElementById("cars").options[x];
      var y=this.id;
        chrome.tabs.query({active: true, currentWindow : true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id,{'button':y , 'choice' : choice});
              //console.log('sent',response.Instructions[temp]['Sleep']);
              console.log('sent');
        });
    

    });
    console.log('xyz');
});
