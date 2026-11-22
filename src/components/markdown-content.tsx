type MarkdownContentProps = {
	html: string;
	className?: string;
};

export function MarkdownContent({ html, className }: MarkdownContentProps) {
	return (
		// biome-ignore lint/security/noDangerouslySetInnerHtml: trusted Markdown from content/, compiled to HTML at build time by content-collections
		<div className={className} dangerouslySetInnerHTML={{ __html: html }} />
	);
}
