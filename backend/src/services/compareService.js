import {diffWords} from 'diff'

export const textCompare=(text1="",text2="")=>{
 const wordParts= diffWords(text1,text2)

 let addedWords = 0;
  let removedWords = 0;
  let stableWords = 0;
  
 for(const part of wordParts){
    const count= part.value.trim()?part.value.trim().split(/\s+/).length:0;
     if(part.added){
        addedWords+=count
     }
    else if(part.removed){
        removedWords+=count
        
     }
     else{
        stableWords+=count
     }

 }
  const previousWordCount = stableWords + removedWords;

  const changedWordCount = addedWords + removedWords;

  const denominator = Math.max(1, previousWordCount);  //da ne moze da se deli sa 0

  const percent = Math.min(
    100,  //ako je rezultat veci od 100 vrati 100
    (changedWordCount / denominator) * 100
  );

  return {
    percent,
    addedWords,
    removedWords,
    stableWords,
  };
 return {percent, addedWords,removedWords,stableWords}


}