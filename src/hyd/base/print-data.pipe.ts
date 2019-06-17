
import {Pipe, PipeTransform} from "@angular/core";
declare var $bean;

@Pipe({
  name: 'printData'
})

export class PrintDataPipe implements PipeTransform{
  transform(value: any, ...args): any {
    if($bean.isNotNil(value) && $bean.isNumber(value)){
      return $bean.getShortBytes(value, 2);
    }else{
      return value;
    }
  }
}
