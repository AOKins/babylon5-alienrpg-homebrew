import { PRATING_ABBREVIATION } from './constants.js';

export function addPsiAbility() {
    CONFIG.ALIENRPG.attributes[PRATING_ABBREVIATION] = "Psi"
    CONFIG.ALIENRPG.skills['telepathy'] = "Telepathy"
}


export function extendPrepareDataWithAbility() {

    if (!this._source.system.attributes[PRATING_ABBREVIATION]) {
        this._source.system.attributes[PRATING_ABBREVIATION] = {
            "value" : 0,
            "label": "Psi Rating",
            "mod": 0
        }    
    }
}

export function extendPrepareDataWithSkill() {
    if (!this._source.system.skills["telepathy"]) {
        this._source.system.skills["telepathy"] = {
            "value": 0,
            "label": "Telepathy",
            "ability": "emp",
            "description": "Telepathy",
            "mod": 0
        }    
    }
}
