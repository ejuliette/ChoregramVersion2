import { ActivatedRoute, Router } from '@angular/router';
import { ChoregraphiesService } from 'src/app/services/choregraphies.service';
import { Component, OnInit, VERSION,ViewChild,ViewContainerRef,ComponentFactoryResolver, ElementRef } from '@angular/core';
import { Danseur } from 'src/app/models/danseur.model';
import { Placement } from 'src/app/models/placement.model';
import { Position } from 'src/app/models/position.model';
import { Choregraphie } from 'src/app/models/choregraphie.model';

@Component({
  selector: 'app-single-choregraphie',
  templateUrl: './single-choregraphie.component.html',
  styleUrls: ['./single-choregraphie.component.css']
})
export class SingleChoregraphieComponent implements OnInit {

  choregraphie : Choregraphie;
  choregraphieASuppr : Choregraphie;

  constructor(private route: ActivatedRoute,
              private choregraphiesService: ChoregraphiesService,
              private router: Router) { }

// Initialisation : variables vides 
danseurs: Danseur[] = [];
dragPositions : Position[] = [];
danseurPasX = [];
danseurPasY = [];
loop =  null;
arret = false;
tousEnPlace = false;
indicePlacement = 0;
longueur = 0;
 
componentRef: any;
@ViewChild('ele', { read: ViewContainerRef }) entry: ViewContainerRef;

ngOnInit(): void {
  this.indicePlacement = 1;
  this.choregraphie = new Choregraphie('','');
  const id = this.route.snapshot.params['id'];
  this.choregraphiesService.getSingleChoregraphie(+id).then(
    (choregraphie : Choregraphie) => {
      this.choregraphieASuppr = choregraphie;
      this.choregraphie = choregraphie;
      this.longueur = choregraphie.listePlacements.length-1;
      this.affichePlacement(this.choregraphie.listePlacements[this.indicePlacement]);
    }
  );
}

//Redirection vers la liste des chorégraphie lorsque l'utilisateur clique sur "retour"
onBack(){
  this.router.navigate(['/choregraphies']);
}

onSaveModifications(choregraphieModif : Choregraphie){
  const newChoregraphie = this.choregraphie;
  //this.choregraphiesService.removeChoregraphie(this.choregraphieASuppr);
  this.choregraphiesService.createNewChoregraphie(newChoregraphie);
  this.router.navigate(['/choregraphies']);
}

//Récupération des coordonnées du danseur déplacé par l'utlisateur
//lors d'un drag and drop
onDragEnded(event, index) {
  let danseurCourant = this.danseurs[index];
  danseurCourant.x1 = event.source.getFreeDragPosition().x;
  danseurCourant.y1 = event.source.getFreeDragPosition().y;
}
 
//Ajout d'un nouveau placement (entre deux existants ou en fin de chorégraphie)
//Ajout d'un nouveau placement (entre deux existants ou en fin de chorégraphie)
savePlacement(){
  let saveChore = this.choregraphie;
  let placement = new Placement;
  placement.listeDanseurs = [new Danseur(0,0)]; //Création d'un placement vide en 0 puis travail à partir du placement 1 (cohérence identifiant - indexe)
  
  this.indicePlacement = this.indicePlacement + 1 ;
  
  //Pour chaque danseur, on enregistre la position
  for (let i = 0; i<this.danseurs.length; i++)
  {
   let danseurEtudie = new Danseur(0,0);
   danseurEtudie.id = i+1 ;
   danseurEtudie.x = this.danseurs[i].x1 ;
   danseurEtudie.y = this.danseurs[i].y1 ;
   placement.listeDanseurs[i] = danseurEtudie;
  }
 
  let nbPlacements = this.choregraphie.listePlacements.length-1;
  if(this.indicePlacement-1 < nbPlacements) //Si on insère un nouveau placement entre 2 existants 
  {
   let placementPrec = this.choregraphie.listePlacements[this.indicePlacement-1]; //Sauvegarde du placement dont on prend la place
   let nombrePlacementsADecaler = nbPlacements - (this.indicePlacement - 1);
   
   for(let i = 0; i<nombrePlacementsADecaler;i++) //Décalage des placements de la liste pour permettre l'insersion du nouveau
   {
    let aDecalerPlusUn = this.choregraphie.listePlacements[nbPlacements - i]; 
    this.choregraphie.listePlacements[nbPlacements - i + 1] = aDecalerPlusUn;
   }
    this.choregraphie.listePlacements[this.indicePlacement] = placement;
    this.choregraphie.listePlacements[this.indicePlacement-1] = placementPrec;
  }
  else //Si on insère un nouveau placement à la fin de tous les existants, on l'ajoute simplement à la suite
    this.choregraphie.listePlacements.push(placement);

  this.longueur =  this.choregraphie.listePlacements.length - 1; //Mise à jour de la longueur de la chorégraphie (pour l'affichage)
 }
 
