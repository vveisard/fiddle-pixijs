/// <reference lib="ESNext" />
/// <reference lib="WebWorker" />

import { EntityWorldState } from "core/entity";
import * as PIXI from "@pixi/webworker";

import {
  AnyMessageFromMainToRenderData,
  MessageFromMainToRenderDataType,
} from "./messages";

declare var self: DedicatedWorkerGlobalScope;

interface RenderWorld {
  readonly renderEngine: PIXI.Application;
  readonly entities: EntityWorldState;
}

function createRenderEngine(params: {
  canvas: OffscreenCanvas;
}): PIXI.Application {
  const app = new PIXI.Application({
    view: params.canvas,
    background: 0x1099bb,
  });

  const container = new PIXI.Container();
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;
  app.stage.addChild(container);

  const circle = new PIXI.Graphics();
  circle.beginFill(0xffffff);
  circle.drawCircle(30, 30, 30);
  circle.endFill();
  container.addChild(circle);

  return app;
}

function createRenderWorld(params: {
  entities: EntityWorldState;
  engine: PIXI.Application;
}): RenderWorld {
  return {
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

      renderWorld = createRenderWorld({
        engine: createRenderEngine({
          canvas: messageData.offscreenCanvas,
        }),
        entities: messageData.initialEntityWorldState,
      });

      break;
    }
    default: {
      throw new Error(
        `Not implemented! MessageFromMainToRenderType '${messageData.messageDataType}'`
      );
    }
  }
});

// @region-end

// treat this file as a module
export {};
