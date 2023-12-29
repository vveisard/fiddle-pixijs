EPIC as a user, I want vertical slice
  DESIGN
    - ./apps/web: solid app with vite and tailwind
    - ./libs/core: library with core functionality (like simulation state)
    - ./workers/render worker using pixlJS

    simply "entity chunkk:

  STORY I want to mock simulation state in client
    using solid store

  STORY I want to send setup message to render worker
    with offscreen canvas
  STORY I want to send simulation state update messages to render worker
    with diff


STORY as a user, I want to dispatch events from main thread to worker thread