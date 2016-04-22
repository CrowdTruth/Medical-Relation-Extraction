var alphas = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var digits = "0123456789";

function isAlpha(c) {
        return (alphas.indexOf(c) != -1);
}

function isDigit(c) {
        return (digits.indexOf(c) != -1);
}

function isAlphaNum(c) {
        return (isAlpha(c) || isDigit(c));
}

function sortNumber(a, b) {
    return a - b;
}

function capitalizeTerm(sentence, b, e) {
  return sentence.substring(0, b) + sentence.substring(b, e).toUpperCase() + sentence.substring(e, sentence.length - 1);
}

function getSeedTermSpan(sentence, termsInFactor, noWords, b) {
  var index = new Array();
  index.push(b);
  
  if (noWords > 1) {
    for (i = 1; i < noWords; i ++) {
      index.push(parseInt(parseInt(index[i - 1])) + termsInFactor[i - 1].length + 1);
    }
  }
  
  return index;
}

function getInitialSpan(sentence, termsInFactor, noWords, b) {
  var index = new Array();
  index.push(b);
  
  for (i = 0; i < 3; i++) {
    var pos = parseInt(index[i]) - 1;
    
    // eliminate whitespace
    while (pos >= 0 &&
           (sentence.charAt(pos) == ' ' ||
           sentence.charAt(pos) == '-' ||
           sentence.charAt(pos) == '/' ||
           sentence.charAt(pos) == '|')) {
      pos--;
    }
    
    while (pos >= 0 &&
           sentence.charAt(pos) != ' ' &&
           sentence.charAt(pos) != '-' &&
           sentence.charAt(pos) != '/' &&
           sentence.charAt(pos) != '|') {
      pos--;
    }
    pos++;
    if (pos >= 0) index.push(pos);
  }
  index = index.sort(sortNumber);
  // alert(index);
  
  if (noWords > 1) {
    for (i = 1; i < noWords; i ++) {
      index.push(parseInt(parseInt(index[i + 2])) + termsInFactor[i - 1].length + 1);
    }
  }
  
  index = index.sort(sortNumber);
  
  for (i = 0; i < 3; i++) {
    var pos = parseInt(index[index.length - 1]);
    while (pos < sentence.length  &&
           sentence.charAt(pos) != ' ' &&
           sentence.charAt(pos) != '-' &&
           sentence.charAt(pos) != '/' &&
           sentence.charAt(pos) != '|') {
      pos++;
    }
    
    // eliminate whitespace
    while (pos < sentence.length &&
           isAlphaNum(sentence.charAt(pos)) == false) pos++;
    
    if (pos < sentence.length) index.push(pos);
  }
  
  //alert(index);
  
  return index;
  
  /* id2 = getSeedTermSpan(sentence, termsInFactor, noWords, b);
  return index.filter(function(n) {
    return id2.indexOf(n) != -1
  });*/
}

