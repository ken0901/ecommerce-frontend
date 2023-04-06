import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
    providedIn: 'root',
})
export class CartService {
   
    cartItem: CartItem[] = [];

    totalPrice: Subject<number> = new BehaviorSubject<number>(0);
    totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

    // Subject - Does not keep a buffer of previous events.
    //         - Subscriber only receives new events after they are subscribed.
    // ReplaySubject - Has a buffer of all previous events.
    //               - Once subscribed, subscriber receives a replay of all previous events.
    // BehaviorSubject - Has a buffer of the last event.
    //                 - Once subscribed, subscriber receives the latest event sent prior to subscribing.

    // storage: Storage = sessionStorage;
    storage: Storage = localStorage;

    constructor() {

        // read data from storage
        let data = JSON.parse(this.storage.getItem('cartItems'));

        if (data != null){
            this.cartItem = data;

            // compute totals based on the data that is read from storage
            this.computeCartTotals();
        }
    }

    addToCart(theCartItem: CartItem){

        // check if we already have the item in our cart
        let alreadyExistsInCart: boolean = false;
        let existingCartItem: CartItem = undefined!;

        if(this.cartItem.length > 0){

            // find the item in the cart based on item id

            // for(let tempCartItem of this.cartItem){
            //     if(tempCartItem.id === theCartItem.id){
            //         existingCartItem = tempCartItem;
            //         break;
            //     }
            // }

            // Refactor for each loop to Array.find()
            existingCartItem = this.cartItem.find(tempCartItem => tempCartItem.id === theCartItem.id);

            // check if we found it
            alreadyExistsInCart = (existingCartItem != undefined);
        }

        if(alreadyExistsInCart){
            //increment the quantity
            existingCartItem.quantity++;
        }else{
            //just add the item to the array
            this.cartItem.push(theCartItem);
        }

        // compute cart total price and total quantity
        this.computeCartTotals();
    }

    decrementQuantity(theCartItem: CartItem) {
        theCartItem.quantity--;

        if(theCartItem.quantity === 0){
            this.remove(theCartItem);
        }else{
            this.computeCartTotals();
        }
    }

    computeCartTotals() {

        let totalPriceValue: number = 0;
        let totalQuantityValue: number = 0;

        for(let currentCartItem of this.cartItem){
            totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
            totalQuantityValue += currentCartItem.quantity;
        }

        // publish the new values... all subscribers will receive the new data
        this.totalPrice.next(totalPriceValue);
        this.totalQuantity.next(totalQuantityValue);

        // log cart data just for debugging purposes
        this.logCartData(totalPriceValue,totalQuantityValue);

        // persist cart data
        this.persistCartItem();
    }

    logCartData(totalPriceValue: number, totalQuantityValue: number) {
        console.log('Contents of the Cart');
        for(let tempCartItem of this.cartItem){
            const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
            console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
        }

        console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
        console.log('--------------------');
    }

    remove(theCartItem: CartItem){

        // get index of item in the array
        const itemIndex = this.cartItem.findIndex( tempCartItem => tempCartItem.id === theCartItem.id);
        
        // if found, remove the item from the array at the given index
        if(itemIndex > -1){
            this.cartItem.splice(itemIndex, 1);

            this.computeCartTotals();
        }
    }

    persistCartItem(){
        this.storage.setItem('cartItems', JSON.stringify(this.cartItem));
    }
}
