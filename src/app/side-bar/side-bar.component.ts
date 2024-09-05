import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  collapse1: boolean = true;
  collapse2: boolean = true;
  collapse3: boolean = true;
  collapse4: boolean = true;

  constructor() {}

  ngOnInit(): void {}
}