 changementPosition(initial : Placement, final : Placement){
   
  //Sauvegarde du placement initial dans placementIni
  let placementIni = new Placement;
  placementIni.listeDanseurs = [new Danseur(0,0)]; //Création d'un placement vide en 0 puis travail à partir du placement 1 (cohérence identifiant - indexe)
  for (let i = 0; i<this.danseurs.length; i++)
  {
   let danseurEtudie = new Danseur(0,0);
   danseurEtudie.id = i+1 ;
   danseurEtudie.x = initial.listeDanseurs[i].x ;
   danseurEtudie.y = initial.listeDanseurs[i].y ;
   placementIni.listeDanseurs[i] = danseurEtudie;
  }
 
  //Affichage du placement initial
  this.affichePlacement(placementIni);
 
  //Sauvegarde du placement final dans placementFin
  let placementFin = new Placement;
  placementFin.listeDanseurs = [new Danseur(0,0)]; //Créer un placement vide en 0 sinon bug -> travailler à  partir du placement 1
  for (let i = 0; i<this.danseurs.length; i++)
  {
   let danseurEtudie = new Danseur(0,0);
   danseurEtudie.id = i+1 ;
   danseurEtudie.x = final.listeDanseurs[i].x ;
   danseurEtudie.y = final.listeDanseurs[i].y ;
   placementFin.listeDanseurs[i] = danseurEtudie;
  }

  //Déplacement de chaque danseur de sa position initiale vers sa position finale
 this.calculPasIniFin(placementIni, placementFin);
 let nbIntervalle = 0;
 this.loop = setInterval(() => {
  for (let i = 0; i<placementIni.listeDanseurs.length; i++)
  {
    //On vérifie si on a atteint la position finale
    this.detectePositionSuivante(placementIni, placementFin);
 
    //Si ce n'est pas le cas, on déplace les danseurs d'un pas de plus
    this.dragPositions[i] = {x : this.danseurs[i].x, y: this.danseurs[i].y};
    this.danseurs[i].x = this.danseurs[i].x + this.danseurPasX[i] ;
    this.danseurs[i].y = this.danseurs[i].y + this.danseurPasY[i] ;
 
    //Lorsque les danseurs sont très proches de leur position finale, ils prennent directement leur position finale 
    //Cela permet d'éviter les erruers d'arrondie lors des calculs
    if(Math.abs(placementFin.listeDanseurs[i].x - this.danseurs[i].x)<5 && Math.abs(placementFin.listeDanseurs[i].y - this.danseurs[i].y)<5)
    {
      this.dragPositions[i] = {x : this.danseurs[i].x, y: this.danseurs[i].y};
      this.danseurs[i].y = placementFin.listeDanseurs[i].y;
      this.danseurs[i].x = placementFin.listeDanseurs[i].x;
    }
  }
  nbIntervalle = nbIntervalle + 1;

  //Sécurité pour éviter que les danseurs dépassent leur position finale
  if(nbIntervalle>=50)
   clearInterval(this.loop);
  }, 25);
}

//Calcul du pas de chaque danseur de sa position initiale vers sa position finale lors d'un déplacement automatique
calculPasIniFin(placementIni : Placement, placementFin : Placement){
 
 for (let i = 0; i<placementIni.listeDanseurs.length; i++)
 {
   let variationX = placementFin.listeDanseurs[i].x - placementIni.listeDanseurs[i].x;
   let variationY = placementFin.listeDanseurs[i].y - placementIni.listeDanseurs[i].y;
   let distDirecte = Math.round(Math.sqrt(variationX*variationX+variationY*variationY));
   let d = distDirecte/50;
   let pasX=0;
   let pasY=0;
   let tan = Math.abs(variationY)/Math.abs(variationX);
   let angle = Math.atan(tan);
   pasX = Math.abs(Math.cos(angle))*d;
   pasY = Math.abs(Math.sin(angle))*d;
   
   if(variationX<=0 && variationY<=0)//Position à atteindre en bas à gauche
     {
       pasX=-pasX;
       pasY=-pasY;
     }
   else if(variationX>=0 && variationY<=0)//Position à atteindre en bas à droite
       pasY=-pasY;

   else if(variationX<=0 && variationY>=0)//Position à atteindre en haut à gauche
       pasX=-pasX;

   this.danseurPasX[i] = pasX;
   this.danseurPasY[i] = pasY;
 }
}


