import {
	defineCollection,
	defineConfig,
	defineSingleton,
} from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";
import remarkGfm from "remark-gfm";
import { z } from "zod";

import { colorSchema } from "./src/lib/colors";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case slug");

const technologies = defineSingleton({
	name: "technologies",
	typeName: "TechnologyMap",
	filePath: "content/technologies.yaml",
	parser: "yaml",
	schema: z.record(slug, z.object({ name: z.string(), color: colorSchema })),
	transform: ({ _meta, ...map }) => map,
});

const projects = defineCollection({
	name: "projects",
	directory: "content/projects",
	include: "*.md",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		status: z.enum(["pre-launch", "active", "completed", "archived"]),
		featured: z.boolean().default(false),
		date: z.iso.date(),
		repository: z.url().optional(),
		demo: z.url().optional(),
		/** Package registry page, e.g. https://www.npmjs.com/package/<name> */
		package: z.url().optional(),
		/** Path under public/, e.g. /projects/portfolio/cover.webp */
		cover: z.string().startsWith("/").optional(),
		/** Describes the cover for screen readers; without it the cover is decorative. */
		coverAlt: z.string().optional(),
		technologies: z.array(slug).default([]),
		content: z.string(),
	}),
	transform: async (doc, context) => {
		const [technologyMap = {}] = context.documents(technologies);
		const unknown = doc.technologies.filter((s) => !(s in technologyMap));
		if (unknown.length > 0) {
			throw new Error(
				`${doc._meta.filePath}: unknown technologies: ${unknown.join(", ")} (add them to content/technologies.yaml)`,
			);
		}

		const html = await compileMarkdown(context, doc, {
			remarkPlugins: [remarkGfm],
		});

		return { ...doc, slug: doc._meta.path, html };
	},
});

export default defineConfig({ content: [technologies, projects] });
