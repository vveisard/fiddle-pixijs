import { onMount, type Component, createSignal } from "solid-js";

import RenderWorker from "render/worker?worker";
import {
  MessageFromMainToRenderDataType,
  SetupMessageFromMainToRenderData,
} from "render/messages";

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
  });

  return (
    <>
      <canvas ref={setCanvas} />
    </>
  );
};

export default App;