require(['jquery-noconflict'], function(jQuery) {
    
  //Ensure MooTools is where it must be
  Window.implement('$', function(el, nc){
    return document.id(el, nc, this.document);
  });
  var $ = window.jQuery;
  
  selectedIds1 = new Array();
  selectedIds2 = new Array();
  selectedConfirmIds1 = new Array();
  selectedConfirmIds2 = new Array();
  sentence1 = document.getElementsByClassName("word_split1");
  sentence2 = document.getElementsByClassName("word_split2");
 // confirmFirstFactor = document.getElementsByClassName('confirmFirstFactor validates-required confirmFirstFactor validates');
 // confirmSecondFactor = document.getElementsByClassName('confirmSecondFactor validates-required confirmSecondFactor validates');
  chooseFirstFactor = document.getElementsByClassName('firstfactor firstFactor');
  chooseSecondFactor = document.getElementsByClassName('secondfactor secondFactor');
//  firstSentence = document.getElementsByClassName('sentenceFirstFactor validates-required sentenceFirstFactor validates');
//  secondSentence = document.getElementsByClassName('sentenceSecondFactor validates-required sentenceSecondFactor validates');
//  radioText1 = document.getElementsByClassName('question1 validates-required question1 validates');
//  radioText2 = document.getElementsByClassName('question2 validates-required question2 validates');
  hiddenFieldId1 = document.getElementsByClassName('wordid1');
  hiddenFieldId2 = document.getElementsByClassName('wordid2');
  hiddenFieldFactor1 = document.getElementsByClassName('factor1');
  hiddenFieldFactor2 = document.getElementsByClassName('factor2');
  allIds1 = document.getElementsByClassName('saveselectionids1');
  allIds2 = document.getElementsByClassName('saveselectionids2');
//  confirmIds1 = document.getElementsByClassName('confirmids1');
//  confirmIds2 = document.getElementsByClassName('confirmids2');
  sentenceText = document.getElementsByClassName('sentence');
//  checkboxDoneFirst = document.getElementsByClassName('doneFirst validates-required doneFirst validates');
  b1 = document.getElementsByClassName('b1');
  b2 = document.getElementsByClassName('b2');
  e1 = document.getElementsByClassName('e1');
  e2 = document.getElementsByClassName('e2');
  noWordsFactor1 = 0;
  noWordsFactor2 = 0;
  sentence1Text = "";
  sentente2Text = "";
  
  var colorMap = {};
  colorMap["highlighted"] = "rgb(0, 255, 0)";
  colorMap["selected"] = "rgb(255, 255, 0)";
  colorMap["hovered"] = "rgb(128, 128, 128)";
     
  Array.prototype.remove = function(x) {
    for(i in this){
      if(this[i].toString() == x.toString()){
        this.splice(i,1);
      }
    }
  }
    
  Array.prototype.clear = function() {
    this.splice(0, this.length);
  };
  
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}
  
// this code dynamically reformats the rows' labels to accomodate the quantity of text rendered in the rows' data cells
  $(document).ready(function(){
    chooseFirstFactor[0].readOnly = true;
    chooseSecondFactor[0].readOnly = true;
  //  confirmFirstFactor[0].readOnly = true;
  //  confirmSecondFactor[0].readOnly = true;
    hiddenFieldFactor1[0].value = hiddenFieldFactor1[0].value.toUpperCase();
    hiddenFieldFactor2[0].value = hiddenFieldFactor2[0].value.toUpperCase();
    
    noWordsFactor1 = hiddenFieldFactor1[0].value.split(/-| /).length;
    termsInFactor1 = hiddenFieldFactor1[0].value.split(/-| /);
    noWordsFactor2 = hiddenFieldFactor2[0].value.split(/-| /).length;
    termsInFactor2 = hiddenFieldFactor2[0].value.split(/-| /);
    
   /* index1 = new Array();
    index1.push(parseInt(b1[0].value));
    if (noWordsFactor1 > 1) {
      for (i = 1; i < noWordsFactor1; i ++) {
        index1.push(parseInt(parseInt(index1[i - 1])) + termsInFactor1[i - 1].length + 1);
      }
    }

    index2 = new Array();
    index2.push(parseInt(b2[0].value));
    if (noWordsFactor2 > 1) {
      for (i = 1; i < noWordsFactor2; i ++) {
        index2.push(parseInt(parseInt(index2[i - 1])) + termsInFactor2[i - 1].length + 1);
      }
    }*/
    
    $(".word_split1").text(capitalizeTerm($(".word_split1").text(), parseInt(b1[0].value), parseInt(e1[0].value)));
    sentence1Text = $(".word_split1").text();
    $(".word_split2").text(capitalizeTerm($(".word_split2").text(), parseInt(b2[0].value), parseInt(e2[0].value)));
    sentence2Text = $(".word_split2").text();
    //sentence2[0].value = capitalizeTerm(sentence2[0].value, parseInt(b2[0].value), parseInt(e2[0].value));
    
    index1 = getSeedTermSpan(sentence1Text, termsInFactor1, noWordsFactor1, parseInt(b1[0].value));
    index2 = getSeedTermSpan(sentence2Text, termsInFactor2, noWordsFactor2, parseInt(b2[0].value));
    //alert(index1);
    
    firstSpan1 = getInitialSpan(sentence1Text, termsInFactor1, noWordsFactor1, parseInt(b1[0].value));
    firstSpan2 = getInitialSpan(sentence2Text, termsInFactor2, noWordsFactor2, parseInt(b2[0].value));
   
    words = $(".word_split1").text().split(" ");
    $(".word_split1").empty();
    $.each(words, function(i, v) {
      if (!v.contains("-") && !v.contains("/")) {
        $(".word_split1").append(" ");
        $(".word_split1").append($("<span class=\"word\">").text(v.substring(0, v.length)));
      }
      else {
        if (v.contains("-")) {
            words2 = v.split("-");
        $(".word_split1").append(" ");
        for (i = 0; i < words2.length - 1; i ++) {
          $(".word_split1").append($("<span class=\"word\">").text(words2[i]));
          $(".word_split1").append($("<span class=\"word\">").text("-"));
        }
        $(".word_split1").append($("<span class=\"word\">").text(words2[words2.length-1]));
      }
      if (v.contains("/")) {
        words2 = v.split("/");
        $(".word_split1").append(" ");
        for (i = 0; i < words2.length - 1; i ++) {
          $(".word_split1").append($("<span class=\"word\">").text(words2[i]));
          $(".word_split1").append($("<span class=\"word\">").text("/"));
        }
        $(".word_split1").append($("<span class=\"word\">").text(words2[words2.length-1]));
      }
    }
    });

    var startOffset = 0;
    w = $(".word_split1").find("span").each(function() {
      if ($(this).text() == "-" || $(this).text() == "/") {
        startOffset = startOffset - 1;
      }
      var i = sentence1Text.indexOf($(this).text(), startOffset);
      var wordType = "";
      $(this).attr("id", "one" + i);
      
      wordType = "";
      for (j = 0; j < firstSpan1.length; j ++) {
        if (i == firstSpan1[j]) {
          wordType = "selected";
        }
      }
      for (j = 0; j < index1.length; j ++) {
        if (i == index1[j]) {
          wordType = "seed";
        }
      }
      if (wordType == "seed" || wordType == "selected") {
        selectedIds1.push(i);
        allIds1[0].value = printArray(selectedIds1);
        selection1 = updateHighlightedWords(selectedIds1, "one");
        chooseFirstFactor[0].value = selection1;
        
        if (wordType == "seed") {
          hiddenFieldId1[0].value += i + " ";
          $(this).css( "background-color", colorMap["highlighted"] );
        }
        else {
          $(this).css( "background-color", colorMap["selected"] );
        }
      }
      
      startOffset += $(this).text().length;
      if ($(this).text() != "-" && $(this).text() != "/") {
        startOffset = startOffset + 1;
      }
    });
    
    words = $(".word_split2").text().split(" ");
    $(".word_split2").empty();
    $.each(words, function(i, v) {
      if (!v.contains("-") && !v.contains("/")) {
        $(".word_split2").append(" ");
        $(".word_split2").append($("<span class=\"word\">").text(v.substring(0, v.length)));
      }
      else {
        if (v.contains("-")) {
        words2 = v.split("-");
        $(".word_split2").append(" ");
        for (i = 0; i < words2.length - 1; i ++) {
          $(".word_split2").append($("<span class=\"word\">").text(words2[i]));
          $(".word_split2").append($("<span class=\"word\">").text("-"));
        }
        $(".word_split2").append($("<span class=\"word\">").text(words2[words2.length-1]));
      }
        if (v.contains("/")) {
        words2 = v.split("/");
        $(".word_split2").append(" ");
        for (i = 0; i < words2.length - 1; i ++) {
          $(".word_split2").append($("<span class=\"word\">").text(words2[i]));
          $(".word_split2").append($("<span class=\"word\">").text("/"));
        }
        $(".word_split2").append($("<span class=\"word\">").text(words2[words2.length-1]));
      }
      }
    });
    
    var startOffset = 0;
    w = $(".word_split2").find("span").each(function() {
      if ($(this).text() == "-" || $(this).text() == "/") {
        startOffset = startOffset - 1;
      }
      var i = sentence2Text.indexOf($(this).text(), startOffset);
      $(this).attr("id", "two" + i);
      
      wordType = "";
      for (j = 0; j < firstSpan2.length; j ++) {
        if (i == firstSpan2[j]) {
          wordType = "selected";
        }
      }
      for (j = 0; j < index2.length; j ++) {
        if (i == index2[j]) {
          wordType = "seed";
        }
      }
      if (wordType == "seed" || wordType == "selected") {
        selectedIds2.push(i);
        allIds2[0].value = printArray(selectedIds2);
        selection2 = updateHighlightedWords(selectedIds2, "two");
        chooseSecondFactor[0].value = selection2;
        
        if (wordType == "seed") {
          hiddenFieldId2[0].value += i + " ";
          $(this).css( "background-color", colorMap["highlighted"] );
        }
        else {
          $(this).css( "background-color", colorMap["selected"] );
        }
      }
      
      startOffset += $(this).text().length;
      if ($(this).text() != "-" && $(this).text() != "/") {
        startOffset = startOffset + 1;
      }
    });   
  });
  
  sentence1[0].onclick = function( event ) {
    if(event.target.nodeName == "SPAN" && event.target.id.substring(0,3) == "one" &&
       event.target.style.backgroundColor != colorMap["highlighted"]) {
        if (selectedIds1.contains(event.target.id.slice(3))) {
            //event.target.removeAttribute('style');
          selectedIds1.remove(event.target.id.slice(3));
          allIds1[0].value = printArray(selectedIds1);
          selection1 = updateHighlightedWords(selectedIds1, "one");
          chooseFirstFactor[0].value = selection1;
          event.target.removeAttribute('style');
          
          if (event.target.style.backgroundColor != colorMap["highlighted"]) {
            //event.target.style.backgroundColor = colorMap["highlighted"]; 
          }
         // alert(selection1);
        }
        else {
          selectedIds1.push(parseInt(event.target.id.slice(3)));
          allIds1[0].value = printArray(selectedIds1);
          selection1 = updateHighlightedWords(selectedIds1, "one");
          chooseFirstFactor[0].value = selection1;
          
          if (event.target.style.backgroundColor != colorMap["selected"]) {
            event.target.style.backgroundColor = colorMap["selected"];
          }
          /*else if (event.target.style.backgroundColor == colorMap["selected"]) {
            event.target.style.backgroundColor = colorMap["highlighted"];
          }*/
         // alert(selection1);
        }
   //   }
    }
  }
  
    sentence1[0].onmouseover = function( event ) {
      if(event.target.nodeName == "SPAN" && event.target.id.substring(0,3) == "one" &&
         event.target.style.backgroundColor != colorMap["highlighted"]) {
         event.target.style.backgroundColor = colorMap["hovered"];
        }
    }
         
    sentence1[0].onmouseout = function( event ) {
        if(event.target.nodeName == "SPAN" && event.target.id.substring(0,3) == "one" &&
           event.target.style.backgroundColor == colorMap["hovered"]) {
          if ( /* selectedConfirmIds1.contains(event.target.id.slice(3)) || */
              selectedIds1.contains(event.target.id.slice(3)) &&
              !index1.contains(event.target.id.slice(3)) ) { 
             event.target.style.backgroundColor = colorMap["selected"];
          }
          else if (!index1.contains(event.target.id.slice(3))) {
            event.target.removeAttribute('style');
          }
        }
    }
    
  sentence2[0].onclick = function( event ) {
    if(event.target.nodeName == "SPAN" && event.target.id.substring(0,3) == "two" &&
       event.target.style.backgroundColor != colorMap["highlighted"]) {
      
     // if(radioText2[1].checked) {
        if (selectedIds2.contains(event.target.id.slice(3))) {
          if (event.target.style.backgroundColor != colorMap["highlighted"]) {
            // event.target.removeAttribute('style');
            // event.target.style.backgroundColor = colorMap["highlighted"];
          }  
          selectedIds2.remove(event.target.id.slice(3));
          allIds2[0].value = printArray(selectedIds2);
          selection2 = updateHighlightedWords(selectedIds2, "two");
          chooseSecondFactor[0].value = selection2;
          event.target.removeAttribute('style');
        }
        else{
          selectedIds2.push(parseInt(event.target.id.slice(3)));
          allIds2[0].value = printArray(selectedIds2);
          if (event.target.style.backgroundColor != colorMap["selected"]) {
            event.target.style.backgroundColor = colorMap["selected"];
          }
          selection2 = updateHighlightedWords(selectedIds2, "two");
          chooseSecondFactor[0].value = selection2;
        }
     // }
    }  
  }
    
    
  
    sentence2[0].onmouseover = function( event ) {
      if(event.target.nodeName == "SPAN" && event.target.id.substring(0,3) == "two" &&
         event.target.style.backgroundColor != colorMap["highlighted"]) {
         event.target.style.backgroundColor = colorMap["hovered"];
        }
    }
         
    sentence2[0].onmouseout = function( event ) {
        if(event.target.nodeName == "SPAN" && event.target.id.substring(0,3) == "two" &&
           event.target.style.backgroundColor == colorMap["hovered"]) {
          if ( /* selectedConfirmIds1.contains(event.target.id.slice(3)) || */
              selectedIds2.contains(event.target.id.slice(3)) &&
              !index2.contains(event.target.id.slice(3)) ) {
             event.target.style.backgroundColor = colorMap["selected"];
          }
          else if (!index2.contains(event.target.id.slice(3))) {
            event.target.removeAttribute('style');
          }
        }
    }
           
 /* radioText1[0].onclick=function(ev) {
    $('span').each(function(){
      if($(this ).css( "background-color") == colorMap["selected"] ){
        if ($(this ).attr( "id").contains("one")) {
            // $(this ).removeAttr("style");
            $(this ).css( "background-color", colorMap["highlighted"]);
        }
      }
    });
    selectedIds1.clear();
    allIds1[0].value = "";
    selectedConfirmIds1.clear();
    confirmIds1[0].value = "";
    selection1 = new Array();
  }
    
  radioText2[0].onclick=function(ev) {
    $('span').each(function(){
      if($(this ).css( "background-color") == colorMap["selected"] ){
        if ($(this ).attr( "id").contains("two")) {
          // $(this ).removeAttr("style");
          $(this ).css( "background-color", colorMap["highlighted"]);
        }
      }
    });
    selectedIds2.clear();
    allIds2[0].value = "";
  }

  radioText1[1].onclick=function(ev) {
    $('span').each(function(){
      if($(this ).css( "background-color") == colorMap["selected"] ){
        if ($(this ).attr( "id").contains("one")) {
          // $(this ).removeAttr("style");
          $(this ).css( "background-color", colorMap["highlighted"]);
        }
      }
    });
    selectedConfirmIds1.clear();
    confirmIds1[0].value = "";
    selectedIds1.clear();
    allIds1[0].value = "";
    
    /* startOffset = 0;
    w = $(".word_split1").find("span").each(function() {
      if ($(this).text() == "-" || $(this).text() == "/") {
        startOffset = startOffset - 1;
      }
      var i = sentenceText[0].value.indexOf($(this).text(), startOffset);
      $(this).attr("id", "one" + i);
      for (j = 0; j < index1.length; j ++) {
        if (i == index1[j]) {
          hiddenFieldId1[0].value += i + " ";
          $(this).css( "background-color", colorMap["highlighted"] );  
        }
      }
      startOffset += $(this).text().length;
      if ($(this).text() != "-" && $(this).text() != "/") {
        startOffset = startOffset + 1;
      }
    });
  }
     
  radioText2[1].onclick=function(ev) {
    $('span').each(function(){
      if($(this ).css( "background-color") == colorMap["selected"] ){
        if ($(this ).attr( "id").contains("two")) {
          // $(this ).removeAttr("style");
          $(this ).css( "background-color", colorMap["highlighted"]);
        }
      }
    });
    selectedConfirmIds2.clear();
    confirmIds2[0].value = "";
    
   /* var startOffset = 0;
    w = $(".word_split2").find("span").each(function() {
      if ($(this).text() == "-" || $(this).text() == "/") {
        startOffset = startOffset - 1;
      }
      var i = sentenceText[0].value.indexOf($(this).text(), startOffset);
      $(this).attr("id", "two" + i);
      for (j = 0; j < index2.length; j ++) {
        if (i == index2[j]) {
          hiddenFieldId2[0].value += i + " ";
          $(this).css( "background-color", colorMap["highlighted"] );  
        }
      }
      startOffset += $(this).text().length;
      if ($(this).text() != "-" && $(this).text() != "/") {
        startOffset = startOffset + 1;
      }
    });   
  }*/

  /*  firstSentence[0].onblur=function(ev){
      ok = 0;
      
      sent = firstSentence[0].value;
      sentWords = sent.split(" ");
      if (sentWords.length < 4) {
        firstSentence[0].value = "";
      }
      /*if (!sent.contains(hiddenFieldFactor1[0].value)) {
        firstSentence[0].value = "";
      }
      if (sentenceText[0].value.contains(sent)) {
        firstSentence[0].value = "";
      }
    }
      
      
      secondSentence[0].onblur=function(ev){
        ok = 0;
        
        sent = secondSentence[0].value;
        sentWords = sent.split(" ");
        if (sentWords.length < 4) {
          secondSentence[0].value = "";
        }
       /* if (!sent.contains(hiddenFieldFactor2[0].value)) {
          secondSentence[0].value = "";
        }
        if (sentenceText[0].value.contains(sent)) {
          secondSentence[0].value = "";
        }   
        if (firstSentence[0].value != "") {
          sent2 = firstSentence[0].value;
          sent2Words = sent2.split(" ");
          var results = new Array();
          for (i = 0; i < sentWords.length; i++) {
            if (sent2Words.indexOf(sentWords[i]) !== -1) {
              results.push(sentWords[i]);
            }
          }
          if (results.length > (sentWords.length / 2) ) {
            secondSentence[0].value = "";
          }
        }
      }*/
    
    function updateHighlightedWords(arrayId, indexSent) {
      arrayId.sort(function(a, b) {
        if (isNaN(a) || isNaN(b)) {
          if (a > b) return 1;
          else return -1;
        }
        return a - b;
      });
      var selection2 = "";
      for (var i = 0; i < arrayId.length; i ++) {
        var num = parseInt(arrayId[i]);
        var n = num.toString();
        if (indexSent == "one") {
          selection2 += document.getElementById("one" + n).innerHTML + " ";
        }
        if (indexSent == "two") {
          selection2 += document.getElementById("two" + n).innerHTML + " ";
        }
      }
      return selection2;
      }
  
  function printArray(array) {
    retValue = "";
    for (i = 0; i < array.length; i ++) {
      retValue += array[i] + "-";
    }
    if (array.length != 0) {
      retValue = retValue.slice(0, -1);
    }
    return retValue;
  }
});

