import {Component, OnInit} from '@angular/core';
import {LetterGrid} from "../../../assets/word-packer";
import {WordPacker} from "../../../assets/word-packer";
import {selectWordIndexArrayModel} from "../../Constants/game.model";

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent {
  letterGrid: LetterGrid | null;
  inputWords: string;
  leftClicked = false;
  selectedWordsArray : any = [];
  selectedIndexArrayObj : selectWordIndexArrayModel[] = [
    {
      row: 0,
      col: []
    },
    {
      row: 1,
      col: []
    },
    {
      row: 2,
      col: []
    },
    {
      row: 3,
      col: []
    },
    {
      row: 4,
      col: []
    },
    {
      row: 5,
      col: []
    },
    {
      row: 6,
      col: []
    },
  ];
  tempselectedIndexArrayObj : selectWordIndexArrayModel[]  = [];
  wordsToSearchArray : any = [];
  foundWordArray : any = [];
  row !: number;
  col !: number;
  words = [
    "Arguments", "Array", "Async", "Await", "Bubble", "Capture", "Catch",
    "Class", "Closure", "Const", "Continue", "Debugger", "Event", "tiktikboom",
  ];

  constructor() {
    this.letterGrid = null;
    this.inputWords = this.getInitialInput();
    this.generateSearch(this.inputWords);
  }

  public generateSearch(rawValue: string): void {
    this.inputWords = rawValue.trim();
    let words = this.inputWords.split(/[\r\n]/g);
    let wordPacker = WordPacker.createWordPacker(
      words,
      10, // Width of the letter-grid in characters.
      7 // Height of the letter-grid in characters.
    );
    this.letterGrid = wordPacker.getLetterGrid();
    this.logWords(
      wordPacker.getWords(),
      wordPacker.getSkippedWords()
    );
  }

  getInitialInput(): string {
    return (this.words.join("\n"));
  }

  logWords(words: string[], skippedWords: string[]): void {
    if (words.length) {
     words.forEach((word) =>{
        this.wordsToSearchArray.push(word.toUpperCase())
      });
      console.group("%cWords in the Word Search", "color: green ;");
      console.log(words.join(", "));
      console.groupEnd();
    }
    if (skippedWords.length) {
      console.group("%cWords that did not get packed in the Word Search", "color: red ;");
      console.log(skippedWords.join(", "));
      console.groupEnd();
    }
  }

  selection(letter: string, row: number, col: number, event: any){
    if(this.leftClicked){
      this.selectedWordsArray.push(letter);
      if(this.tempselectedIndexArrayObj.length === 0){
        this.tempselectedIndexArrayObj.push({
          row: row,
          col: [col]
        });
      }
      else{
        this.tempselectedIndexArrayObj.forEach((obj) =>{
          if(obj.row === row){
            if(!obj.col.includes(col)){
              obj.col.push(col);
            }
          }
        });
      }
    }
  }

  mouseDown(letter: string, row: number, col: number, event: any){
    this.selectedWordsArray = [];
    this.leftClicked = true;
    this.selectedWordsArray.push(letter);
    this.tempselectedIndexArrayObj.push({
      row: row,
      col: [col]
    });
    console.log('mouse clicked');
  }

  mouseUp(event: any, row: number){
    this.leftClicked = false;
    this.words.forEach((word) =>{
      if(word.toUpperCase() === this.selectedWordsArray.join('')){
        if(!this.foundWordArray.includes(this.selectedWordsArray.join('').toUpperCase())){
          this.foundWordArray.push(this.selectedWordsArray.join('').toUpperCase());
        }
      }
    });
    if(this.foundWordArray.includes(this.selectedWordsArray.join('').toUpperCase())){
      if(this.selectedIndexArrayObj.length === 0){
        this.selectedIndexArrayObj.push({
          row: this.tempselectedIndexArrayObj[0].row,
          col: this.tempselectedIndexArrayObj[0].col
        })
      }
      else {
        let found = false;
        this.selectedIndexArrayObj.forEach((obj) =>{
          if(obj.row === row){
            found = true
            this.tempselectedIndexArrayObj[0].col.forEach((obj1) =>{
              if(!obj.col.includes(obj1)){
                obj.col.push(obj1);
              }
            })
          }
        });
        if(!found){
          this.selectedIndexArrayObj.push({
            row: this.tempselectedIndexArrayObj[0].row,
            col: this.tempselectedIndexArrayObj[0].col
          })
        }
      }
    }
    this.tempselectedIndexArrayObj = [];
    console.log('Letter grid', this.letterGrid);
    console.log('found words array is ===>', this.foundWordArray);
    console.log('Selected index object array is', this.selectedIndexArrayObj);
    this.selectedIndexArrayObj.sort(function (a, b) {
      return a.row - b.row;
    });
  }

  getSelectedColumnArray(row: number){
    let arr : any = []
    this.selectedIndexArrayObj.forEach((obj) =>{
      if(obj.row === row){
        arr = obj.col
      }
      else{
        arr = []
      }
    });
    return arr
  }
}
