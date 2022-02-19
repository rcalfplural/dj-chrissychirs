import { IQueueStruct, IYoutubeVideoData, ListNode } from "../InterfaceDefinitions";

/**
 * LISTS FUNCTIONS MOVE TO ANOTHER FILE LATER
 */
 function ListPush(queue: IQueueStruct, node: ListNode): void{
    if(!queue.songsHead){
        queue.songsHead = node;
    }else{
        let current: ListNode = queue.songsHead;
        while(current.next){
            current = current.next;
        }

        current.next = node;
    }
}
function ListLength(queue: IQueueStruct): number{
    if(!queue.songsHead) return 0;
    let current: ListNode = queue.songsHead;
    let i: number = 1;
    while(current.next){
        current = current.next;
        i++;
    }

    return i;
}

function ListGetAt(queue: IQueueStruct, i: number): ListNode | undefined{
    if(!queue.songsHead) return undefined;
    let index = 0;
    let current: ListNode = queue.songsHead; 
    while(current){
        if(index == i || !current.next){
            return current;
        }        

        current = current.next;
    }
}


function List2Array(queue: IQueueStruct): Array<ListNode | undefined>{
    const array: Array<ListNode | undefined> = [];
    let i: number = 0;
    let current = queue.songsHead;
    while(current){
        array[i] = current;
        current = current.next;
        i++;
    };
    return array;
}

function ListPrint(queue: IQueueStruct): void{
    let current = queue.songsHead;
    while(current){
        console.log(current);
        current = current.next;
    };
    return;
}

export { ListGetAt, ListPush, ListLength, List2Array, ListPrint };