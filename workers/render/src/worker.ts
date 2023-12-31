/// <reference lib="ESNext" />
/// <reference lib="WebWorker" />

import { IAdapter, settings } from "@pixi/core";
import { Application } from "@pixi/app";
import { Container } from "@pixi/display";
import { Graphics } from "@pixi/graphics";
import "@pixi/events";
//
import { EntityWorldState } from "core/entity";
//
import {
  AnyMessageFromMainToRenderData,
  MessageFromMainToRenderDataType,
  SetupMessageFromMainToRenderData,
} from "./messages";
//

// define "document" with no-ops for @pixi/events
Object.defineProperty(globalThis, "document", {
  value: {
    addEventListener() {
      // noop
    },
    removeEventListener() {
      // noop
    }
  },
  enumerable: true,
  configurable: false,
  writable: false,
});

declare var self: DedicatedWorkerGlobalScope;

// this code copied from the @pixi/webworker package.
// however, that module with side effects (that modifies @pixi/core/settings)
const WebWorkerAdapter: IAdapter = {
  /**
   * Creates a canvas element of the given size.
   * This canvas is created using the browser's native canvas element.
   * @param width - width of the canvas
   * @param height - height of the canvas
   */
  createCanvas: (width?: number, height?: number) =>
    new OffscreenCanvas(width ?? 0, height ?? 0),
  getCanvasRenderingContext2D: () => OffscreenCanvasRenderingContext2D,
  getWebGLRenderingContext: () => WebGLRenderingContext,
  getNavigator: () => navigator,
  getBaseUrl: () => globalThis.location.href,
  getFontFaceSet: () => (globalThis as unknown as WorkerGlobalScope).fonts,
  fetch: (url: RequestInfo, options?: RequestInit) => fetch(url, options),
  parseXML: (xml: string) => {
    const parser = new DOMParser();

    return parser.parseFromString(xml, "text/xml");
  },
} as IAdapter;
settings.ADAPTER = WebWorkerAdapter;

interface RenderWorld {
  readonly renderEngine: Application;
  readonly entities: EntityWorldState;
  readonly canvas: OffscreenCanvas;
}

function createRenderEngine(params: { canvas: OffscreenCanvas }): Application {
  const app = new Application({
    view: params.canvas,
    background: 0x1099bb,
    eventMode: 'passive',
    eventFeatures: {
      move: true,
      /** disables the global move events which can be very expensive in large scenes */
      globalMove: false,
      click: true,
      wheel: true
    }
  });

  app.stage.addEventListener('mousedown', function handleClick() {
    console.log('Hello world!');
  });
  app.stage.eventMode = 'static'

  const container = new Container();
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;
  app.stage.addChild(container);

  const circle = new Graphics();
  circle.beginFill(0xffffff);
  circle.drawCircle(0, 0, 1000);
  circle.endFill();
  circle.eventMode = 'static'
  circle.on('mousedown', () => console.log(`container`, `on`, `mousedown`))

  container.addChild(circle);

  return app;
}

function createRenderWorld(params: {
  canvas: OffscreenCanvas;
  entities: EntityWorldState;
  engine: Application;
}): RenderWorld {
  return {
    canvas: params.canvas,
    renderEngine: params.engine,
    entities: params.entities,
  };
}

// @region-begin main

let renderWorld: RenderWorld | undefined;

self.addEventListener("message", (ev) => {
  const messageData: AnyMessageFromMainToRenderData = ev.data;

  switch (messageData.messageDataType) {
    case MessageFromMainToRenderDataType.Setup: {
      if (renderWorld !== undefined) {
        throw new Error(`Invalid state! Already did Setup.`);
      }

      console.log(`worker`, `message`);

      renderWorld = createRenderWorld({
        canvas: messageData.offscreenCanvas,
        engine: createRenderEngine({
          canvas: messageData.offscreenCanvas,
        }),
        entities: messageData.initialEntityWorldState,
      });

      break;
    }

    case MessageFromMainToRenderDataType.ForwardInputEvent: {
      let event: Event;
      switch (messageData.eventType) {
        case "click": {
          event = new Event("click", messageData.eventInit);
          break;
        }
        case "mousedown": {
          event = new Event("mousedown", messageData.eventInit);
          break;
        }
        default: {
          throw new Error(
            `Not implemented! eventType '${messageData.eventType}'`
          );
        }
      }

      renderWorld.renderEngine.view.dispatchEvent(event);

      break;
    }
    default: {
      throw new Error(
        `Not implemented! MessageFromMainToRenderType '${(messageData as SetupMessageFromMainToRenderData).messageDataType
        }'`
      );
    }
  }
});

// @region-end

// treat this file as a module
export { };
