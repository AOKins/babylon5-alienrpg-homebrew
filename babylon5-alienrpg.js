import { addPsiAbility, extendPrepareDataWithAbility } from "./setup_custom.js";
import { libWrapper } from './modules/libWrapperShim.js';
import { MODULE_ID} from "./constants.js";

Hooks.once('init', () => {
    console.log(MODULE_ID, '|',' Initializing babylon5-alienrpg')

    addPsiAbility()

     // add our custom abilities and skills data model
    libWrapper.register(
      MODULE_ID,
      'game.alienrpg.alienrpgActor.prototype.prepareData',
      function (prepareData) {
        if (this.type == 'character') {
          try {
            extendPrepareDataWithAbility.bind(this)();
          } catch (e) {
              ui.notifications.error("Something went wrong")
              console.error(e);
          }
        }
        return prepareData();
      },
      'WRAPPER'
    );
});


export function appendCharacterSheet(app,html,data) {
  // Append Psi Rating attribute

  var attribElements = html[0].getElementsByClassName("abilities grid-Char-Att")[0]

  if (!attribElements) {
    attribElements = html[0].getElementsByClassName("abilities crt-grid-Char-Att")[0]
  }

  var psi_attrib = document.createElement('h3')
  psi_attrib.setAttribute('class','resource-label')
  psi_attrib.setAttribute('data-attr','attribute')
  psi_attrib.setAttribute('data-label','Telepathy')
  psi_attrib.innerHTML = "Psi Rating"
  attribElements.appendChild(psi_attrib)

  psi_attrib = document.createElement('input')
  psi_attrib.setAttribute('name','system.attributes.psi.value')
  psi_attrib.setAttribute('type','text')
  psi_attrib.setAttribute('class','maxboxsize')
  psi_attrib.setAttribute('data-dtype','Number')

  psi_attrib.setAttribute('value',data.actor.system.attributes.psi.value)
  attribElements.appendChild(psi_attrib)
}

Hooks.on("renderActorSheet", (app, html, data) => {
  if (app.actor.type == "character") {
    appendCharacterSheet(app,html, data)
  }
});

Hooks.on('renderPause', () => {
  var pauseItem = $("#pause")
  if (pauseItem.attr('class') !== 'paused') return;
  pauseItem[0].children[0].src = 'modules/babylon5-alienrpg/assets/pause.png'
  pauseItem[0].children[0].src = 'modules/babylon5-alienrpg/assets/pause.png'
  pauseItem[0].children[0].setAttribute('class', '')
});

Hooks.once('diceSoNiceReady', (dice3d) => {
  dice3d.addColorset({
    name: 'white',
    description: 'White',
    category: 'Colors',
    foreground: ['#e3e300'],
    background: ['#e3e300'],
    outline: 'white',
    texture: 'none',
  });

  dice3d.addColorset(
    {
      name: 'black',
      description: 'black',
      category: 'Colors',
      foreground: ['#ffffff'],
      background: ['#000000'],
      outline: 'black',
      texture: 'none',
    },
    'preferred'
  );

  dice3d.addSystem({ id: 'babylon5-alienrpg', name: 'Babylon 5 Alien RPG' }, 'preferred');
  dice3d.addDicePreset({
    type: 'db',
    labels: [
      'modules/babylon5-alienrpg/assets/dice/normal/b_blank.png',
      'modules/babylon5-alienrpg/assets/dice/normal/b_blank.png',
      'modules/babylon5-alienrpg/assets/dice/normal/b_blank.png',
      'modules/babylon5-alienrpg/assets/dice/normal/b_blank.png',
      'modules/babylon5-alienrpg/assets/dice/normal/b_blank.png',
      'modules/babylon5-alienrpg/assets/dice/normal/b6.png',
    ],
    colorset: 'black',
    system: 'babylon5-alienrpg',
  });
  dice3d.addDicePreset({
    type: 'ds',
    labels: [
      'modules/babylon5-alienrpg/assets/dice/shadow/s1.png',
      'modules/babylon5-alienrpg/assets/dice/shadow/s_blank.png',
      'modules/babylon5-alienrpg/assets/dice/shadow/s_blank.png',
      'modules/babylon5-alienrpg/assets/dice/shadow/s_blank.png',
      'modules/babylon5-alienrpg/assets/dice/shadow/s_blank.png',
      'modules/babylon5-alienrpg/assets/dice/shadow/s6.png',
    ],
    colorset: 'white',
    system: 'babylon5-alienrpg',
  });
});

Hooks.on('renderChatMessage', (args, html, data) => {
  var msgContent = html[0].getElementsByClassName('chatBG')[0]

  for (var i = 0; i < msgContent.childNodes.length; i++ ) {
    var child = msgContent.childNodes[i]
    if (child.innerHTML) {
      child.innerHTML = child.innerHTML.replaceAll("Yellow", "Stress")
      child.innerHTML = child.innerHTML.replaceAll("Sixes", "Fives")
      child.innerHTML = child.innerHTML.replaceAll("Ones", "Zeros")  
    }
    if (child.childNodes) {
      var grandchildren = child.childNodes

      for (var j = 0; j < grandchildren.length; j++ ) {
        var grandchild = grandchildren[j]
        console.log(grandchild)
        if (grandchild.className) {
          grandchild.className = grandchild.className.replaceAll("alien-diceface","babylon5-diceface")
        }
      }
    }
  }
});
