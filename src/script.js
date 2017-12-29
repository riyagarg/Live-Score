function Main(){

//Give the info of today's football match.
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy+'-'+mm+'-'+dd;

  var url =`https://apifootball.com/api/?action=get_events&from=${today}&to=${today}&APIkey=edc13dc8afa177084e69841f16a4e4a77e189acfe2201ef86a82909ddcb27bc2`;

  this.response=[];

  this.showBoolean = true;
  this.minBoolean = true;
  var interval;

  const container = document.getElementById('container');

  this.init = function() {
    const scope = this;
    this.reInit();
    var hideButton =document.getElementById('hideButton');
      hideButton.value='Hide'
      hideButton.innerHTML='Hide'
      hideButton.addEventListener('click',function(event){
        hideButton.innerHTML= scope.showBoolean ? 'Show' :'Hide'
        if(scope.showBoolean){
        container.innerHTML='';
        clearInterval(interval)
      }else{
        scope.reInit();
      }
        scope.showBoolean = !scope.showBoolean
    });

    var expandButton =document.getElementById('expandButton');
    expandButton.innerHTML='Expand'
    expandButton.addEventListener('click',function(event){
      expandButton.innerHTML= scope.minBoolean ? 'MiniMize' :'Expand'
      if(scope.minBoolean && scope.showBoolean){
        container.setAttribute("style",'height: 30vh; max-height:30vh;')
      } else{
        container.setAttribute("style",'height: 10vh; max-height:10vh;')
      }
        scope.minBoolean = !scope.minBoolean
    });
    window.onload = this.addListeners();
  }

  this.reInit = function(){
    const scope = this;
    this.makeApiCall(url,(response)=> {
      var modifiedResponse = JSON.parse(response);
      let flag=false;
      for(var i=0; i<modifiedResponse.length; i++){
        if(modifiedResponse[i].match_live === '1'){
            scope.response = modifiedResponse[i];
            scope.createDOM();
            flag=true;
            break;
        }
      }
      if(!flag){
        this.createNoShowDOM();
      }
    });
  }
  this.addListeners =function(){
    document.getElementById('div').addEventListener('mousedown', this.mouseDown);
    window.addEventListener('mouseup', this.mouseUp);
  }

  this.mouseUp =function(){
     window.removeEventListener('mousemove', divMove);
  }
  this.mouseDown = function(e){
    window.addEventListener('mousemove', divMove);
  }
  const divMove = function(e){
    var div = document.getElementById('div');
    div.style.position = 'absolute';
    div.style.top = e.clientY + 'px';
    div.style.left = e.clientX + 'px';
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

    const card = document.createElement('div')
    card.setAttribute('id', 'scoreBoard')


    const cardHeader = document.createElement('h2')
    cardHeader.innerHTML = 'Score Board'
    cardHeader.setAttribute('id', 'scoreBoardHeader')
    cardHeader.setAttribute('style', 'font-size:14px, font-weight:400');


    const cardData = document.createElement('div')
    cardData.setAttribute('id', 'score')

    const homeTeamName = document.createElement('span')
    homeTeamName.setAttribute('id', 'home_Team_Name')
    homeTeamName.innerHTML= details.match_hometeam_name + '\t '
    homeTeamName.setAttribute('style','margin:5px; ')

    const scoreCard = document.createElement('label')
    scoreCard.setAttribute('id', 'scoreCard')

    const homeTeamScore = document.createElement('span')
    homeTeamScore.setAttribute('id', 'home_Team_Score')
    homeTeamScore.innerHTML= details.match_hometeam_score + '\t - \t'
    homeTeamScore

    const awayTeamScore = document.createElement('span')
    awayTeamScore.setAttribute('id', 'away_Team_Score')
    awayTeamScore.innerHTML= details.match_awayteam_score + '\t'

    scoreCard.appendChild(homeTeamScore)
    scoreCard.appendChild(awayTeamScore)

    const awayTeamName = document.createElement('span')
    awayTeamName.setAttribute('id', 'away_Team_Name')
    awayTeamName.innerHTML= details.match_awayteam_name

    cardData.appendChild(homeTeamName)
    cardData.appendChild(scoreCard)
    cardData.appendChild(awayTeamName)

    card.appendChild(cardHeader)
    card.appendChild(cardData)

    const container = document.getElementById('container');
    container.innerHTML='';
    container.appendChild(card)
  }


  this.createPhaseII = function (details) {
    const card = document.createElement('div')
    card.setAttribute('id', 'currentData')

    const cardHeader = document.createElement('h2')
    cardHeader.innerHTML = 'Goal Scorers List'
    cardHeader.setAttribute('id', 'currentDatarHeader')

    const cardData = document.createElement('div')
    cardData.setAttribute('id', 'current')

    const goalScorerDiv = document.createElement('ul')

    details.goalscorer.forEach(item => {
      const goalScorer = document.createElement('li')
      const name = document.createElement('span')
      name.innerHTML = item.home_scorer ? item.home_scorer : item.away_scorer + " \t "
      name.setAttribute('style','color:red; font-size:13px; font-weight:bold; display:inline-block; margin:10px;');

      const score = document.createElement('span')
      score.innerHTML = item.score + " \t "
      score.setAttribute('style','color:white; font-size:13px; font-weight:bold; display:inline-block; margin:10px;');

      const time = document.createElement('span')
      time.innerHTML = item.time + " \t " + 'minutes';
      time.setAttribute('style','color:black; font-size:13px; font-weight:bold; display:inline-block; margin:10px;');


      goalScorer.appendChild(name)
      goalScorer.appendChild(score)
      goalScorer.appendChild(time)

      goalScorerDiv.appendChild(goalScorer)
    })

    cardData.appendChild(goalScorerDiv)

    card.appendChild(cardHeader)
    card.appendChild(cardData)

    const container = document.getElementById('container');
    container.innerHTML='';
    container.appendChild(card)
  }


  this.createPhaseIII = function (details) {
    const card = document.createElement('div')
    card.setAttribute('id', 'random')

    const imageUrl = 'https://picsum.photos/100/100/?random';

    const imageCard = document.createElement('img')
    imageCard.setAttribute('id', 'random_image')
    imageCard.setAttribute('src', imageUrl);

    card.appendChild(imageCard);

    container.innerHTML='';
    container.appendChild(card)
    container.setAttribute('style','width:auto; height:auto;')
  }


  this.createDOM = function(){
    const data = this.response;
    const scope=this;
    var functionArray = [this.createPhaseI, this.createPhaseII, this.createPhaseIII];
    var count = 0;
    functionArray[0](data);
     interval = setInterval(function() {
      count++;
      functionArray[count%3](data);
      scope.makeApiCall(url,(response)=> {
        var modifiedResponse = JSON.parse(response);
        for(var i=0; i<modifiedResponse.length; i++){
          if(modifiedResponse[i].match_live === '1'){
              scope.response = modifiedResponse[i];
          }
        }
      });
    },5000);
  }

  this.createNoShowDOM = function(){
    container.innerHTML='NO LIVE MATCH DATA FOUND'
    container.setAttribute('style','padding:10px; margin:auto; font-size: 14px; text-align:center')
  }

  this.init();
}


new Main();
