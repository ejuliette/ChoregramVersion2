export class Danseur {
    nom : string;
    id : number;
    x1 : number; //position en x relative (necessaire pour le Drag)
    y1 : number; //position en y relative (necessaire pour le Drag)
   
    constructor(public x : number, public y : number){
        this.x = x; //position en x sauvegardée lors d'un placement
        this.y = y; //position en y sauvegardée lors d'un placement
    }
   

  }
 