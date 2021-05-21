$(function () {

    $("#kuld").click(UjRekordBeszur);

    $.ajax(
            {url: "termekek.json", success: function (result) {
//                    console.log(result);
                    termekTomb = result;  //a beolvasott JSN file tartalmát egy termekTombbe mentem
                    kiir();
                    $("article").on("click", "th", rendez);

                    $("article").on("click", "td:nth-child(6) input[type='button']", torol); //bármelyik sorban ha a töröl gombra kattintok, alkalmazza
                    $("article").on("click", "td:nth-child(7) input[type='button']", modosit);

                }});



});

var termekTomb = [];

function formKiurit() {
    $('input:text').val('');
    $("input[type='number']").val('');
    //ha simán $('input').val('') - t alkalmazok, hogy minden kitöltött mező értékét töröljem, akkor utána a radio button értékét nem olvassa be az új rekordadatok megadásakor... 
}

function tablazatFejlecKiir(tomb) {
    //
    $("article").append("<table></table>");
    $("article table").append("<tr></tr>");
    for (var item in tomb[0]) {
        $("article table tr").append("<th id='" + item + "'>" + item + "</th>");
    }
    $("article table tr").append("<th>Rekord eltávolítása</th><th>Rekord módosítása</th>");
}




function tablazatSorokKiir(tomb) {
    for (var i = 0; i < tomb.length; i++) { //sorok beszúrása és feltöltése adatokkal
       
        $("article table").append("<tr></tr>"); //minden sornak az objektum tömbben elfoglalt helye legyen az ID-ja
        for (var item in tomb[i]) {
            $("article table tr").eq(i + 1).append("<td>" + tomb[i][item] + "</td>"); //a html i+1 táblázatsorától kezdve szúrja be (az indexelés 0-val kezdődik!)

        }
        $("article table tr").eq(i + 1).append("<td><input type='button' id='torol"+i+"' value='Töröl'></td>");
        $("article table tr").eq(i + 1).append("<td><input type='button' id='modosit"+i+"' value='Módosít'></td>");
    }
}


function torol() {
    
    if (termekTomb.length > 1) {
        var gombID = $(this).attr("id"); //minden sor Töröl gombjának az ID-ja torolx, ahol x adott sor/rekord tömbben elfoglalt sorszámát adtam; ezt kérem itt le 
        var sorSzama = gombID.slice(-1);  //x, tehát a sor számának megállapítása
//        console.log(sorSzama);

        termekTomb.splice(sorSzama, 1);
        kiir();


    } else if (termekTomb.length === 1) { //ha már csak 1 elem maradt, akkor annak törlése után csak egy sima fejlécet illesszen be
        var sorSzama = $(this).attr("id");   
        termekTomb.splice(sorSzama, 1);
        $("article").empty(); 
        csakFejlec();
       
    }
}

function csakFejlec() {
    $("article").append("<table></table>");
    $("article table").append("<tr><th>Név</th><th>db</th><th>Cikkszám</th><th>Ár</th><th>Használt</th><th>Rekord eltávolítása</th> <th>Rekord módosítása</th></tr>");   

}


function modosit(){
    kiir(); 
    var gombID = $(this).attr("id"); //minden sor Módosít gombjának az ID-ja modositx, ahol x adott sor/rekord tömbben elfoglalt sorszámát adtam; ezt kérem itt le 
    console.log(gombID);
    var sorSzama = gombID.slice(-1);  //x, tehát a sor számának megállapítása
    console.log(sorSzama);
    $("article").append("<div><h2>Rekord módosítása</h2>\n\
                        <form >\n\
                        <div>\n\
                        <label for='nev'>Név</label><input type='text' name='nev' value='"+termekTomb[sorSzama]['Név']+"' id='nev' >\n\
                        <label for='db'>db</label><input type='number' id='darab' name='darab'  value='"+termekTomb[sorSzama]['db']+"'>\n\
                        <label for='cikkszam'>Cikkszám</label><input type='number' id='cikkszam' name='cikkszam' value='"+termekTomb[sorSzama]['Cikkszám']+"'>\n\
                        <label for='ar'>Ár (HUF)</label> <input type='number' name='ar' id='ar' value='"+termekTomb[sorSzama]['Ár']+"'>\n\
                        <label for='használt'>Használt</label><input type='radio' name='hasznalt' id='h_igen' value='true'>\n\
                        <label for='használt'>Nem használt</label><input type='radio' name='hasznalt' id='h_nem' value='false'>\
                        <input type='button' id ='felulir' value='Felülír'><input type='button' id ='megse' value='Mégse'>  \n\
                        </div>\n\
                        </form>\n\
                        </div>");
    
   $("#felulir").click(function(){
        var termekObjektum = {
        Név: $("#nev").val(),
        db: $("#darab").val(),
        Cikkszám: $("#cikkszam").val(),
        Ár: $("#ar").val(),
        Használt: hasznalt()
    };


    if (valid()) {
        termekTomb[sorSzama]=termekObjektum;
        kiir();
        formKiurit();
    } else {
        alert("Hibás adat vagy kitöltetlen adatmező.");
    }
   } );
   
   $("#megse").click(kiir);
  
}




