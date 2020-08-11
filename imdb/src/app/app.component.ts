import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PaginationInstance } from 'ngx-pagination';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  csvUrl = 'assets/IMDB-Movie-Data-Cleaned.csv'; //csv url
  csvRecords;
  headers;
  isLoading = true; //stub for loading

  showMoreRows = false; //default to not showing rows
  term; //search term
  sortCat = 'Rank';
  sortDir = 'asc';

  config = { //config options for custom pagination
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1
  };
  
  constructor(private _http: HttpClient){}

  changeSort(selectedCategory){
    //check for sort direction, reverse direction if already sorted by column
    if(selectedCategory == this.sortCat){
      if(this.sortDir == 'asc'){this.sortDir = 'desc';}
      else{this.sortDir = 'asc'}
    }
    else{
      this.sortCat = selectedCategory;
      this.sortDir = 'asc';
    }
  }

  readCsvData () {
        this._http.get(this.csvUrl, {responseType: 'text'})
          //load csv via http
          .subscribe(
            resp_data => {
                //split csv based on lines
                const arr = resp_data.split('\n');
                var jsonObj = [];
                //split out headers on first line for use in obj
                arr[0].replace("Runtime (Minutes)", "Runtime"); //remove disallowed characters
                arr[0].replace("Revenue (Millions)", "Revenue"); //remove disallowed characters
                this.headers = arr[0].split(',');
                
                //function to split each line and assign to header variables in obj
                for(var i = 1; i < arr.length; i++) {
                  var data = arr[i].split(',');
                  var obj = {};
                  for(var j = 0; j < data.length; j++) {
                      obj[this.headers[j]] = data[j];                    
                  }
                  jsonObj.push(obj);
                }

                //stringify and parse json object to actionable variable
                this.csvRecords = JSON.parse(JSON.stringify(jsonObj));
                //flip loading flag
                this.isLoading = false;
                //view output
                //console.log(this.csvRecords);
            },
            err => {
              //console log error
              console.log(err)
            });
    }

    ngOnInit(): void {
      //on page load: read in csv and parse
      this.readCsvData();
    }
}
