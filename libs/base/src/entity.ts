import { type ValueOf } from "type-fest";

// @region-begin

interface BaseEntityChunkState<TEntityState = unknown> {
  readonly ids: Array<string>;
  readonly entities: { [id: string]: TEntityState };
}

namespace BaseEntityChunkState {
  export function addOneEntity<
    TChunkState extends BaseEntityChunkState,
    TEntityState extends ValueOf<TChunkState["entities"]>
  >(baseChunkState: TChunkState, entityId: string, entityState: TEntityState) {
    return {
      id: [...baseChunkState.ids, entityId],
      entities: {
        ...baseChunkState.entities,
        entityState,
      },
    };
  }
}

export {
  BaseEntityChunkState
}

// @region-end

// @region-begin

interface BaseEntityWorldState {
  [chunkId: string]: BaseEntityChunkState<unknown>;
}

namespace BaseEntityWorldState {
  export function addOneEntity<
    TWorldState extends BaseEntityWorldState,
    TChunkId extends keyof TWorldState
  >(
    baseWorldState: TWorldState,
    chunkId: TChunkId,
    entityId: string,
    entityState: ValueOf<TWorldState[TChunkId]["entities"]>
  ) {
    // TODO use chunks instead
    return {
      ...baseWorldState,
      [chunkId]: BaseEntityChunkState.addOneEntity(
        baseWorldState[chunkId],
        entityId,
        entityState
      ),
    };
  }
}

export { BaseEntityWorldState };

// @region-end