import { getUserData } from './util.js';


// A pointer function that can connect the different tables in my DB.
export function createPointer(className, objectId) {
    return {
        __type: 'Pointer',
        className,
        objectId
    }
}

// And then stick all the data to a given item... A game in this case. 
export function addOwner(item) {
    const userData = getUserData();
    // Add creator of the game.
    item.owner = createPointer('_User', userData.id);
}

/*
"owner":{
    "__type": "Pointer",
    "className": "_User",
    "objectId": "QtJJgIl5F0"
}
*/