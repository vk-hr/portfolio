import { afterEach, expect } from "bun:test";

import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { MotionGlobalConfig } from "motion/react";

expect.extend(matchers);

// Tests check what the UI does, not how it animates. Motion's animations
// would also run on happy-dom's Web Animations, which reject on cancel.
MotionGlobalConfig.skipAnimations = true;

afterEach(() => {
	cleanup();
});
