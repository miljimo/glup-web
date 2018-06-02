
class Fancy
{
    constructor()
    {

    }

    method(name){
       console.log(name);
       return this;
    }
}


var fancy  = new Fancy();

fancy.method("Obaro")
     .method("Isreal");
     
