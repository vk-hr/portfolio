import { cva } from "class-variance-authority";
import { cn } from "cn";
import { type HTMLMotionProps, motion } from "motion/react";

import { Footer } from "./-footer";
import { Header } from "./-header";

/** Width of the framed column shared by header, main and footer. */
export const COLUMN = "container mx-auto max-w-5xl";

type LayoutProps = React.PropsWithChildren<unknown>;

export function Layout({ children }: LayoutProps) {
	return (
		<div className="relative">
			<div
				className="pointer-events-none absolute inset-0 bg-diagonal-dashed"
				aria-hidden="true"
			/>
			<div className="relative z-10 flex min-h-screen flex-col overflow-hidden">
				{children}
			</div>
		</div>
	);
}

type PageProps = React.PropsWithChildren<{
	header?: boolean;
	className?: string;
}>;

/** Header, the bordered main column with corner marks, and footer. */
export function Page({ children, header = true, className }: PageProps) {
	return (
		<Layout>
			{header && <Header />}
			<div className="flex flex-1 flex-col px-4">
				<main
					id="main"
					className={cn(
						COLUMN,
						"relative flex flex-1 flex-col border-x-2 bg-background",
						className,
					)}
				>
					<CornerSquare position="top-left" />
					<CornerSquare position="top-right" />
					{children}
					<CornerSquare position="bottom-left" />
					<CornerSquare position="bottom-right" />
				</main>
			</div>
			<Footer />
		</Layout>
	);
}

type SectionHeadingProps = React.PropsWithChildren<{
	index: string;
	title: string;
	as?: "h1" | "h2";
	id?: string;
	className?: string;
}>;

/** Ruled section bar: mono index, grotesque title, optional trailing slot. */
export function SectionHeading({
	index,
	title,
	as: Heading = "h2",
	id,
	className,
	children,
}: SectionHeadingProps) {
	return (
		<div
			className={cn(
				"relative flex min-h-14 flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b-2 px-4 py-3",
				className,
			)}
		>
			<div className="flex items-baseline gap-4">
				<span className="type-label text-muted-foreground" aria-hidden="true">
					{index}
				</span>
				<Heading
					id={id}
					className="text-xl font-bold tracking-tight sm:text-2xl"
				>
					{title}
				</Heading>
			</div>
			{children}
			<CornerSquare position="bottom-left" />
			<CornerSquare position="bottom-right" />
		</div>
	);
}

const cornerSquareVariants = cva(
	"absolute z-30 size-3 rotate-45 border-2 bg-background",
	{
		variants: {
			position: {
				"top-left": "",
				"top-right": "",
				"bottom-left": "",
				"bottom-right": "",
			},
			mode: {
				offset: "",
				centered: "",
			},
		},
		compoundVariants: [
			{
				position: "top-left",
				mode: "offset",
				class: "-top-1.5 -left-1.5",
			},
			{
				position: "top-right",
				mode: "offset",
				class: "-top-1.5 -right-1.5",
			},
			{
				position: "bottom-left",
				mode: "offset",
				class: "-bottom-1.5 -left-1.5",
			},
			{
				position: "bottom-right",
				mode: "offset",
				class: "-right-1.5 -bottom-1.5",
			},
			{
				position: "top-left",
				mode: "centered",
				class: "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
			},
			{
				position: "top-right",
				mode: "centered",
				class: "top-0 right-0 translate-x-1/2 -translate-y-1/2",
			},
			{
				position: "bottom-left",
				mode: "centered",
				class: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
			},
			{
				position: "bottom-right",
				mode: "centered",
				class: "right-0 bottom-0 translate-x-1/2 translate-y-1/2",
			},
		],
		defaultVariants: {
			position: "top-left",
			mode: "offset",
		},
	},
);

type CornerSquareProps = HTMLMotionProps<"div"> & {
	position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	mode?: "offset" | "centered";
	className?: string;
};

export function CornerSquare({
	position,
	mode,
	className,
	...props
}: CornerSquareProps) {
	"use no memo";
	return (
		<motion.div
			className={cn(cornerSquareVariants({ position, mode }), className)}
			aria-hidden="true"
			{...props}
		/>
	);
}
