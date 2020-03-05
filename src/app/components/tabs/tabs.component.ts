import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  public navLinks = [
    {path: '/airports', label: 'Аэропорты'},
    {path: '/pilots', label: 'Пилоты'},
    {path: '/airplanes', label: 'Самолеты'},
  ];

  constructor() { }

  ngOnInit() {
  }

}
