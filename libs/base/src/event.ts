// function getAllKeys(obj: any) {
//   let keys = [];
//   // if primitive (primitives still have keys) skip the first iteration
//   if (!(obj instanceof Object)) {
//     obj = Object.getPrototypeOf(obj);
//   }
//   while (obj) {
//     keys = keys.concat(Reflect.ownKeys(obj));
//     obj = Object.getPrototypeOf(obj);
//   }
//   return keys;
// }

//       // const { getModifierState, ...rest } = ev;
//       const allKeys = getAllKeys(ev);
//       const allEntries = allKeys.map((iKey) => [iKey, ev[iKey]]) as Array<
//         [string, unknown]
//       >;
//       const allPrimitiveEntries = allEntries.filter(
//         (iEntry) => !["object", "function"].includes(typeof iEntry[1])
//       );

//       // TODO properly type (with type-fest?)
//       const rest = Object.fromEntries(allPrimitiveEntries) as unknown as Event;

function createEventInitFromEvent(from: Event): EventInit {
  return {
    bubbles: from.bubbles,
    cancelable: from.cancelable,
    composed: from.composed,
  };
}

function createMouseEventInitFromMouseEvent(from: MouseEvent): MouseEventInit {
  return {
    ...createEventInitFromEvent(from),
    // TODO UIEventInit
    // TODO EventModifierInit
    button: from.button,
    buttons: from.buttons,
    clientX: from.clientX,
    clientY: from.clientY,
    movementX: from.movementX,
    movementY: from.movementY,
    relatedTarget: from.relatedTarget,
    screenX: from.screenX,
    screenY: from.screenY,
  };
}

/**
 *
 * @param from
 */
function createPointerEventInitFromPointerEvent(
  from: PointerEvent
): PointerEventInit {
  return {
    ...createMouseEventInitFromMouseEvent(from),
    pointerId: from.pointerId,
    width: from.width,
    height: from.pressure,
    tangentialPressure: from.tangentialPressure,
    tiltX: from.tiltX,
    tiltY: from.tiltY,
    twist: from.twist,
    pointerType: from.pointerType,
    isPrimary: from.isPrimary,
  };
}

export { createEventInitFromEvent, createMouseEventInitFromMouseEvent, createPointerEventInitFromPointerEvent };