 //Arrêt du déplacement si le danseur a bien atteint sa position finale
 detectePositionSuivante(initial : Placement, final : Placement){
  this.verifTousEnPlace(initial,final)
  if(this.tousEnPlace==true) //Tous les danseurs sont bien placés
    {
      clearInterval(this.loop)
      this.tousEnPlace=false;
    }
  
  if(this.arret==true) //L'utilisateur a cliqué sur le bouton stop
  {
    clearInterval(this.loop);
    this.arret=false;
  }
 }
  
 stop()
 {
   this.arret = true;
 }
 
  //Vérifie si tous les danseurs ont atteint leur position finale
 verifTousEnPlace(initial : Placement, final : Placement)
 {
  let ok = true;
  
  for (let i = 0; i<initial.listeDanseurs.length; i++)
  {
   if(final.listeDanseurs[i].x != this.danseurs[i].x || final.listeDanseurs[i].y != this.danseurs[i].y)
     ok = false;
  }
  
  if(ok==true)
  this.tousEnPlace = true;
 }
  
 affichePlacement(placement : Placement){
  
  for (let i = 0; i<placement.listeDanseurs.length; i++)
     this.danseurs[i] = placement.listeDanseurs[i];
  
   for (let i = 0; i<this.danseurs.length; i++)
     this.dragPositions[i] = {x : this.danseurs[i].x, y: this.danseurs[i].y};
 }
 
 suivant()
 {
   if(this.indicePlacement < this.choregraphie.listePlacements.length-1)
   {
    this.affichePlacement(this.choregraphie.listePlacements[this.indicePlacement+1]);
    this.indicePlacement = this.indicePlacement + 1;
   }
   else
    this.affichePlacement(this.choregraphie.listePlacements[this.indicePlacement]);
  
   this.indicePlacement = this.indicePlacement;
  }
 
  //Met les danseurs en mouvement d'une position initiale vers une position finale
 suivant_autom()
 {
   if(this.indicePlacement < this.choregraphie.listePlacements.length-1)
   {
    this.changementPosition(this.choregraphie.listePlacements[this.indicePlacement], this.choregraphie.listePlacements[this.indicePlacement+1]);
    this.indicePlacement = this.indicePlacement + 1;
   }
   else
    this.affichePlacement(this.choregraphie.listePlacements[this.indicePlacement]);//S'il n'existe pas de position suivante aucun danseur ne bouge
  
   this.indicePlacement = this.indicePlacement;
  }
  
 precedent()
 {
  if(this.indicePlacement > 1)
  {
   this.affichePlacement(this.choregraphie.listePlacements[this.indicePlacement-1]);
   this.indicePlacement = this.indicePlacement - 1;
  }
  else
   this.affichePlacement(this.choregraphie.listePlacements[1]);
  
  this.indicePlacement = this.indicePlacement;
 }
  
 modifierPlacement(){
 
  for (let i = 0; i<this.danseurs.length; i++)
  {
   this.choregraphie.listePlacements[this.indicePlacement].listeDanseurs[i].x = this.danseurs[i].x1 ;
   this.choregraphie.listePlacements[this.indicePlacement].listeDanseurs[i].y = this.danseurs[i].y1 ;
  }
 
 }
 
 
}
 








