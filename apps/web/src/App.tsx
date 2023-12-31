import { onMount, type Component, createSignal } from "solid-js";

import RenderWorker from "render/worker?worker";
import {
  ForwardInputEventMessageFromMainToRenderData,
  MessageFromMainToRenderDataType,
  SetupMessageFromMainToRenderData,
} from "render/messages";
import { createPointerEventInitFromPointerEvent } from "base/event";

const App: Component = () => {
  const [getCanvas, setCanvas] = createSignal<HTMLCanvasElement>();

  onMount(() => {
    const canvas: HTMLCanvasElement | undefined = getCanvas();

    if (!canvas) {
      throw new Error(
        `Invalid state! Canvas element missing. (Did you set ref on the JSX element?)`
      );
    }

    const canvasOffscreenCanvas: OffscreenCanvas =
      canvas.transferControlToOffscreen();

    const renderWorker = new RenderWorker();

    const setupMessageData: SetupMessageFromMainToRenderData = {
      messageDataType: MessageFromMainToRenderDataType.Setup,
      offscreenCanvas: canvasOffscreenCanvas,
      initialEntityWorldState: {
        vertices: {
          ids: [],
          entities: {},
        },
        edges: {
          ids: [],
          entities: {},
        },
      },
    };

    renderWorker.postMessage(setupMessageData, [canvasOffscreenCanvas]);

    // forward input events
    canvas.addEventListener("click", (ev: PointerEvent) => {
      const eventInit: PointerEventInit =
        createPointerEventInitFromPointerEvent(ev);

      const messageData: ForwardInputEventMessageFromMainToRenderData = {
        messageDataType: MessageFromMainToRenderDataType.ForwardInputEvent,
        eventType: "click",
        eventInit: eventInit,
      };

      renderWorker.postMessage(messageData);
    });

    canvas.addEventListener("mousedown", (ev: PointerEvent) => {
      const eventInit: PointerEventInit =
        createPointerEventInitFromPointerEvent(ev);

      const messageData: ForwardInputEventMessageFromMainToRenderData = {
        messageDataType: MessageFromMainToRenderDataType.ForwardInputEvent,
        eventType: "mousedown",
        eventInit: eventInit,
      };

      renderWorker.postMessage(messageData);
    });
  });

  return (
    <>
      <canvas ref={setCanvas} />
    </>
  );
};

export default App;
