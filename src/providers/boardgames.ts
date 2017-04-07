import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

/*
  Generated class for the Boardgames provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Boardgames {

  data: any;
  db: any;
  remote: any;

  constructor() {

    this.db = new PouchDB('boardgame-library');

    this.remote = 'http://localhost:5984/boardgame-library';

    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.db.sync(this.remote, options);

  }

  getBoardgames() {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {

      this.db.allDocs({

        include_docs: true

      }).then((result) => {

        this.data = [];

        let docs = result.rows.map((row) => {
          this.data.push(row.doc);
        });

        resolve(this.data);

        this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          this.handleChange(change);
        });

      }).catch((error) => {

        console.log(error);

      });

    });
  }

  createBoardgame(boardgame){
    this.db.post(boardgame);
  }

  updateBoardgame(boardgame){
    this.db.put(boardgame).catch((err) => {
      console.log(err);
    });
  }

  deleteBoardgame(boardgame){
    this.db.remove(boardgame).catch((err) => {
      console.log(err);
    });
  }

  handleChange(change){
    let changedDoc = null;
    let changedIndex = null;

    this.data.forEach((doc, index) => {

      if(doc._id === change.id){
        changedDoc = doc;
        changedIndex = index;
      }

    });

    //A document was deleted
    if(change.deleted){
      this.data.splice(changedIndex, 1);
    }
    else {

      //A document was updated
      if(changedDoc){
        this.data[changedIndex] = change.doc;
      }

      //A document was added
      else {
        this.data.push(change.doc);
      }

    }
  }

}
