
function Main(){

  var matchUrl = 'http://cricapi.com/api/matches/?apikey=ug9URcXpxRQhrAz6i3Sh6MaBntN2';
  var url ='http://cricapi.com/api/cricketScore/?apikey=ug9URcXpxRQhrAz6i3Sh6MaBntN2&unique_id=';

  this.response={};

  this.init = function() {
    const scope = this;
    this.makeApiCall(matchUrl,(response)=> {
      scope.response = JSON.parse(response).matches;
      let uniqueId;
      for(var i=0; i<scope.response.length; i++){
        if(scope.response[i].matchStarted){
          uniqueId = scope.response[i].unique_id;
        }
        break;
      }
      var newUrl = url + uniqueId;

      this.makeApiCall(newUrl,(response)=>{
        scope.response = JSON.parse(response);
        scope.createDOM(scope.response);
      })
    });
  }

  this.makeApiCall = function(theUrl, callback) {
     var xmlHttp = new XMLHttpRequest();
     xmlHttp.onreadystatechange = function () {
       if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
          const response= xmlHttp.responseText;
          callback(response);
      } else if (xmlHttp.readyState == 4) {
         if (xmlHttp.status == 404) {
           callback('Not Found', 'error')
         } else {
           callback('Some error Occurred', 'error');
         }
       }
     }
     xmlHttp.open('GET', theUrl, true); // true for asynchronous
     xmlHttp.send(null);
  }

  this.createPhaseI = function(details){
    console.log(details);
    const card = document.createElement('div')
    card.setAttribute('id', 'scoreBoard')


    const cardHeader = document.createElement('h2')
    cardHeader.innerHTML = 'Score Board'
    cardHeader.setAttribute('id', 'scoreBoardHeader')


    const cardData = document.createElement('div')
    cardData.setAttribute('id', 'score')
    cardData.innerHTML= details.description;

    card.appendChild(cardHeader)
    card.appendChild(cardData)

    console.log(card);

    const container = document.getElementById('container');
    container.innerHTML='';
    container.appendChild(card)
  }

  this.createPhaseII = function (details) {
    const card = document.createElement('div')
    card.setAttribute('id', 'currentOver')

    const cardHeader = document.createElement('h2')
    cardHeader.innerHTML = 'Present Over'
    cardHeader.setAttribute('id', 'currentOverHeader')

    const cardData = document.createElement('div')
    cardData.setAttribute('id', 'over')
    cardData.innerHTML = details.score;

    card.appendChild(cardHeader)
    card.appendChild(cardData)

    return card
  }


  this.createPhaseIII = function (details) {
    const card = document.createElement('div')
    card.setAttribute('id', 'random')

    const imageUrl = 'https://picsum.photos/200/300/?random';

    const imageCard = document.createElement('img')
    imageCard.setAttribute('id', 'random_image')
    imageCard.setAttribute('src', imageUrl);

    card.appendChild(imageCard);
  }


  this.createDOM= function(data){
    const scope=this;
  setInterval(function() {
    scope.createPhaseI(data);
  },10000);

}


  this.init();
}


new Main();
