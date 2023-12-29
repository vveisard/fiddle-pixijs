// TODO from main to worker MessageData. enum, interfaces, and types

import { EntityWorldState } from "core/entity";

enum MessageFromMainToRenderDataType {
  Setup,
}

interface MessageFromMainToRenderData {
  readonly messageDataType: MessageFromMainToRenderDataType;
}

interface SetupMessageFromMainToRenderData extends MessageFromMainToRenderData {
  readonly messageDataType: MessageFromMainToRenderDataType.Setup;
  readonly offscreenCanvas: OffscreenCanvas;
  readonly initialEntityWorldState: EntityWorldState
}

type AnyMessageFromMainToRenderData = SetupMessageFromMainToRenderData;

export {
  MessageFromMainToRenderDataType,
  type SetupMessageFromMainToRenderData,
  type AnyMessageFromMainToRenderData,
};
