/// <reference lib="DOM" />

import { EntityWorldState } from "core/entity";

enum MessageFromMainToRenderDataType {
  Setup,
  ForwardInputEvent,
}

interface MessageFromMainToRenderData {
  readonly messageDataType: MessageFromMainToRenderDataType;
}

interface SetupMessageFromMainToRenderData extends MessageFromMainToRenderData {
  readonly messageDataType: MessageFromMainToRenderDataType.Setup;
  readonly offscreenCanvas: OffscreenCanvas;
  readonly initialEntityWorldState: EntityWorldState;
}

interface ForwardInputEventMessageFromMainToRenderData
  extends MessageFromMainToRenderData {
  readonly messageDataType: MessageFromMainToRenderDataType.ForwardInputEvent;
  readonly eventType: 'click' | 'mousedown';
  readonly eventInit: PointerEventInit;
}

type AnyMessageFromMainToRenderData =
  | SetupMessageFromMainToRenderData
  | ForwardInputEventMessageFromMainToRenderData;

export {
  MessageFromMainToRenderDataType,
  type ForwardInputEventMessageFromMainToRenderData,
  type SetupMessageFromMainToRenderData,
  type AnyMessageFromMainToRenderData,
};
