import { BaseEntityWorldState, BaseEntityChunkState } from "base/entity";
import { EdgeType, VertexType } from "./common";

enum EntityType {
  Vertex,
  Edge,
}

interface BaseEntityState {
  readonly entityType: EntityType;
}

interface VertexEntityState extends BaseEntityState {
  readonly entityType: EntityType.Vertex;
  readonly vertexType: VertexType;
}

/**
 * Directed edge.
 */
interface EdgeEntityState extends BaseEntityState {
  readonly entityType: EntityType.Edge;
  readonly edgeType: EdgeType;

  /**
   * start of the edge.
   */
  readonly tailVertexEntityId: string;

  /**
   * end of the edge.
   */
  readonly headVertexEntityId: string;
}

/**
 * state of all entities in a world.
 */
interface EntityWorldState extends BaseEntityWorldState {
  readonly vertices: BaseEntityChunkState<VertexEntityState>;
  readonly edges: BaseEntityChunkState<EdgeEntityState>;
}

export { type EntityWorldState };

export { EntityType };
