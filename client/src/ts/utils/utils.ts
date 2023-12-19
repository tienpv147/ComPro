import MarkdownIt from "markdown-it";

export function convertMarkwdownToHtml(markdownContent: string): string {
    const md = new MarkdownIt();
    return md.render(markdownContent);
}

export function deleteTokenAndId(token: string, id: string) {
    if (!token || !id) return;
    localStorage.removeItem(token);
    localStorage.removeItem(id);
}
