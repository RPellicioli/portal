import { BehaviorSubject } from "rxjs";

export class Utils {
    public static listenAnimationsEndEvent = (object: any): BehaviorSubject<AnimationEvent> => {
        const observable = new BehaviorSubject<AnimationEvent>(null);
        object.addEventListener('webkitAnimationEnd', (event) => { observable.next(event); });
        object.addEventListener('mozAnimationEnd', (event) => { observable.next(event); });
        object.addEventListener('oAnimationEnd', (event) => { observable.next(event); });
        object.addEventListener('oanimationend', (event) => { observable.next(event); });
        object.addEventListener('animationend', (event) => { observable.next(event); });
        return observable;
    }

    public static listenTransitionsEndEvent = (object: any): BehaviorSubject<TransitionEvent> => {
        const observable = new BehaviorSubject<TransitionEvent>(null);
        object.addEventListener('webkitTransitionEnd', (event) => { observable.next(event); });
        object.addEventListener('mozTransitionEnd', (event) => { observable.next(event); });
        object.addEventListener('oTransitionEnd', (event) => { observable.next(event); });
        object.addEventListener('otransitionend', (event) => { observable.next(event); });
        object.addEventListener('transitionend', (event) => { observable.next(event); });
        return observable;
    }
}