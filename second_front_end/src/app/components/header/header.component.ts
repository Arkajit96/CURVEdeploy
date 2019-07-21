import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  identity:any;
  val:boolean;
  id: any;
  constructor(public storage: LocalStorageService) { }

  ngOnInit() {

    this.identity = this.storage.get('identity');
    this.id = this.storage.get('userid');
    if (this.identity == 'student') {
      this.val = true;
    } else if (this.identity == 'faculty') {
      this.val = false;
    }
  }

}
