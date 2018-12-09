import { Component, OnInit , Input, OnChanges, SimpleChanges} from '@angular/core';
import { Radio } from '../../../../../../models/radios.model';
import { IntelligentRiverService } from '../../../../../../services/intelligent-river.service';

@Component({
  selector: 'app-radio-options',
  templateUrl: './radio-options.component.html',
  styleUrls: ['./radio-options.component.scss']
})
export class RadioOptionsComponent implements OnInit {
  @Input() radioId: string;
  radio: Radio;
  radios: Radio[];
  constructor(private irService: IntelligentRiverService) { }

  ngOnInit() {
    this.irService.getRadios().subscribe(radios => {
      this.radio = radios.find(i=>i.id == this.radioId);
      this.radios = radios;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.radio && this.radio.id != changes.radioId.currentValue)
        this.radio = this.radios.find(i=>i.id == this.radioId);
  }



}
