export class Region {
    nom: string;
    code: string;
    langue: Langue  = Langue.Indefinie;
    feature: any;

    constructor() {

    }

}


export class Departement {
    nom: string;
    code: any;
    langue: Langue  = Langue.Indefinie;
    feature: any;

    constructor() {

    }

}


export class Commune {
    nom: string;
    code: any;
    langue: Langue = Langue.Indefinie;
    // feature: any;

    constructor() {

    }

}

export enum Langue {
    Indefinie,
    Oc,
    Oil,
}