function kiir() {
    $("article").empty();
    formKiurit();
    tablazatFejlecKiir(termekTomb);
    tablazatSorokKiir(termekTomb);
    $("article table th").hover(kiemel);
}

function hasznalt() {
    var hasznalt = $("input[name='hasznalt']:checked").val();
    if (hasznalt === "true")
        return "igen";
    else if (hasznalt === "false")
        return "nem";
    else
        return "Nincs információ";

}

function UjRekordBeszur() {

    var termekObjektum = {
        Név: $("#nev").val(),
        db: $("#darab").val(),
        Cikkszám: $("#cikkszam").val(),
        Ár: $("#ar").val(),
        Használt: hasznalt()
    };


    if (valid()) {
        termekTomb.push(termekObjektum);
        kiir();
        formKiurit();
    } else {
        alert("Hibás adat vagy kitöltetlen/nem megfelelően kitöltött adatmező.");
    }

}




function kiemel() {
    $(this).toggleClass("kiemel"); //Toggle between adding and removing the "kiemel" class name
}



var novekvo = true;
function rendez() {
    var mezo = $(this).attr("id"); //annak az elemnek a mezőnevét adja vissza, amelyikre kattintok; 
    console.log("Mezőnév: " + mezo);
    if (mezo === "db" || mezo === "Cikkszám" || mezo === "Ár") {
        if (novekvo) {
            termekTomb.sort(//növekvő sorrend
                    function (a, b) {
                        console.log(a[mezo]);
                        return a[mezo] - b[mezo];
                    }
            );
        } else {
            termekTomb.sort(
                    function (a, b) {
                        console.log(a[mezo]);
                        return b[mezo] - a[mezo];
                    });
//            console.log("aktuális objektum: " + JSON.stringify(termekTomb));
        }
    } else {
        if (novekvo) {
            termekTomb.sort(
                    function (a, b) {
                        console.log(a[mezo]);
//                        console.log(Number(a[mezo] > b[mezo]) - 0.5); //logikai függvényt számmá alakítom --> 0-t vagy 1-et kapok
                        //úgy lesz belőle - vagy + szám, ha kivonok belőle 0,5-öt 
                        return Number(a[mezo] > b[mezo]) - 0.5; //poz. esetén lesz csere, neg. esetén nem
                    }
            );
//            console.log("aktuális objektum: " + JSON.stringify(termekTomb));
        } else {

            termekTomb.sort(
                    function (a, b) {
                        console.log(a[mezo]);
                        return Number(a[mezo] < b[mezo]) - 0.5;
                    }
            );
        }
    }
    novekvo = !novekvo;
    kiir();
}


function valid() {

    var nevInput = $("#nev").val();
    var dbInput = $("#darab").val();
    var cikkszam = $("#cikkszam").val();
    var arInput = $("#ar").val();

    console.log(dbInput);

    var nev_helyes;
    if (nevInput.length > 2)
        nev_helyes = true;

    var db_helyes;
    if (dbInput > 0)
        db_helyes = true;

    var cikkszam_helyes;
    if (cikkszam > 0)
        cikkszam_helyes = true;

    var ar_helyes;
    if (arInput > 0)
        ar_helyes = true;

    return nev_helyes && db_helyes && cikkszam_helyes && ar_helyes;
}