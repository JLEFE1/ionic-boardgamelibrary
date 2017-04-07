import { Component } from '@angular/core';

import {AlertController, NavController, ModalController} from 'ionic-angular';
import {Boardgames} from '../../providers/boardgames';
import {SearchPage} from '../search/search';
import {SearchObject} from '../../entities/searchObject.module';
import {Observable} from 'rxjs';
import {Boardgame} from '../../entities/boardgame.module';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  boardgames: Boardgame[];
  filteredBoardgames: Boardgame[];

  gameTypes = ["Worker placement", "Dungeon crawling", "Euro style", "Party games"];
  durations = [60, 120, 180];
  numberOfPlayers = [1, 2, 3, 4];

  searchObject = new SearchObject();

  constructor(public navCtrl: NavController,
              public boardgameService: Boardgames,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController
  ) {

  }

  doSearch(){
    console.log("Start filtering games: " + this.searchObject);

    let games = Observable.fromPromise(this.boardgameService.getBoardgames())

    console.log(games.subscribe(
      x => console.log('onNext: %s', x),
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')))

  }

  goToSearchPage(){
    let modal = this.modalCtrl.create(SearchPage);
    modal.present();
  }

  ionViewDidLoad(){

    this.boardgameService.getBoardgames().then((data) => {
      this.boardgames = data;
      this.filteredBoardgames = data;
    });

  }

  createBoardgame(){

    let prompt = this.alertCtrl.create({
      title: 'Add game',
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          type:'input'
        },
        {
          name: 'numberOfPlayers',
          placeholder: 'Number of players',
          type: 'number'
        },
        {
          name: 'duration',
          placeholder: 'Duration',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.boardgameService.createBoardgame({
              title: data.title,
              numberOfPlayers: data.numberOfPlayers,
              duration: data.duration,
            });
          }
        }
      ]
    });

    prompt.present();

  }

  updateBoardgame(boardgame){

    let prompt = this.alertCtrl.create({
      title: 'Edit',
      message: 'Change your mind?',
      inputs: [
        {
          name: 'title'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.boardgameService.updateBoardgame({
              _id: boardgame._id,
              _rev: boardgame._rev,
              title: data.title
            });
          }
        }
      ]
    });

    prompt.present();
  }

  deleteBoardgame(boardgame){
    this.boardgameService.deleteBoardgame(boardgame);
  }

}
